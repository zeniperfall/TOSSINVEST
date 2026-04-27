// Theme + shared topbar wiring. Persists user choice in localStorage.

const STORAGE_KEY = 'tossinvest:theme';

export function initTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
  const theme = stored || (prefersDark ? 'dark' : 'light');
  applyTheme(theme);
}

export function toggleTheme() {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem(STORAGE_KEY, next);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    btn.setAttribute('aria-pressed', String(theme === 'dark'));
    const icon = btn.querySelector('[data-theme-icon]');
    if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  });
}

export function wireThemeToggle() {
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });
}

export function highlightNav(currentPage) {
  document.querySelectorAll('.gnb__item').forEach(a => {
    a.classList.toggle('gnb__item--active', a.dataset.page === currentPage);
  });
}

initTheme();
