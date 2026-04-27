(() => {
  'use strict';

  // ----- Mock series for each range (deterministic, stylized) -----
  // Each series is an array of {date, price}. The most recent point ends near current price.
  const CURRENT_PRICE = 948.32;
  const PREV_CLOSE = 929.58;

  function buildSeries(points, startPrice, endPrice, volatility, daySpan) {
    const series = [];
    const now = new Date();
    let price = startPrice;
    // Use a simple seeded PRNG for stable charts
    let seed = points * 9301 + Math.floor(startPrice);
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let i = 0; i < points; i++) {
      const t = i / (points - 1);
      // Glide toward endPrice with noise
      const drift = startPrice + (endPrice - startPrice) * t;
      price = drift + (rand() - 0.5) * volatility * (1 - Math.abs(t - 0.5));
      const d = new Date(now);
      const totalMs = daySpan * 24 * 60 * 60 * 1000;
      d.setTime(now.getTime() - totalMs + (totalMs * t));
      series.push({ date: d, price: Math.max(price, 1) });
    }
    // Force the last point exactly at endPrice
    series[series.length - 1].price = endPrice;
    return series;
  }

  const seriesByRange = {
    '1D':  buildSeries(78, PREV_CLOSE, CURRENT_PRICE, 6, 1),
    '1W':  buildSeries(60, 905.00, CURRENT_PRICE, 14, 7),
    '1M':  buildSeries(80, 870.00, CURRENT_PRICE, 26, 30),
    '3M':  buildSeries(90, 780.00, CURRENT_PRICE, 50, 90),
    '1Y':  buildSeries(120, 410.00, CURRENT_PRICE, 90, 365),
    '5Y':  buildSeries(140, 65.00, CURRENT_PRICE, 180, 365 * 5),
    'ALL': buildSeries(160, 0.45, CURRENT_PRICE, 220, 365 * 26),
  };

  // ----- Chart rendering -----
  const svg = document.getElementById('chart');
  const tooltip = document.getElementById('chartTooltip');
  const tooltipDate = document.getElementById('tooltipDate');
  const tooltipPrice = document.getElementById('tooltipPrice');

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const VB = { w: 720, h: 280, padX: 12, padTop: 16, padBottom: 28 };

  function fmtPrice(v) {
    return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function fmtDate(d, range) {
    const opts = (range === '1D')
      ? { hour: '2-digit', minute: '2-digit', hour12: false }
      : { year: 'numeric', month: 'short', day: 'numeric' };
    return new Intl.DateTimeFormat('ko-KR', opts).format(d);
  }

  let currentRange = '1W';
  let currentPoints = [];

  function renderChart(range) {
    currentRange = range;
    const data = seriesByRange[range];
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

    // gradient
    const defs = document.createElementNS(SVG_NS, 'defs');
    defs.innerHTML = `
      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stop-color="#3182f6" stop-opacity="0.22"/>
        <stop offset="100%" stop-color="#3182f6" stop-opacity="0"/>
      </linearGradient>`;
    svg.appendChild(defs);

    // grid lines (4 horizontal)
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
      const v = yMax - ((yMax - yMin) * i) / 4;
      label.textContent = fmtPrice(v);
      svg.appendChild(label);
    }

    // x-axis labels (3 evenly spaced)
    [0, Math.floor(points.length / 2), points.length - 1].forEach((i, idx) => {
      const p = points[i];
      const label = document.createElementNS(SVG_NS, 'text');
      label.setAttribute('class', 'axis-label');
      label.setAttribute('y', VB.h - 10);
      label.setAttribute('x', p.x);
      label.setAttribute('text-anchor', idx === 0 ? 'start' : idx === 2 ? 'end' : 'middle');
      label.textContent = fmtDate(p.raw.date, range);
      svg.appendChild(label);
    });

    // area path
    const linePath = points.map((p, i) => (i === 0 ? 'M' : 'L') + p.x.toFixed(2) + ' ' + p.y.toFixed(2)).join(' ');
    const area = document.createElementNS(SVG_NS, 'path');
    area.setAttribute('class', 'area');
    area.setAttribute('d',
      linePath +
      ` L ${(VB.w - VB.padX).toFixed(2)} ${(VB.padTop + usableH).toFixed(2)}` +
      ` L ${VB.padX.toFixed(2)} ${(VB.padTop + usableH).toFixed(2)} Z`
    );
    svg.appendChild(area);

    const line = document.createElementNS(SVG_NS, 'path');
    line.setAttribute('class', 'line');
    line.setAttribute('d', linePath);
    svg.appendChild(line);

    // hover layer
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
      if (d < minD) { minD = d; nearest = p; }
    }
    const hoverLine = svg.querySelector('.hover-line');
    const hoverDot = svg.querySelector('.hover-dot');
    if (hoverLine) { hoverLine.setAttribute('x1', nearest.x); hoverLine.setAttribute('x2', nearest.x); }
    if (hoverDot)  { hoverDot.setAttribute('cx', nearest.x);  hoverDot.setAttribute('cy', nearest.y); }

    tooltip.hidden = false;
    tooltip.style.left = (nearest.x / VB.w) * rect.width + 'px';
    tooltip.style.top = (nearest.y / VB.h) * rect.height + 'px';
    tooltipDate.textContent = fmtDate(nearest.raw.date, currentRange);
    tooltipPrice.textContent = fmtPrice(nearest.raw.price);
  }
  function onLeave() {
    tooltip.hidden = true;
    const hoverLine = svg.querySelector('.hover-line');
    const hoverDot = svg.querySelector('.hover-dot');
    if (hoverLine) { hoverLine.setAttribute('x1', -10); hoverLine.setAttribute('x2', -10); }
    if (hoverDot)  { hoverDot.setAttribute('cx', -10); hoverDot.setAttribute('cy', -10); }
  }
  svg.addEventListener('mousemove', onMove);
  svg.addEventListener('mouseleave', onLeave);
  svg.addEventListener('touchstart', onMove, { passive: true });
  svg.addEventListener('touchmove', onMove, { passive: true });
  svg.addEventListener('touchend', onLeave);

  // Range buttons
  document.querySelectorAll('.range__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.range__btn').forEach(b => b.classList.remove('range__btn--active'));
      btn.classList.add('range__btn--active');
      renderChart(btn.dataset.range);
    });
  });

  renderChart(currentRange);

  // ----- Tabs -----
  const tabBtns = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tab-panel');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('tab--active'));
      btn.classList.add('tab--active');
      panels.forEach(p => { p.hidden = p.dataset.panel !== btn.dataset.tab; });
    });
  });

  // ----- Order panel -----
  const priceInput = document.getElementById('orderPrice');
  const qtyInput = document.getElementById('orderQty');
  const totalEl = document.getElementById('orderTotal');
  const placeBtn = document.getElementById('placeOrder');
  const orderTabs = document.querySelectorAll('.order-tab');
  const AVAILABLE_KRW_USD = 12480.55;

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
    totalEl.textContent = '$' + total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  priceInput.addEventListener('input', updateTotal);
  qtyInput.addEventListener('input', updateTotal);

  document.querySelectorAll('.stepper__btn[data-step]').forEach(b => {
    b.addEventListener('click', () => {
      const step = parseFloat(b.dataset.step);
      const next = Math.max(0.01, parsePrice() + step);
      priceInput.value = next.toFixed(2);
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
      const qty = Math.floor((AVAILABLE_KRW_USD * pct) / price);
      qtyInput.value = String(qty);
      updateTotal();
    });
  });

  orderTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      orderTabs.forEach(t => t.classList.remove('order-tab--active'));
      tab.classList.add('order-tab--active');
      const isBuy = tab.dataset.side === 'buy';
      placeBtn.textContent = isBuy ? '구매하기' : '판매하기';
      placeBtn.style.background = isBuy ? '' : 'var(--down)';
    });
  });

  placeBtn.addEventListener('click', () => {
    const price = parsePrice();
    const qty = parseQty();
    if (qty <= 0) {
      placeBtn.animate(
        [{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }],
        { duration: 220 }
      );
      return;
    }
    const side = document.querySelector('.order-tab--active').dataset.side === 'buy' ? '구매' : '판매';
    const total = price * qty;
    placeBtn.textContent = `${side} 주문 접수됨 · $${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    placeBtn.disabled = true;
    setTimeout(() => {
      placeBtn.disabled = false;
      const isBuy = document.querySelector('.order-tab--active').dataset.side === 'buy';
      placeBtn.textContent = isBuy ? '구매하기' : '판매하기';
    }, 1800);
  });

  // ----- Star toggle -----
  const star = document.querySelector('.iconbtn--star');
  if (star) {
    star.addEventListener('click', () => {
      star.classList.toggle('is-on');
      const path = star.querySelector('path');
      if (path) path.setAttribute('fill', star.classList.contains('is-on') ? 'currentColor' : 'none');
    });
  }

  // Initial total compute
  updateTotal();
})();
