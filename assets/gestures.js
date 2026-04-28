// Mobile gestures: pull-to-refresh + horizontal swipe navigation between pages.

const PAGE_ORDER = ['home', 'stock', 'search', 'portfolio', 'history'];
const PAGE_URL = {
  home: './home.html',
  stock: './index.html',
  search: './search.html',
  portfolio: './portfolio.html',
  history: './history.html',
};

const PTR_THRESHOLD = 80;
const SWIPE_THRESHOLD = 80;

export function wireGestures(currentPage) {
  if (!('ontouchstart' in window)) return;

  let startX = 0;
  let startY = 0;
  let pulling = false;
  let swiping = false;
  let active = false;

  // Indicator element.
  const indicator = document.createElement('div');
  indicator.className = 'ptr-indicator';
  indicator.textContent = '↓ 당겨서 새로고침';
  document.body.appendChild(indicator);

  function onStart(e) {
    if (e.touches.length !== 1) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    pulling = window.scrollY <= 0;
    swiping = false;
    active = false;
  }

  function onMove(e) {
    if (e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;

    // Distinguish between vertical pull and horizontal swipe.
    if (!swiping && !pulling) return;
    if (Math.abs(dx) > Math.abs(dy) * 1.5) {
      swiping = true;
      pulling = false;
    } else if (pulling && dy > 10) {
      // Pulling down from top.
      indicator.classList.add('is-visible');
      if (dy > PTR_THRESHOLD) {
        indicator.classList.add('is-active');
        indicator.textContent = '↑ 놓으면 새로고침';
        active = true;
      } else {
        indicator.classList.remove('is-active');
        indicator.textContent = '↓ 당겨서 새로고침';
        active = false;
      }
    }
  }

  function onEnd(e) {
    const dx = (e.changedTouches?.[0]?.clientX ?? startX) - startX;
    if (active) {
      indicator.textContent = '↻ 새로고침 중…';
      setTimeout(() => location.reload(), 200);
    } else {
      indicator.classList.remove('is-visible', 'is-active');
    }
    if (swiping && Math.abs(dx) > SWIPE_THRESHOLD) {
      navigate(currentPage, dx < 0 ? 1 : -1);
    }
    pulling = false;
    swiping = false;
    active = false;
  }

  document.addEventListener('touchstart', onStart, { passive: true });
  document.addEventListener('touchmove', onMove, { passive: true });
  document.addEventListener('touchend', onEnd, { passive: true });
}

function navigate(currentPage, direction) {
  const idx = PAGE_ORDER.indexOf(currentPage);
  if (idx < 0) return;
  const nextIdx = (idx + direction + PAGE_ORDER.length) % PAGE_ORDER.length;
  const next = PAGE_ORDER[nextIdx];
  if (PAGE_URL[next]) location.href = PAGE_URL[next];
}

export function _testNavigate(currentPage, direction) {
  navigate(currentPage, direction);
}
