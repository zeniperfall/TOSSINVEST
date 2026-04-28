import { STOCKS, ORDER_HISTORY, fmtPrice } from './data.js';
import { wireThemeToggle, highlightNav } from './theme.js';
import { wireLocaleToggle, t, onLocaleChange } from './i18n.js';
import { wireGestures } from './gestures.js';
import './error-reporter.js';
import { wireAutocomplete } from './autocomplete.js';

wireThemeToggle();
wireLocaleToggle();
wireGestures('history');
highlightNav('history');
wireAutocomplete();

const body = document.getElementById('historyBody');
const countEl = document.getElementById('historyCount');
let activeFilter = 'all';

function statusClass(status) {
  if (status === '체결') return 'badge badge--filled';
  if (status === '미체결') return 'badge badge--pending';
  if (status === '취소') return 'badge badge--canceled';
  return 'badge';
}

function render() {
  const matches = ORDER_HISTORY.filter(o => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'buy' || activeFilter === 'sell') return o.side === activeFilter;
    return o.status === activeFilter;
  });

  countEl.textContent = `· ${matches.length}건`;

  body.innerHTML = matches
    .map(o => {
      const s = STOCKS[o.code];
      const sideLabel = o.side === 'buy' ? t('history.filterBuy') : t('history.filterSell');
      const sideClass = o.side === 'buy' ? 'up' : 'down';
      const statusLabel =
        o.status === '체결'
          ? t('history.filterFilled')
          : o.status === '미체결'
            ? t('history.filterPending')
            : t('history.filterCanceled');
      const typeLabel =
        o.type === '지정가'
          ? t('order.type.limit')
          : o.type === '시장가'
            ? t('order.type.market')
            : t('order.type.reserved');
      return `
        <tr>
          <td>
            <div>${o.placedAt.split(' ')[0]}</div>
            <div class="small muted">${o.placedAt.split(' ')[1]}</div>
          </td>
          <td>
            <a class="holdings-name" href="./index.html?focusedProductCode=${o.code}">
              <span class="rank__logo" style="background:${s?.logoColor ?? '#ccc'}">${s?.logo ?? '?'}</span>
              <span>
                <strong>${s?.nameKo ?? o.code}</strong>
                <span class="small muted">${s?.ticker ?? ''}</span>
              </span>
            </a>
          </td>
          <td class="${sideClass}"><strong>${sideLabel}</strong></td>
          <td>${typeLabel}</td>
          <td>${o.qty.toLocaleString()}</td>
          <td>${fmtPrice(o.price, s?.currency ?? 'USD')}</td>
          <td><span class="${statusClass(o.status)}">${statusLabel}</span></td>
        </tr>`;
    })
    .join('');

  if (matches.length === 0) {
    body.innerHTML = `<tr><td colspan="7" class="empty">${t('history.empty')}</td></tr>`;
  }
}

document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('chip--active'));
    chip.classList.add('chip--active');
    activeFilter = chip.dataset.filter;
    render();
  });
});

render();
onLocaleChange(render);
