// 3-way theme: 'auto' (follows system), 'light', 'dark'.
// Persists user choice in localStorage. 'auto' defers to prefers-color-scheme.

const STORAGE_KEY = 'tossinvest:theme';
const VALID = ['auto', 'light', 'dark'];

const mql = window.matchMedia?.('(prefers-color-scheme: dark)');

export function getThemePreference() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return VALID.includes(stored) ? stored : 'auto';
}

export function getEffectiveTheme(pref = getThemePreference()) {
  if (pref === 'auto') return mql?.matches ? 'dark' : 'light';
  return pref;
}

export function initTheme() {
  applyTheme(getThemePreference());
  // Re-apply when system preference changes (only matters in auto mode).
  mql?.addEventListener?.('change', () => {
    if (getThemePreference() === 'auto') applyTheme('auto');
  });
}

export function cycleTheme() {
  const order = ['auto', 'light', 'dark'];
  const current = getThemePreference();
  const next = order[(order.indexOf(current) + 1) % order.length];
  localStorage.setItem(STORAGE_KEY, next);
  applyTheme(next);
  return next;
}

function applyTheme(pref) {
  const effective = getEffectiveTheme(pref);
  document.documentElement.setAttribute('data-theme', effective);
  document.documentElement.setAttribute('data-theme-pref', pref);
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    btn.setAttribute('aria-pressed', String(effective === 'dark'));
    btn.setAttribute('title', `테마: ${pref}`);
    const icon = btn.querySelector('[data-theme-icon]');
    if (icon) {
      icon.textContent = pref === 'auto' ? '🖥️' : effective === 'dark' ? '☀️' : '🌙';
    }
  });
}

export function wireThemeToggle() {
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    btn.addEventListener('click', cycleTheme);
  });
}

export function highlightNav(currentPage) {
  document.querySelectorAll('.gnb__item').forEach(a => {
    a.classList.toggle('gnb__item--active', a.dataset.page === currentPage);
  });
}

initTheme();
