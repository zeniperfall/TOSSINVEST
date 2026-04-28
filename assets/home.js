import { STOCKS, MARKET, fmtPrice } from './data.js';
import { wireThemeToggle, highlightNav } from './theme.js';
import { wireLocaleToggle } from './i18n.js';
import { wireGestures } from './gestures.js';
import './error-reporter.js';
import { wireAutocomplete } from './autocomplete.js';
import { getWatchlist, subscribe as subscribeWatchlist } from './watchlist.js';

wireThemeToggle();
wireLocaleToggle();
wireGestures('home');
highlightNav('home');
wireAutocomplete();

// Indices.
document.getElementById('indices').innerHTML = MARKET.indices
  .map(idx => {
    const up = idx.change >= 0;
    return `
      <div class="card index-card">
        <div class="index-card__name">${idx.name}</div>
        <div class="index-card__value">${idx.value.toLocaleString('en-US', {
          maximumFractionDigits: 2,
        })}</div>
        <div class="index-card__change ${up ? 'up' : 'down'}">
          ${up ? '▲' : '▼'} ${Math.abs(idx.change).toFixed(2)}%
        </div>
      </div>`;
  })
  .join('');

function rankRow(code, idx) {
  const s = STOCKS[code];
  if (!s) return '';
  const abs = s.price - s.prevClose;
  const pct = (abs / s.prevClose) * 100;
  const up = abs >= 0;
  return `
    <li class="rank__item">
      <a class="rank__link" href="./index.html?focusedProductCode=${s.code}">
        <span class="rank__num">${idx + 1}</span>
        <span class="rank__logo" style="background:${s.logoColor}">${s.logo}</span>
        <span class="rank__main">
          <span class="rank__name">${s.nameKo}</span>
          <span class="rank__ticker">${s.ticker} · ${s.market}</span>
        </span>
        <span class="rank__price">
          <span>${fmtPrice(s.price, s.currency)}</span>
          <span class="${up ? 'up' : 'down'}">${up ? '+' : ''}${pct.toFixed(2)}%</span>
        </span>
      </a>
    </li>`;
}

function renderWatchlist() {
  const codes = getWatchlist();
  const section = document.getElementById('watchlistSection');
  const countEl = document.getElementById('watchlistCount');
  const ul = document.getElementById('watchlist');
  if (codes.length === 0) {
    section.hidden = true;
    return;
  }
  section.hidden = false;
  countEl.textContent = `· ${codes.length}개`;
  ul.innerHTML = codes
    .filter(c => STOCKS[c])
    .map((c, i) => rankRow(c, i))
    .join('');
}
renderWatchlist();
subscribeWatchlist(renderWatchlist);

document.getElementById('trending').innerHTML = MARKET.trending
  .map((c, i) => rankRow(c, i))
  .join('');

document.getElementById('gainers').innerHTML = MARKET.movers.gainers
  .map((c, i) => rankRow(c, i))
  .join('');

document.getElementById('losers').innerHTML = MARKET.movers.losers
  .map((c, i) => rankRow(c, i))
  .join('');
