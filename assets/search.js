import { STOCKS, fmtPrice } from './data.js';
import { wireThemeToggle, highlightNav } from './theme.js';
import { wireAutocomplete } from './autocomplete.js';

wireThemeToggle();
highlightNav('search');
wireAutocomplete();

const params = new URLSearchParams(window.location.search);
const initialQuery = params.get('q') || '';

const input = document.getElementById('searchInput');
const resultsEl = document.getElementById('searchResults');
const countEl = document.getElementById('resultCount');
input.value = initialQuery;

function render(q) {
  const norm = q.trim().toLowerCase();
  const all = Object.values(STOCKS);
  const matches = norm
    ? all.filter(s =>
        [s.ticker, s.nameKo, s.nameEn, s.code].some(v => v.toLowerCase().includes(norm))
      )
    : all;

  countEl.textContent = norm ? `· ${matches.length}건` : `· ${all.length}건 (전체)`;

  resultsEl.innerHTML = matches
    .map((s, i) => {
      const abs = s.price - s.prevClose;
      const pct = (abs / s.prevClose) * 100;
      const up = abs >= 0;
      return `
        <li class="rank__item">
          <a class="rank__link" href="./index.html?focusedProductCode=${s.code}">
            <span class="rank__num">${i + 1}</span>
            <span class="rank__logo" style="background:${s.logoColor}">${s.logo}</span>
            <span class="rank__main">
              <span class="rank__name">${s.nameKo} <span class="muted small">${s.nameEn}</span></span>
              <span class="rank__ticker">${s.ticker} · ${s.market} · ${s.code}</span>
            </span>
            <span class="rank__price">
              <span>${fmtPrice(s.price, s.currency)}</span>
              <span class="${up ? 'up' : 'down'}">${up ? '+' : ''}${pct.toFixed(2)}%</span>
            </span>
          </a>
        </li>`;
    })
    .join('');

  if (matches.length === 0) {
    resultsEl.innerHTML = `<li class="empty">'${q}' 에 대한 결과가 없어요.</li>`;
  }
}

input.addEventListener('input', e => render(e.target.value));
render(initialQuery);
