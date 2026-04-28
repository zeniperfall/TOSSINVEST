import { STOCKS, HOLDINGS, fmtPrice } from './data.js';
import { wireThemeToggle, highlightNav } from './theme.js';
import { wireLocaleToggle } from './i18n.js';
import { wireGestures } from './gestures.js';
import './error-reporter.js';
import { wireAutocomplete } from './autocomplete.js';

wireThemeToggle();
wireLocaleToggle();
wireGestures('portfolio');
highlightNav('portfolio');
wireAutocomplete();

// Pre-compute USD-equivalent values for the pie + summary.
// (Convert KRW holdings at a fixed sample rate to keep the demo self-contained.)
const KRW_PER_USD = 1380;

function valueUSD(holding, stock) {
  const value = holding.qty * stock.price;
  const cost = holding.qty * holding.avgPrice;
  if (stock.currency === 'KRW') {
    return { value: value / KRW_PER_USD, cost: cost / KRW_PER_USD };
  }
  return { value, cost };
}

const rows = HOLDINGS.map(h => {
  const s = STOCKS[h.code];
  const { value, cost } = valueUSD(h, s);
  return { holding: h, stock: s, value, cost };
});

const totalValue = rows.reduce((a, r) => a + r.value, 0);
const totalCost = rows.reduce((a, r) => a + r.cost, 0);
const totalPnl = totalValue - totalCost;
const totalPct = (totalPnl / totalCost) * 100;

document.getElementById('totalValue').textContent =
  '$' + totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pnlEl = document.getElementById('totalPnl');
pnlEl.classList.add(totalPnl >= 0 ? 'up' : 'down');
pnlEl.textContent =
  (totalPnl >= 0 ? '+$' : '-$') +
  Math.abs(totalPnl).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) +
  '  (' +
  (totalPnl >= 0 ? '+' : '-') +
  Math.abs(totalPct).toFixed(2) +
  '%)';

// Pie chart via conic-gradient.
const palette = ['#3182f6', '#76b900', '#cc0000', '#1428a0', '#00a4ef', '#ffb020'];
let acc = 0;
const stops = rows
  .map((r, i) => {
    const start = (acc / totalValue) * 100;
    acc += r.value;
    const end = (acc / totalValue) * 100;
    return `${palette[i % palette.length]} ${start}% ${end}%`;
  })
  .join(',');
document.getElementById('pie').style.background = `conic-gradient(${stops})`;

document.getElementById('pieLegend').innerHTML = rows
  .map((r, i) => {
    const pct = (r.value / totalValue) * 100;
    return `
      <li>
        <span class="pie-legend__dot" style="background:${palette[i % palette.length]}"></span>
        <span class="pie-legend__name">${r.stock.nameKo}</span>
        <span class="pie-legend__pct">${pct.toFixed(1)}%</span>
      </li>`;
  })
  .join('');

// Holdings table.
document.getElementById('holdingsBody').innerHTML = rows
  .map(r => {
    const value = r.holding.qty * r.stock.price;
    const cost = r.holding.qty * r.holding.avgPrice;
    const pnl = value - cost;
    const pct = (pnl / cost) * 100;
    const up = pnl >= 0;
    return `
      <tr>
        <td>
          <a class="holdings-name" href="./index.html?focusedProductCode=${r.stock.code}">
            <span class="rank__logo" style="background:${r.stock.logoColor}">${r.stock.logo}</span>
            <span>
              <strong>${r.stock.nameKo}</strong>
              <span class="muted small">${r.stock.ticker}</span>
            </span>
          </a>
        </td>
        <td>${r.holding.qty.toLocaleString()}주</td>
        <td>${fmtPrice(r.holding.avgPrice, r.stock.currency)}</td>
        <td>${fmtPrice(r.stock.price, r.stock.currency)}</td>
        <td>${fmtPrice(value, r.stock.currency)}</td>
        <td class="${up ? 'up' : 'down'}">
          ${up ? '+' : '-'}${fmtPrice(Math.abs(pnl), r.stock.currency)}
          <div class="small">${up ? '+' : '-'}${Math.abs(pct).toFixed(2)}%</div>
        </td>
      </tr>`;
  })
  .join('');
