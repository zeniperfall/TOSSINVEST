// Lightweight search autocomplete for the topbar input.
// Keyboard: ArrowDown/Up navigates, Enter selects, Escape closes.

import { STOCKS } from './data.js';

export function wireAutocomplete(inputId = 'globalSearch') {
  const input = document.getElementById(inputId);
  if (!input) return;

  // Build dropdown container next to the input.
  const wrap = input.closest('label');
  if (!wrap) return;
  wrap.classList.add('search--autocomplete');

  const list = document.createElement('ul');
  list.className = 'autocomplete';
  list.setAttribute('role', 'listbox');
  list.hidden = true;
  wrap.appendChild(list);

  let items = [];
  let activeIndex = -1;

  const stocks = Object.values(STOCKS);

  function score(s, q) {
    const norm = q.toLowerCase();
    if (s.ticker.toLowerCase() === norm) return 100;
    if (s.nameKo === q) return 95;
    if (s.code.toLowerCase() === norm) return 90;
    if (s.ticker.toLowerCase().startsWith(norm)) return 80;
    if (s.nameKo.startsWith(q)) return 75;
    if (s.nameEn.toLowerCase().startsWith(norm)) return 65;
    if (s.nameKo.includes(q) || s.nameEn.toLowerCase().includes(norm)) return 50;
    if (s.ticker.toLowerCase().includes(norm) || s.code.toLowerCase().includes(norm)) return 40;
    return 0;
  }

  function render(q) {
    const ranked = stocks
      .map(s => ({ s, score: score(s, q) }))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    items = ranked.map(r => r.s);
    activeIndex = items.length > 0 ? 0 : -1;

    list.innerHTML = items
      .map(
        (s, i) => `
          <li class="autocomplete__item${i === activeIndex ? ' is-active' : ''}"
              role="option"
              data-code="${s.code}"
              data-i="${i}">
            <span class="rank__logo" style="background:${s.logoColor}">${s.logo}</span>
            <span class="autocomplete__main">
              <span class="autocomplete__name">${s.nameKo}</span>
              <span class="autocomplete__meta">${s.ticker} · ${s.market}</span>
            </span>
          </li>`
      )
      .join('');
    list.hidden = items.length === 0;
  }

  function jumpTo(stock) {
    if (!stock) return;
    window.location.href = `./index.html?focusedProductCode=${stock.code}`;
  }

  function highlight(idx) {
    activeIndex = ((idx % items.length) + items.length) % items.length;
    list.querySelectorAll('.autocomplete__item').forEach((el, i) => {
      el.classList.toggle('is-active', i === activeIndex);
    });
  }

  input.addEventListener('input', e => {
    const q = e.target.value.trim();
    if (!q) {
      list.hidden = true;
      items = [];
      return;
    }
    render(q);
  });

  input.addEventListener('keydown', e => {
    if (list.hidden || items.length === 0) {
      if (e.key === 'Enter' && input.value.trim()) {
        const q = input.value.trim();
        const found = stocks.find(
          s => s.ticker.toUpperCase() === q.toUpperCase() || s.nameKo === q
        );
        if (found) jumpTo(found);
        else window.location.href = `./search.html?q=${encodeURIComponent(q)}`;
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      highlight(activeIndex + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlight(activeIndex - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      jumpTo(items[activeIndex]);
    } else if (e.key === 'Escape') {
      list.hidden = true;
    }
  });

  list.addEventListener('mousedown', e => {
    const li = e.target.closest('.autocomplete__item');
    if (!li) return;
    e.preventDefault();
    const code = li.dataset.code;
    jumpTo(stocks.find(s => s.code === code));
  });

  document.addEventListener('click', e => {
    if (!wrap.contains(e.target)) list.hidden = true;
  });
}
