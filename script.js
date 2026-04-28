import {
  STOCKS,
  DEFAULT_CODE,
  HOLDINGS,
  MARKET,
  buildSeries,
  buildCandles,
  buildVolume,
  buildOrderBook,
  movingAverage,
  fmtPrice,
  fmtChange,
} from './assets/data.js';
import { wireThemeToggle, highlightNav } from './assets/theme.js';
import { subscribeTicker } from './assets/live.js';
import { wireAutocomplete } from './assets/autocomplete.js';
import { isWatched, toggleWatched } from './assets/watchlist.js';
import {
  getAlerts,
  addAlert,
  removeAlert,
  ensurePermission,
  notify,
  crossed,
} from './assets/notification.js';
import { wireLocaleToggle } from './assets/i18n.js';
import { wireGestures } from './assets/gestures.js';
import { backtest } from './assets/backtest.js';
import './assets/error-reporter.js';

wireLocaleToggle();
wireGestures('stock');

wireThemeToggle();
highlightNav('stock');
wireAutocomplete();

// ----- Resolve focused stock from URL -----
const params = new URLSearchParams(window.location.search);
const focusedCode = params.get('focusedProductCode') || DEFAULT_CODE;
const stock = STOCKS[focusedCode] || STOCKS[DEFAULT_CODE];

// ----- Hydrate header / metrics / profile / financials -----
function hydrate() {
  document.title = `${stock.nameKo} (${stock.ticker}) — 토스증권 스타일`;
  document.getElementById('stockName').textContent = stock.nameKo;
  document.getElementById('stockTicker').textContent = `${stock.ticker} · ${stock.market}`;
  document.getElementById('productCode').textContent = stock.code;

  const logo = document.getElementById('stockLogo');
  logo.style.background = stock.logoColor;
  logo.querySelector('span').textContent = stock.logo;

  document.getElementById('price').textContent = fmtPrice(stock.price, stock.currency);
  const abs = stock.price - stock.prevClose;
  const pct = (abs / stock.prevClose) * 100;
  const changeEl = document.getElementById('change');
  const changeText = document.getElementById('changeText');
  changeEl.classList.toggle('up', abs >= 0);
  changeEl.classList.toggle('down', abs < 0);
  changeText.textContent = fmtChange(abs, pct);

  // Metrics grid.
  const metrics = [
    ['시가', fmtPrice(stock.open, stock.currency)],
    ['고가', fmtPrice(stock.high, stock.currency)],
    ['저가', fmtPrice(stock.low, stock.currency)],
    ['거래량', stock.volume],
    ['전일 종가', fmtPrice(stock.prevClose, stock.currency)],
    ['52주 최고', fmtPrice(stock.high52, stock.currency)],
    ['52주 최저', fmtPrice(stock.low52, stock.currency)],
    ['시가총액', stock.marketCap],
    ['PER', stock.per.toFixed(2)],
    [
      'EPS',
      stock.currency === 'KRW'
        ? Math.round(stock.eps).toLocaleString() + '원'
        : '$' + stock.eps.toFixed(2),
    ],
  ];
  const ul = document.getElementById('metrics');
  ul.innerHTML = metrics
    .map(([k, v]) => `<li><span>${k}</span><strong>${v}</strong></li>`)
    .join('');

  // About + profile KV.
  document.getElementById('aboutText').textContent = stock.about;
  document.getElementById('profileKv').innerHTML = Object.entries({
    대표: stock.profile.ceo,
    본사: stock.profile.hq,
    설립: stock.profile.founded,
    업종: stock.profile.sector,
    상장일: stock.profile.ipo,
    홈페이지: stock.profile.site,
  })
    .map(([k, v]) => `<div><span>${k}</span><strong>${v}</strong></div>`)
    .join('');

  // Financials.
  document.querySelectorAll('th[data-fin]').forEach((th, i) => {
    th.textContent = stock.financials[i]?.year || '—';
  });
  const rows = [
    ['매출', 'rev'],
    ['영업이익', 'op'],
    ['순이익', 'net'],
    ['영업이익률', 'opm'],
    ['EPS', 'eps'],
  ];
  document.getElementById('finBody').innerHTML = rows
    .map(
      ([label, key]) =>
        `<tr><td>${label}</td>${stock.financials.map(f => `<td>${f[key]}</td>`).join('')}</tr>`
    )
    .join('');

  // Order panel defaults.
  const priceInput = document.getElementById('orderPrice');
  priceInput.value = stock.currency === 'KRW' ? Math.round(stock.price) : stock.price.toFixed(2);
  document.getElementById('priceUnit').textContent = stock.currency === 'KRW' ? '(KRW)' : '(USD)';
  document.getElementById('cashAvail').textContent =
    stock.currency === 'KRW' ? '12,480,550원' : '$12,480.55';

  // Holdings card.
  const held = HOLDINGS.find(h => h.code === stock.code);
  if (held) {
    document.getElementById('holdingsCard').hidden = false;
    document.getElementById('holdingTicker').textContent = stock.ticker;
    document.getElementById('holdingQty').textContent = held.qty + '주';
    document.getElementById('holdingAvg').textContent = fmtPrice(held.avgPrice, stock.currency);
    const value = held.qty * stock.price;
    const cost = held.qty * held.avgPrice;
    const pnl = value - cost;
    const pnlPct = (pnl / cost) * 100;
    document.getElementById('holdingValue').textContent = fmtPrice(value, stock.currency);
    const pnlEl = document.getElementById('holdingPnl');
    pnlEl.classList.toggle('up', pnl >= 0);
    pnlEl.classList.toggle('down', pnl < 0);
    pnlEl.textContent =
      (pnl >= 0 ? '+' : '') +
      fmtPrice(Math.abs(pnl), stock.currency) +
      `  (${pnl >= 0 ? '+' : '-'}${Math.abs(pnlPct).toFixed(2)}%)`;
  }
}
hydrate();

// ----- Chart -----
const svg = document.getElementById('chart');
const tooltip = document.getElementById('chartTooltip');
const tooltipDate = document.getElementById('tooltipDate');
const tooltipPrice = document.getElementById('tooltipPrice');
const SVG_NS = 'http://www.w3.org/2000/svg';
const VB = { w: 720, h: 280, padX: 12, padTop: 16, padBottom: 28 };

let currentRange = '1W';
let currentPoints = [];
let showBenchmark = false;
let chartMode = 'line'; // 'line' | 'candle'
let showMA = false;

function fmtTime(d, range) {
  const opts =
    range === '1D'
      ? { hour: '2-digit', minute: '2-digit', hour12: false }
      : { year: 'numeric', month: 'short', day: 'numeric' };
  return new Intl.DateTimeFormat('ko-KR', opts).format(d);
}

function renderChart(range) {
  currentRange = range;
  const data = buildSeries(stock, range);
  const prices = data.map(d => d.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const pad = (max - min) * 0.12 || 1;
  const yMin = min - pad;
  const yMax = max + pad;
  const usableW = VB.w - VB.padX * 2;
  const usableH = VB.h - VB.padTop - VB.padBottom;

  const points = data.map((d, i) => {
    const x = VB.padX + (i / (data.length - 1)) * usableW;
    const y = VB.padTop + (1 - (d.price - yMin) / (yMax - yMin)) * usableH;
    return { x, y, raw: d };
  });
  currentPoints = points;

  while (svg.firstChild) svg.removeChild(svg.firstChild);

  const defs = document.createElementNS(SVG_NS, 'defs');
  defs.innerHTML = `
    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"  stop-color="#3182f6" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#3182f6" stop-opacity="0"/>
    </linearGradient>`;
  svg.appendChild(defs);

  for (let i = 0; i <= 4; i++) {
    const y = VB.padTop + (usableH * i) / 4;
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('class', 'grid-line');
    line.setAttribute('x1', VB.padX);
    line.setAttribute('x2', VB.w - VB.padX);
    line.setAttribute('y1', y);
    line.setAttribute('y2', y);
    svg.appendChild(line);

    const label = document.createElementNS(SVG_NS, 'text');
    label.setAttribute('class', 'axis-label');
    label.setAttribute('x', VB.w - VB.padX);
    label.setAttribute('y', y - 3);
    label.setAttribute('text-anchor', 'end');
    label.textContent = fmtPrice(yMax - ((yMax - yMin) * i) / 4, stock.currency);
    svg.appendChild(label);
  }

  [0, Math.floor(points.length / 2), points.length - 1].forEach((i, idx) => {
    const p = points[i];
    const label = document.createElementNS(SVG_NS, 'text');
    label.setAttribute('class', 'axis-label');
    label.setAttribute('y', VB.h - 10);
    label.setAttribute('x', p.x);
    label.setAttribute('text-anchor', idx === 0 ? 'start' : idx === 2 ? 'end' : 'middle');
    label.textContent = fmtTime(p.raw.date, range);
    svg.appendChild(label);
  });

  const linePath = points
    .map((p, i) => (i === 0 ? 'M' : 'L') + p.x.toFixed(2) + ' ' + p.y.toFixed(2))
    .join(' ');

  if (chartMode === 'line') {
    const area = document.createElementNS(SVG_NS, 'path');
    area.setAttribute('class', 'area');
    area.setAttribute(
      'd',
      linePath +
        ` L ${(VB.w - VB.padX).toFixed(2)} ${(VB.padTop + usableH).toFixed(2)}` +
        ` L ${VB.padX.toFixed(2)} ${(VB.padTop + usableH).toFixed(2)} Z`
    );
    svg.appendChild(area);

    const line = document.createElementNS(SVG_NS, 'path');
    line.setAttribute('class', 'line');
    line.setAttribute('d', linePath);
    svg.appendChild(line);
  } else {
    // Candle mode
    const candles = buildCandles(stock, range);
    const candleW = Math.max(2, (usableW / candles.length) * 0.7);
    candles.forEach((c, i) => {
      const x = VB.padX + ((i + 0.5) / candles.length) * usableW;
      const yScale = v => VB.padTop + (1 - (v - yMin) / (yMax - yMin)) * usableH;
      const yOpen = yScale(c.open);
      const yClose = yScale(c.close);
      const yHigh = yScale(c.high);
      const yLow = yScale(c.low);
      const up = c.close >= c.open;

      const wick = document.createElementNS(SVG_NS, 'line');
      wick.setAttribute('class', up ? 'candle-wick up' : 'candle-wick down');
      wick.setAttribute('x1', x);
      wick.setAttribute('x2', x);
      wick.setAttribute('y1', yHigh);
      wick.setAttribute('y2', yLow);
      svg.appendChild(wick);

      const body = document.createElementNS(SVG_NS, 'rect');
      body.setAttribute('class', up ? 'candle-body up' : 'candle-body down');
      body.setAttribute('x', x - candleW / 2);
      body.setAttribute('y', Math.min(yOpen, yClose));
      body.setAttribute('width', candleW);
      body.setAttribute('height', Math.max(1, Math.abs(yClose - yOpen)));
      svg.appendChild(body);
    });
  }

  if (showMA) {
    const maValues = movingAverage(data, 20);
    const segments = [];
    let curSeg = '';
    points.forEach((p, i) => {
      const v = maValues[i];
      if (v === null) {
        if (curSeg) {
          segments.push(curSeg);
          curSeg = '';
        }
        return;
      }
      const y = VB.padTop + (1 - (v - yMin) / (yMax - yMin)) * usableH;
      curSeg += (curSeg ? ' L' : 'M') + p.x.toFixed(2) + ' ' + y.toFixed(2);
    });
    if (curSeg) segments.push(curSeg);
    segments.forEach(seg => {
      const ma = document.createElementNS(SVG_NS, 'path');
      ma.setAttribute('class', 'ma-line');
      ma.setAttribute('d', seg);
      svg.appendChild(ma);
    });
  }

  if (showBenchmark) {
    const bench = MARKET.benchmark.series.slice(-points.length);
    const bMin = Math.min(...bench);
    const bMax = Math.max(...bench);
    // Map benchmark to the same display window.
    const bPath = bench
      .map((v, i) => {
        const x = VB.padX + (i / (bench.length - 1)) * usableW;
        const norm = (v - bMin) / (bMax - bMin || 1);
        const yVal = yMin + norm * (yMax - yMin);
        const y = VB.padTop + (1 - (yVal - yMin) / (yMax - yMin)) * usableH;
        return (i === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2);
      })
      .join(' ');
    const benchLine = document.createElementNS(SVG_NS, 'path');
    benchLine.setAttribute('class', 'bench-line');
    benchLine.setAttribute('d', bPath);
    svg.appendChild(benchLine);
  }

  const hoverLine = document.createElementNS(SVG_NS, 'line');
  hoverLine.setAttribute('class', 'hover-line');
  hoverLine.setAttribute('y1', VB.padTop);
  hoverLine.setAttribute('y2', VB.padTop + usableH);
  hoverLine.setAttribute('x1', -10);
  hoverLine.setAttribute('x2', -10);
  svg.appendChild(hoverLine);

  const hoverDot = document.createElementNS(SVG_NS, 'circle');
  hoverDot.setAttribute('class', 'hover-dot');
  hoverDot.setAttribute('r', 4.5);
  hoverDot.setAttribute('cx', -10);
  hoverDot.setAttribute('cy', -10);
  svg.appendChild(hoverDot);
}

function onMove(evt) {
  if (!currentPoints.length) return;
  const rect = svg.getBoundingClientRect();
  const xClient = (evt.touches ? evt.touches[0].clientX : evt.clientX) - rect.left;
  const xVB = (xClient / rect.width) * VB.w;
  let nearest = currentPoints[0];
  let minD = Infinity;
  for (const p of currentPoints) {
    const d = Math.abs(p.x - xVB);
    if (d < minD) {
      minD = d;
      nearest = p;
    }
  }
  const hoverLine = svg.querySelector('.hover-line');
  const hoverDot = svg.querySelector('.hover-dot');
  if (hoverLine) {
    hoverLine.setAttribute('x1', nearest.x);
    hoverLine.setAttribute('x2', nearest.x);
  }
  if (hoverDot) {
    hoverDot.setAttribute('cx', nearest.x);
    hoverDot.setAttribute('cy', nearest.y);
  }
  tooltip.hidden = false;
  tooltip.style.left = (nearest.x / VB.w) * rect.width + 'px';
  tooltip.style.top = (nearest.y / VB.h) * rect.height + 'px';
  tooltipDate.textContent = fmtTime(nearest.raw.date, currentRange);
  tooltipPrice.textContent = fmtPrice(nearest.raw.price, stock.currency);
}
function onLeave() {
  tooltip.hidden = true;
  const hoverLine = svg.querySelector('.hover-line');
  const hoverDot = svg.querySelector('.hover-dot');
  if (hoverLine) {
    hoverLine.setAttribute('x1', -10);
    hoverLine.setAttribute('x2', -10);
  }
  if (hoverDot) {
    hoverDot.setAttribute('cx', -10);
    hoverDot.setAttribute('cy', -10);
  }
}
svg.addEventListener('mousemove', onMove);
svg.addEventListener('mouseleave', onLeave);
svg.addEventListener('touchstart', onMove, { passive: true });
svg.addEventListener('touchmove', onMove, { passive: true });
svg.addEventListener('touchend', onLeave);

document.querySelectorAll('.range__btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.range__btn').forEach(b => b.classList.remove('range__btn--active'));
    btn.classList.add('range__btn--active');
    renderChart(btn.dataset.range);
  });
});

document.getElementById('benchmarkToggle').addEventListener('change', e => {
  showBenchmark = e.target.checked;
  renderChart(currentRange);
});

document.getElementById('maToggle').addEventListener('change', e => {
  showMA = e.target.checked;
  renderChart(currentRange);
});

document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('mode-btn--active'));
    btn.classList.add('mode-btn--active');
    chartMode = btn.dataset.mode;
    renderChart(currentRange);
  });
});

// ----- Volume bar chart -----
const volSvg = document.getElementById('volumeChart');
const VOL_VB = { w: 720, h: 60, padX: 12, padTop: 4, padBottom: 4 };
function renderVolume(range) {
  while (volSvg.firstChild) volSvg.removeChild(volSvg.firstChild);
  const bars = buildVolume(stock, range);
  const max = Math.max(...bars.map(b => b.volume));
  const usableW = VOL_VB.w - VOL_VB.padX * 2;
  const usableH = VOL_VB.h - VOL_VB.padTop - VOL_VB.padBottom;
  const barW = Math.max(2, (usableW / bars.length) * 0.7);
  bars.forEach((b, i) => {
    const x = VOL_VB.padX + ((i + 0.5) / bars.length) * usableW - barW / 2;
    const h = (b.volume / max) * usableH;
    const rect = document.createElementNS(SVG_NS, 'rect');
    rect.setAttribute('class', b.up ? 'vol-bar up' : 'vol-bar down');
    rect.setAttribute('x', x);
    rect.setAttribute('y', VOL_VB.padTop + (usableH - h));
    rect.setAttribute('width', barW);
    rect.setAttribute('height', h);
    volSvg.appendChild(rect);
  });
}

function renderAll(range) {
  renderChart(range);
  renderVolume(range);
  renderBacktest(range);
}

function renderBacktest(range) {
  const series = buildSeries(stock, range);
  const r = backtest(series);
  const el = document.getElementById('backtest');
  if (!el || !r) return;
  const upClass = v => (v >= 0 ? 'up' : 'down');
  el.innerHTML = `
    <div><span>총 수익률</span><strong class="${upClass(r.totalReturn)}">${r.totalReturn >= 0 ? '+' : ''}${r.totalReturn.toFixed(2)}%</strong></div>
    <div><span>최대 낙폭(MDD)</span><strong class="down">${r.maxDrawdown.toFixed(2)}%</strong></div>
    <div><span>변동성 (연환산)</span><strong>${r.volatility.toFixed(2)}%</strong></div>
    <div><span>샤프 비율</span><strong class="${upClass(r.sharpe)}">${r.sharpe.toFixed(2)}</strong></div>
    <div><span>구간 시작</span><strong>${fmtPrice(r.start, stock.currency)}</strong></div>
    <div><span>구간 종료</span><strong>${fmtPrice(r.end, stock.currency)}</strong></div>
  `;
}

// Override range button + toggle handlers to also re-render volume + backtest.
document.querySelectorAll('.range__btn').forEach(btn => {
  btn.addEventListener('click', () => {
    renderVolume(btn.dataset.range);
    renderBacktest(btn.dataset.range);
  });
});

renderAll(currentRange);

// ----- Order book -----
function renderOrderBook() {
  const { asks, bids } = buildOrderBook(stock);
  const maxQty = Math.max(...[...asks, ...bids].map(r => r.qty));
  const html = `
    <div class="ob-section ob-section--ask">
      ${asks
        .map(
          r =>
            `<div class="ob-row">
              <div class="ob-bar ob-bar--ask" style="--w:${(r.qty / maxQty) * 100}%"></div>
              <div class="ob-price down">${fmtPrice(r.price, stock.currency)}</div>
              <div class="ob-qty">${r.qty.toLocaleString()}</div>
            </div>`
        )
        .join('')}
    </div>
    <div class="ob-current">
      <span>현재가</span>
      <strong>${fmtPrice(stock.price, stock.currency)}</strong>
    </div>
    <div class="ob-section ob-section--bid">
      ${bids
        .map(
          r =>
            `<div class="ob-row">
              <div class="ob-bar ob-bar--bid" style="--w:${(r.qty / maxQty) * 100}%"></div>
              <div class="ob-price up">${fmtPrice(r.price, stock.currency)}</div>
              <div class="ob-qty">${r.qty.toLocaleString()}</div>
            </div>`
        )
        .join('')}
    </div>`;
  document.getElementById('orderbook').innerHTML = html;
}
renderOrderBook();

// Click an order book row -> set order price.
document.getElementById('orderbook').addEventListener('click', e => {
  const row = e.target.closest('.ob-row');
  if (!row) return;
  const priceText = row.querySelector('.ob-price').textContent.replace(/[^0-9.]/g, '');
  const v = parseFloat(priceText);
  if (isFinite(v)) {
    document.getElementById('orderPrice').value =
      stock.currency === 'KRW' ? Math.round(v) : v.toFixed(2);
    updateTotal();
  }
});

// ----- Tabs -----
const tabBtns = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.tab-panel');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('tab--active'));
    btn.classList.add('tab--active');
    panels.forEach(p => {
      p.hidden = p.dataset.panel !== btn.dataset.tab;
    });
  });
});

// ----- Order panel -----
const priceInput = document.getElementById('orderPrice');
const qtyInput = document.getElementById('orderQty');
const totalEl = document.getElementById('orderTotal');
const placeBtn = document.getElementById('placeOrder');
const orderTabs = document.querySelectorAll('.order-tab');
const AVAIL = stock.currency === 'KRW' ? 12480550 : 12480.55;

function parsePrice() {
  const v = parseFloat(priceInput.value.replace(/,/g, ''));
  return isFinite(v) && v > 0 ? v : 0;
}
function parseQty() {
  const v = parseInt(qtyInput.value, 10);
  return isFinite(v) && v >= 0 ? v : 0;
}
function updateTotal() {
  const total = parsePrice() * parseQty();
  totalEl.textContent = fmtPrice(total, stock.currency);
}
priceInput.addEventListener('input', updateTotal);
qtyInput.addEventListener('input', updateTotal);

document.querySelectorAll('.stepper__btn[data-step]').forEach(b => {
  b.addEventListener('click', () => {
    const step = parseFloat(b.dataset.step);
    const tick = stock.currency === 'KRW' ? 100 : 0.05;
    const next = Math.max(tick, parsePrice() + step * tick);
    priceInput.value = stock.currency === 'KRW' ? Math.round(next) : next.toFixed(2);
    updateTotal();
  });
});
document.querySelectorAll('.stepper__btn[data-qty]').forEach(b => {
  b.addEventListener('click', () => {
    const step = parseInt(b.dataset.qty, 10);
    qtyInput.value = String(Math.max(0, parseQty() + step));
    updateTotal();
  });
});

document.querySelectorAll('.quick button[data-pct]').forEach(b => {
  b.addEventListener('click', () => {
    const pct = parseInt(b.dataset.pct, 10) / 100;
    const price = parsePrice();
    if (price <= 0) return;
    qtyInput.value = String(Math.floor((AVAIL * pct) / price));
    updateTotal();
  });
});

orderTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    orderTabs.forEach(t => t.classList.remove('order-tab--active'));
    tab.classList.add('order-tab--active');
    const isBuy = tab.dataset.side === 'buy';
    placeBtn.textContent = isBuy ? '구매하기' : '판매하기';
    placeBtn.classList.toggle('btn--sell', !isBuy);
  });
});

placeBtn.addEventListener('click', () => {
  const price = parsePrice();
  const qty = parseQty();
  if (qty <= 0) {
    placeBtn.animate(
      [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-6px)' },
        { transform: 'translateX(6px)' },
        { transform: 'translateX(0)' },
      ],
      { duration: 220 }
    );
    return;
  }
  const isBuy = document.querySelector('.order-tab--active').dataset.side === 'buy';
  const total = price * qty;
  placeBtn.textContent = `${isBuy ? '구매' : '판매'} 주문 접수됨 · ${fmtPrice(total, stock.currency)}`;
  placeBtn.disabled = true;
  setTimeout(() => {
    placeBtn.disabled = false;
    placeBtn.textContent = isBuy ? '구매하기' : '판매하기';
  }, 1800);
});

const star = document.querySelector('.iconbtn--star');
function reflectStar(on) {
  star.classList.toggle('is-on', on);
  const path = star.querySelector('path');
  if (path) path.setAttribute('fill', on ? 'currentColor' : 'none');
  star.setAttribute('aria-pressed', String(on));
}
if (star) {
  reflectStar(isWatched(stock.code));
  star.addEventListener('click', () => {
    const on = toggleWatched(stock.code);
    reflectStar(on);
  });
}

updateTotal();

// ----- Live ticker simulator -----
const priceEl = document.getElementById('price');
const changeEl = document.getElementById('change');
const changeTextEl = document.getElementById('changeText');
const holdingValueEl = document.getElementById('holdingValue');
const holdingPnlEl = document.getElementById('holdingPnl');

// Allow tests to crank up tick rate via ?live=fast.
const liveFast = new URLSearchParams(window.location.search).get('live') === 'fast';

let lastPrice = stock.price;

subscribeTicker(
  stock,
  ({ price }) => {
    priceEl.textContent = fmtPrice(price, stock.currency);
    priceEl.classList.remove('flash');
    void priceEl.offsetWidth;
    priceEl.classList.add('flash');

    const abs = price - stock.prevClose;
    const pct = (abs / stock.prevClose) * 100;
    changeEl.classList.toggle('up', abs >= 0);
    changeEl.classList.toggle('down', abs < 0);
    changeTextEl.textContent = fmtChange(abs, pct);

    const held = HOLDINGS.find(h => h.code === stock.code);
    if (held && holdingValueEl) {
      const value = held.qty * price;
      const cost = held.qty * held.avgPrice;
      const pnl = value - cost;
      const pnlPct = (pnl / cost) * 100;
      holdingValueEl.textContent = fmtPrice(value, stock.currency);
      holdingPnlEl.classList.toggle('up', pnl >= 0);
      holdingPnlEl.classList.toggle('down', pnl < 0);
      holdingPnlEl.textContent =
        (pnl >= 0 ? '+' : '') +
        fmtPrice(Math.abs(pnl), stock.currency) +
        `  (${pnl >= 0 ? '+' : '-'}${Math.abs(pnlPct).toFixed(2)}%)`;
    }

    // Price alerts.
    const remaining = [];
    for (const a of getAlerts().filter(a => a.code === stock.code)) {
      if (crossed(lastPrice, price, a.target, a.direction)) {
        notify(
          `${stock.nameKo} ${a.direction === 'above' ? '이상' : '이하'} 도달`,
          `현재가 ${fmtPrice(price, stock.currency)} · 목표 ${fmtPrice(a.target, stock.currency)}`
        );
      } else {
        remaining.push(a);
      }
    }
    // Remove triggered alerts.
    const all = getAlerts();
    if (remaining.length !== all.filter(a => a.code === stock.code).length) {
      const others = all.filter(a => a.code !== stock.code);
      localStorage.setItem('tossinvest:alerts', JSON.stringify([...others, ...remaining]));
      renderAlerts();
    }
    lastPrice = price;
  },
  { interval: liveFast ? 150 : 1500 }
);

// Alert UI wiring.
const alertList = document.getElementById('alertList');
const alertTargetInput = document.getElementById('alertTarget');
const alertDirSelect = document.getElementById('alertDirection');
const alertAddBtn = document.getElementById('alertAddBtn');

function renderAlerts() {
  const own = getAlerts().filter(a => a.code === stock.code);
  if (own.length === 0) {
    alertList.innerHTML = '';
    return;
  }
  alertList.innerHTML = own
    .map(
      a => `
        <li class="alert-item">
          <span>${a.direction === 'above' ? '↗' : '↘'} ${fmtPrice(a.target, stock.currency)}</span>
          <button class="link-btn" data-target="${a.target}">삭제</button>
        </li>`
    )
    .join('');
}

alertAddBtn?.addEventListener('click', async () => {
  const target = parseFloat(alertTargetInput.value.replace(/,/g, ''));
  if (!isFinite(target) || target <= 0) return;
  const direction = alertDirSelect.value;
  await ensurePermission();
  addAlert({ code: stock.code, target, direction });
  alertTargetInput.value = '';
  renderAlerts();
});

alertList?.addEventListener('click', e => {
  const btn = e.target.closest('button[data-target]');
  if (!btn) return;
  removeAlert(stock.code, parseFloat(btn.dataset.target));
  renderAlerts();
});

renderAlerts();
