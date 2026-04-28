import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;

const BASE = process.env.BASE_URL || 'http://localhost:8765';
const errors = [];
const ok = msg => console.log('✓', msg);
const fail = msg => {
  errors.push(msg);
  console.error('✗', msg);
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();

page.on('pageerror', err => fail('pageerror: ' + err.message));
page.on('console', msg => {
  if (msg.type() === 'error') {
    const t = msg.text();
    if (!/Failed to load resource|ERR_CERT|jsdelivr|cdn/i.test(t)) {
      fail('console.error: ' + t);
    }
  }
});

// Force KO locale at suite start so tests that assert Korean strings work
// regardless of Playwright's default browser language. Locale-specific tests
// (i18n) will explicitly override and reset.
await page.goto(`${BASE}/home.html`, { waitUntil: 'load' });
await page.evaluate(() => localStorage.setItem('tossinvest:locale', 'ko'));

// ========================== STOCK DETAIL ==========================
console.log('--- 1. Stock detail page (NVDA, default) ---');
await page.goto(`${BASE}/index.html?focusedProductCode=NAS0221219002`, { waitUntil: 'load' });
await page.waitForSelector('.chart .line');

if ((await page.textContent('#stockName')) !== '엔비디아') fail('NVDA name not rendered');
else ok('NVDA name renders');

const code = await page.textContent('#productCode');
if (!code.includes('NAS0221219002')) fail('productCode missing in header');
else ok('productCode reflected in header');

// Order book renders 10 rows (5 ask + 5 bid).
const obRows = await page.$$('.ob-row');
if (obRows.length !== 10) fail(`order book rows = ${obRows.length}, expected 10`);
else ok('order book has 10 rows');

// Click an ask row -> price should update.
const priceBefore = await page.inputValue('#orderPrice');
await page.click('.ob-section--ask .ob-row >> nth=0');
const priceAfter = await page.inputValue('#orderPrice');
if (priceBefore === priceAfter) fail('clicking order book did not update price');
else ok('order book click updates order price');

// Holdings card visible (NVDA is in mock holdings).
const holdingsHidden = await page.locator('#holdingsCard').evaluate(el => el.hidden);
if (holdingsHidden) fail('holdings card should be visible for NVDA');
else ok('holdings card visible for NVDA');

// Benchmark toggle adds bench-line.
await page.check('#benchmarkToggle');
await page.waitForTimeout(80);
const benchPresent = (await page.$('.chart .bench-line')) !== null;
if (!benchPresent) fail('benchmark line not rendered after toggle');
else ok('benchmark comparison line renders');

// Range switch.
const dBefore = await page.locator('.chart .line').getAttribute('d');
await page.click('.range__btn[data-range="1Y"]');
await page.waitForTimeout(120);
const dAfter = await page.locator('.chart .line').getAttribute('d');
if (!dBefore || dBefore === dAfter) fail('chart did not re-render on range change');
else ok('range change re-renders chart');

// Tabs.
await page.click('.tab[data-tab="financials"]');
const finVisible = await page.isVisible('[data-panel="financials"]');
if (!finVisible) fail('financials tab not visible');
else ok('tabs switch panels');

// Order math.
await page.fill('#orderQty', '3');
await page.dispatchEvent('#orderQty', 'input');
const total = await page.textContent('#orderTotal');
if (!/\$/.test(total)) fail('order total currency wrong: ' + total);
else ok('order total computes: ' + total);

// Sell tab swaps button.
await page.click('.order-tab--sell');
const placeText = await page.textContent('#placeOrder');
if (!/판매하기/.test(placeText)) fail('sell tab did not change button label');
else ok('sell tab swaps button label');

// ========================== DARK MODE ==========================
console.log('--- 2. Dark mode toggle ---');
// 3-way cycle: auto(default) → light → dark → auto. Set explicit dark for determinism.
await page.evaluate(() => localStorage.setItem('tossinvest:theme', 'dark'));
await page.reload({ waitUntil: 'load' });
await page.waitForSelector('.chart .line');
const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
if (theme !== 'dark') fail('dark mode not applied');
else ok('dark mode toggles');

// Wait for the 0.18s background transition.
await page.waitForTimeout(300);
const bg = await page.evaluate(
  () => getComputedStyle(document.body).backgroundColor
);
// Dark background should be a dark color (RGB sum < 200).
const m = bg.match(/\d+/g);
const sum = m ? m.slice(0, 3).reduce((a, b) => a + +b, 0) : 999;
if (sum > 200) fail('dark mode bg looks light: ' + bg);
else ok('dark mode bg color verified: ' + bg);

// Theme persists across navigation.
await page.goto(`${BASE}/home.html`, { waitUntil: 'load' });
const themeAfter = await page.evaluate(() =>
  document.documentElement.getAttribute('data-theme')
);
if (themeAfter !== 'dark') fail('theme did not persist across pages');
else ok('theme persists across navigation');
// Reset theme for screenshots.
await page.evaluate(() => localStorage.removeItem('tossinvest:theme'));

// ========================== HOME ==========================
console.log('--- 3. Home page ---');
await page.goto(`${BASE}/home.html`, { waitUntil: 'load' });
const indexCount = (await page.$$('.index-card')).length;
if (indexCount !== 4) fail(`home page indices = ${indexCount}, expected 4`);
else ok('home page renders 4 index cards');

const trendingItems = (await page.$$('#trending .rank__item')).length;
if (trendingItems < 3) fail('trending list too short: ' + trendingItems);
else ok('home trending list populated: ' + trendingItems);

// Click a trending item -> goes to detail with correct productCode.
await page.click('#trending .rank__item:first-child .rank__link');
await page.waitForLoadState('load');
const url = page.url();
if (!/focusedProductCode=/.test(url)) fail('trending click did not include productCode');
else ok('trending click navigates with productCode');

// ========================== ALT STOCK (URL PARAM) ==========================
console.log('--- 4. URL param loads different stock ---');
await page.goto(`${BASE}/index.html?focusedProductCode=KRX005930`, { waitUntil: 'load' });
await page.waitForSelector('.chart .line');
const krName = await page.textContent('#stockName');
if (krName !== '삼성전자') fail('KRW stock not loaded by productCode');
else ok('Samsung loaded via productCode');

const krPrice = await page.textContent('#price');
if (!/원/.test(krPrice)) fail('KRW price formatting wrong: ' + krPrice);
else ok('KRW currency formatting works: ' + krPrice);

// ========================== SEARCH ==========================
console.log('--- 5. Search page ---');
await page.goto(`${BASE}/search.html`, { waitUntil: 'load' });
const allResults = (await page.$$('#searchResults .rank__item')).length;
if (allResults < 5) fail('initial search list should show all stocks: ' + allResults);
else ok('search shows all by default: ' + allResults);

await page.fill('#searchInput', '테슬라');
await page.dispatchEvent('#searchInput', 'input');
await page.waitForTimeout(50);
const teslaResults = await page.$$eval('#searchResults .rank__name', els =>
  els.map(e => e.textContent)
);
if (!teslaResults.some(t => /테슬라/.test(t))) fail('search did not find 테슬라');
else ok('search finds 테슬라');

await page.fill('#searchInput', 'NAS0221219002');
await page.dispatchEvent('#searchInput', 'input');
const codeResults = (await page.$$('#searchResults .rank__item')).length;
if (codeResults !== 1) fail('productCode search should match exactly 1 item, got ' + codeResults);
else ok('productCode-based search works');

// ========================== PORTFOLIO ==========================
console.log('--- 6. Portfolio page ---');
await page.goto(`${BASE}/portfolio.html`, { waitUntil: 'load' });
const total$ = await page.textContent('#totalValue');
if (!/^\$/.test(total$)) fail('portfolio total format wrong: ' + total$);
else ok('portfolio total renders: ' + total$);

const holdingRows = (await page.$$('#holdingsBody tr')).length;
if (holdingRows < 3) fail('portfolio holdings rows: ' + holdingRows);
else ok('portfolio shows ' + holdingRows + ' holdings');

const pieBg = await page.locator('#pie').evaluate(el => el.style.background);
if (!/conic-gradient/.test(pieBg)) fail('pie chart conic-gradient missing');
else ok('pie chart renders');

// ========================== 7. LIVE TICKER ==========================
console.log('--- 7. Live ticker simulator ---');
await page.goto(`${BASE}/index.html?focusedProductCode=NAS0221219002&live=fast`, {
  waitUntil: 'load',
});
await page.waitForSelector('.chart .line');
const liveBadgeVisible = await page.isVisible('#liveBadge');
if (!liveBadgeVisible) fail('LIVE badge not visible');
else ok('LIVE badge visible');

const livePriceBefore = await page.textContent('#price');
// Wait for several fast ticks (interval = 150ms).
await page.waitForTimeout(900);
const livePriceAfter = await page.textContent('#price');
if (livePriceBefore === livePriceAfter) fail('live ticker did not update price');
else ok(`live ticker updated price: ${livePriceBefore} -> ${livePriceAfter}`);

// flash class should be present briefly after a tick.
const hasFlashClass = await page
  .locator('#price.flash')
  .count()
  .then(c => c > 0);
if (!hasFlashClass) fail('price flash class never applied');
else ok('price flash animation triggers on tick');

// ========================== 8. INVALID PRODUCT CODE FALLBACK ==========================
console.log('--- 8. Invalid productCode fallback ---');
await page.goto(`${BASE}/index.html?focusedProductCode=DOES_NOT_EXIST`, { waitUntil: 'load' });
const fallbackName = await page.textContent('#stockName');
if (fallbackName !== '엔비디아')
  fail('invalid productCode should fall back to default NVDA, got ' + fallbackName);
else ok('invalid productCode falls back to default');

// ========================== 9. KEYBOARD NAVIGATION ==========================
console.log('--- 9. Keyboard navigation ---');
await page.goto(`${BASE}/home.html`, { waitUntil: 'load' });
await page.focus('.gnb__item[data-page="stock"]');
const focused = await page.evaluate(() => document.activeElement?.getAttribute('data-page'));
if (focused !== 'stock') fail('GNB item not focusable');
else ok('GNB items are keyboard focusable');

// Global search input - press Enter to jump.
await page.goto(`${BASE}/index.html`, { waitUntil: 'load' });
await page.fill('#globalSearch', '테슬라');
await page.press('#globalSearch', 'Enter');
await page.waitForLoadState('load');
const afterSearchUrl = page.url();
if (!/focusedProductCode=NASTSLA/.test(afterSearchUrl))
  fail('global search Enter did not navigate to TSLA: ' + afterSearchUrl);
else ok('global search Enter navigates to matching stock');

// ========================== 10. ACCESSIBILITY (basic) ==========================
console.log('--- 10. Accessibility checks ---');
await page.goto(`${BASE}/index.html?focusedProductCode=NAS0221219002`, { waitUntil: 'load' });

// theme toggle reflects aria-pressed when effective theme is dark.
// 3-way cycle: auto → light → dark → auto. Click twice from auto/light to reach dark.
await page.evaluate(() => localStorage.removeItem('tossinvest:theme'));
await page.reload({ waitUntil: 'load' });
await page.waitForSelector('.chart .line');
await page.click('[data-theme-toggle]'); // auto → light
await page.click('[data-theme-toggle]'); // light → dark
await page.waitForTimeout(100);
const ariaDark = await page.getAttribute('[data-theme-toggle]', 'aria-pressed');
if (ariaDark !== 'true') fail('aria-pressed should be true at dark state, got: ' + ariaDark);
else ok('aria-pressed=true at dark state');
await page.click('[data-theme-toggle]'); // dark → auto
await page.evaluate(() => localStorage.removeItem('tossinvest:theme'));

// Each page has a single <main> landmark and a heading.
for (const path of ['/home.html', '/search.html', '/portfolio.html']) {
  await page.goto(BASE + path, { waitUntil: 'load' });
  const mainCount = await page.locator('main').count();
  const hasH1or2 = (await page.locator('h1, h2').count()) > 0;
  if (mainCount !== 1) fail(`${path}: expected 1 <main>, got ${mainCount}`);
  if (!hasH1or2) fail(`${path}: missing heading`);
}
ok('all pages have main landmark and heading');

// ========================== 11. MOBILE VIEWPORT ==========================
console.log('--- 11. Mobile viewport (375x812) ---');
await page.setViewportSize({ width: 375, height: 812 });
await page.goto(`${BASE}/index.html?focusedProductCode=NAS0221219002`, { waitUntil: 'load' });
await page.waitForSelector('.chart .line');

const horizScroll = await page.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth
);
if (horizScroll > 1) fail('mobile detail page has horizontal scroll: ' + horizScroll + 'px');
else ok('mobile detail page has no horizontal scroll');

// On <=980px GNB hides; metrics collapse to 2 columns at <=980, 1 at <=640.
const gnbVisible = await page.locator('.gnb').isVisible();
if (gnbVisible) fail('GNB should be hidden on mobile');
else ok('mobile hides GNB as expected');

await page.goto(`${BASE}/portfolio.html`, { waitUntil: 'load' });
const mobilePortfolioScroll = await page.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth
);
if (mobilePortfolioScroll > 1) fail('mobile portfolio has horizontal scroll');
else ok('mobile portfolio fits viewport');

await page.setViewportSize({ width: 1280, height: 900 });

// ========================== 12. USER JOURNEY ==========================
console.log('--- 12. User journey: home -> trending -> buy ---');
await page.goto(`${BASE}/home.html`, { waitUntil: 'load' });
await page.click('#trending .rank__item:first-child .rank__link');
await page.waitForLoadState('load');
await page.waitForSelector('.chart .line');
await page.fill('#orderQty', '2');
await page.dispatchEvent('#orderQty', 'input');
await page.click('#placeOrder');
await page.waitForTimeout(120);
const journeyPlaceText = await page.textContent('#placeOrder');
if (!/주문 접수됨/.test(journeyPlaceText))
  fail('order placement feedback missing: ' + journeyPlaceText);
else ok('end-to-end buy journey shows order acceptance');

// ========================== 13. CANDLESTICK + MA + VOLUME ==========================
console.log('--- 13. Chart enhancements (candlestick, MA, volume) ---');
await page.goto(`${BASE}/index.html?focusedProductCode=NAS0221219002`, { waitUntil: 'load' });
await page.waitForSelector('.chart .line');

// Volume chart renders bars by default.
const volBars = await page.$$('#volumeChart .vol-bar');
if (volBars.length < 5) fail('volume bars missing: ' + volBars.length);
else ok(`volume bars rendered: ${volBars.length}`);

// Switch to candle mode.
await page.click('.mode-btn[data-mode="candle"]');
await page.waitForTimeout(120);
const candleBodies = await page.$$('.chart .candle-body');
const lineGone = (await page.$$('.chart .line')).length === 0;
if (candleBodies.length === 0) fail('candle bodies not rendered after toggle');
else if (!lineGone) fail('line should be hidden in candle mode');
else ok(`candle mode renders ${candleBodies.length} candles`);

// Switch back to line mode.
await page.click('.mode-btn[data-mode="line"]');
await page.waitForTimeout(120);
const lineBack = (await page.$('.chart .line')) !== null;
if (!lineBack) fail('line did not return when switching back to line mode');
else ok('line mode toggle is reversible');

// MA toggle.
await page.check('#maToggle');
await page.waitForTimeout(120);
const maPresent = (await page.$('.chart .ma-line')) !== null;
if (!maPresent) fail('MA line not rendered after toggle');
else ok('MA(20) overlay renders');

// ========================== 14. WATCHLIST PERSISTENCE ==========================
console.log('--- 14. Watchlist star + home section ---');
await page.goto(`${BASE}/index.html?focusedProductCode=NASTSLA`, { waitUntil: 'load' });
await page.waitForSelector('.chart .line');

// Reset localStorage so we know the initial state.
await page.evaluate(() => localStorage.removeItem('tossinvest:watchlist'));
await page.reload({ waitUntil: 'load' });
await page.waitForSelector('.chart .line');

const starInitiallyOn = await page.evaluate(() =>
  document.querySelector('.iconbtn--star').classList.contains('is-on')
);
// TSLA is in DEFAULTS, so should be on after reset+reload.
if (!starInitiallyOn) fail('TSLA should be in default watchlist');
else ok('default watchlist seeds TSLA');

// Toggle off.
await page.click('.iconbtn--star');
const afterOff = await page.evaluate(() =>
  JSON.parse(localStorage.getItem('tossinvest:watchlist'))
);
if (afterOff.includes('NASTSLA')) fail('TSLA should be removed from watchlist after click');
else ok('star click removes from watchlist');

// Toggle back on.
await page.click('.iconbtn--star');
const afterOn = await page.evaluate(() =>
  JSON.parse(localStorage.getItem('tossinvest:watchlist'))
);
if (!afterOn.includes('NASTSLA')) fail('TSLA should be re-added');
else ok('star click re-adds to watchlist');

// Home page shows watchlist section.
await page.goto(`${BASE}/home.html`, { waitUntil: 'load' });
const watchlistVisible = await page.isVisible('#watchlistSection');
const watchlistCount = (await page.$$('#watchlist .rank__item')).length;
if (!watchlistVisible || watchlistCount < 1)
  fail('watchlist section not populated on home');
else ok(`home shows watchlist section with ${watchlistCount} items`);

// ========================== 15. SEARCH AUTOCOMPLETE ==========================
console.log('--- 15. Topbar autocomplete ---');
await page.goto(`${BASE}/home.html`, { waitUntil: 'load' });
await page.fill('#globalSearch', '엔비');
await page.dispatchEvent('#globalSearch', 'input');
await page.waitForTimeout(60);
const acItems = await page.$$('.autocomplete__item');
if (acItems.length === 0) fail('autocomplete dropdown empty for "엔비"');
else ok(`autocomplete shows ${acItems.length} matches for "엔비"`);

// Press Down then Enter to navigate.
await page.press('#globalSearch', 'Enter');
await page.waitForLoadState('load');
const afterAcUrl = page.url();
if (!/focusedProductCode=NAS0221219002/.test(afterAcUrl))
  fail('autocomplete did not navigate to NVDA: ' + afterAcUrl);
else ok('autocomplete Enter navigates to top match');

// ========================== 16. ORDER HISTORY PAGE ==========================
console.log('--- 16. Order history page ---');
await page.goto(`${BASE}/history.html`, { waitUntil: 'load' });
const historyRows = (await page.$$('#historyBody tr')).length;
if (historyRows < 3) fail('history has too few rows: ' + historyRows);
else ok(`history shows ${historyRows} orders`);

// Filter to 미체결.
await page.click('.chip[data-filter="미체결"]');
await page.waitForTimeout(60);
const pendingRows = await page.$$eval('#historyBody tr', els => els.length);
const pendingBadge = await page.$$eval('#historyBody .badge--pending', els => els.length);
if (pendingRows < 1 || pendingBadge < 1)
  fail(`pending filter didn't show pending orders (rows=${pendingRows}, badges=${pendingBadge})`);
else ok('history filter chips work');

// Click an order row link to detail.
await page.click('.chip[data-filter="all"]');
await page.click('#historyBody .holdings-name >> nth=0');
await page.waitForLoadState('load');
if (!/focusedProductCode=/.test(page.url()))
  fail('history row link did not navigate with productCode');
else ok('history row links to detail');

// ========================== 17. SECURITY HEADERS / SEO META ==========================
console.log('--- 17. Security/SEO meta ---');
await page.goto(`${BASE}/home.html`, { waitUntil: 'load' });
const metas = await page.evaluate(() => {
  const get = name =>
    document.querySelector(`meta[name="${name}"], meta[http-equiv="${name}"], meta[property="${name}"]`)
      ?.getAttribute('content') || null;
  return {
    csp: get('Content-Security-Policy'),
    xfo: get('X-Frame-Options'),
    xcto: get('X-Content-Type-Options'),
    referrer: get('referrer'),
    ogType: get('og:type'),
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
  };
});
// Note: X-Frame-Options and CSP frame-ancestors must be set via HTTP headers, not meta.
if (!metas.csp) fail('CSP meta missing');
else if (!metas.xcto) fail('X-Content-Type-Options meta missing');
else if (!metas.ogType) fail('og:type missing');
else if (!metas.canonical) fail('canonical link missing');
else ok('security + SEO meta present on home');

// Sitemap & robots accessible.
const sm = await page.evaluate(async () => {
  const r = await fetch('./sitemap.xml');
  return { ok: r.ok, status: r.status };
});
if (!sm.ok) fail('sitemap.xml not served');
else ok('sitemap.xml accessible');

const rb = await page.evaluate(async () => {
  const r = await fetch('./robots.txt');
  return { ok: r.ok, status: r.status };
});
if (!rb.ok) fail('robots.txt not served');
else ok('robots.txt accessible');

// ========================== 18. WEB VITALS REPORTER ==========================
console.log('--- 18. Web Vitals reporter ---');
const vitalsLogs = [];
page.on('console', msg => {
  if (msg.text().includes('[web-vitals]')) vitalsLogs.push(msg.text());
});
await page.goto(`${BASE}/home.html`, { waitUntil: 'load' });
await page.waitForTimeout(800);
if (vitalsLogs.length === 0) fail('web-vitals reporter never logged');
else ok(`web-vitals reporter active (${vitalsLogs.length} entries)`);

// Screenshots for sanity.
await page.goto(`${BASE}/index.html?focusedProductCode=NAS0221219002`, { waitUntil: 'load' });
await page.waitForSelector('.chart .line');
await page.screenshot({ path: '/tmp/page-detail.png', fullPage: true });

await page.goto(`${BASE}/home.html`);
await page.screenshot({ path: '/tmp/page-home.png', fullPage: true });

await page.goto(`${BASE}/portfolio.html`);
await page.screenshot({ path: '/tmp/page-portfolio.png', fullPage: true });

await page.goto(`${BASE}/search.html`);
await page.screenshot({ path: '/tmp/page-search.png', fullPage: true });

await page.goto(`${BASE}/history.html`);
await page.screenshot({ path: '/tmp/page-history.png', fullPage: true });

// Dark screenshot.
await page.click('[data-theme-toggle]');
await page.goto(`${BASE}/index.html?focusedProductCode=NAS0221219002`);
await page.waitForSelector('.chart .line');
await page.screenshot({ path: '/tmp/page-detail-dark.png', fullPage: true });

// ========================== 19. PWA / MANIFEST / SERVICE WORKER ==========================
console.log('--- 19. PWA assets ---');
await page.goto(`${BASE}/home.html`, { waitUntil: 'load' });
const manifestHref = await page.getAttribute('link[rel="manifest"]', 'href');
if (!manifestHref) fail('manifest link missing');
else ok('manifest link present: ' + manifestHref);

const manifestJson = await page.evaluate(async href => {
  const r = await fetch(href);
  return r.ok ? await r.json() : null;
}, manifestHref);
if (!manifestJson) fail('manifest fetch failed');
else if (!manifestJson.name || !manifestJson.start_url) fail('manifest missing name/start_url');
else ok(`manifest valid (name=${manifestJson.name}, scope=${manifestJson.scope})`);

const swReachable = await page.evaluate(async () => {
  const r = await fetch('./service-worker.js');
  return { ok: r.ok, status: r.status };
});
if (!swReachable.ok) fail('service-worker.js not served');
else ok('service-worker.js reachable');

// Wait for SW to register (chromium needs https or localhost; localhost is OK).
const swState = await page.evaluate(
  () =>
    new Promise(resolve => {
      if (!('serviceWorker' in navigator)) return resolve('unsupported');
      const start = Date.now();
      const tick = () => {
        if (navigator.serviceWorker.controller) return resolve('controlled');
        if (Date.now() - start > 4000) return resolve('timeout');
        setTimeout(tick, 100);
      };
      navigator.serviceWorker.ready.then(() => resolve('ready')).catch(() => resolve('error'));
      tick();
    })
);
if (swState === 'unsupported' || swState === 'error') fail('SW registration: ' + swState);
else ok('service worker state: ' + swState);

// ========================== 20. 3-WAY THEME (auto/light/dark) ==========================
console.log('--- 20. 3-way theme cycle ---');
await page.goto(`${BASE}/home.html`, { waitUntil: 'load' });
await page.evaluate(() => localStorage.removeItem('tossinvest:theme'));
await page.reload({ waitUntil: 'load' });

const initialPref = await page.getAttribute('html', 'data-theme-pref');
if (initialPref !== 'auto') fail('initial theme pref should be auto, got ' + initialPref);
else ok('initial theme is auto');

// Cycle: auto → light → dark → auto.
await page.click('[data-theme-toggle]');
const p1 = await page.getAttribute('html', 'data-theme-pref');
await page.click('[data-theme-toggle]');
const p2 = await page.getAttribute('html', 'data-theme-pref');
await page.click('[data-theme-toggle]');
const p3 = await page.getAttribute('html', 'data-theme-pref');
if (p1 !== 'light' || p2 !== 'dark' || p3 !== 'auto')
  fail(`theme cycle wrong: ${p1}/${p2}/${p3}`);
else ok('3-way theme cycles auto→light→dark→auto');

// ========================== 21. PRICE ALERTS ==========================
console.log('--- 21. Price alerts (Notification API) ---');
await page.goto(`${BASE}/index.html?focusedProductCode=NAS0221219002&live=fast`, {
  waitUntil: 'load',
});
await page.waitForSelector('.chart .line');
await page.evaluate(() => localStorage.removeItem('tossinvest:alerts'));

await page.fill('#alertTarget', '1500');
await page.click('#alertAddBtn');
await page.waitForTimeout(60);
const alerts = await page.evaluate(() =>
  JSON.parse(localStorage.getItem('tossinvest:alerts') || '[]')
);
if (alerts.length !== 1 || alerts[0].target !== 1500) fail('alert not stored: ' + JSON.stringify(alerts));
else ok('alert added to localStorage');

const alertItems = (await page.$$('#alertList .alert-item')).length;
if (alertItems !== 1) fail('alert list UI did not render');
else ok('alert list renders item');

// Remove via UI.
await page.click('#alertList button[data-target]');
const afterRemove = await page.evaluate(() =>
  JSON.parse(localStorage.getItem('tossinvest:alerts') || '[]')
);
if (afterRemove.length !== 0) fail('alert removal failed');
else ok('alert can be removed via UI');

// ========================== 22. WCAG-LIKE COLOR CONTRAST ==========================
console.log('--- 22. Color contrast (WCAG-ish) ---');

async function contrastCheck(url) {
  await page.goto(url, { waitUntil: 'load' });
  if (url.includes('index.html')) await page.waitForSelector('.chart .line');
  // Wait for the body color transition (0.18s) to settle.
  await page.waitForTimeout(400);
  return page.evaluate(() => {
    function rgb(s) {
      const m = s.match(/\d+/g);
      if (!m) return [0, 0, 0];
      return m.slice(0, 3).map(Number);
    }
    function lum([r, g, b]) {
      const f = c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    }
    function ratio(a, b) {
      const L1 = lum(a),
        L2 = lum(b);
      const [hi, lo] = L1 > L2 ? [L1, L2] : [L2, L1];
      return (hi + 0.05) / (lo + 0.05);
    }
    const failures = [];
    const selectors = [
      '.gnb__item',
      '.btn--primary',
      '.btn--ghost',
      '.tab',
      '.range__btn',
      '.card__title',
      'h1',
      'h2',
      '.muted',
      '.live-badge',
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (!el) continue;
      const cs = getComputedStyle(el);
      const fontSize = parseFloat(cs.fontSize);
      const fontWeight = parseInt(cs.fontWeight, 10);
      const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
      const minRatio = isLargeText ? 3 : 4.5;
      // Walk up to find a non-transparent background.
      let bgEl = el;
      let bg = rgb(getComputedStyle(bgEl).backgroundColor);
      let alpha = parseFloat(getComputedStyle(bgEl).backgroundColor.match(/\(([^)]+)\)/)?.[1].split(',')[3] ?? '1');
      while ((alpha === 0 || isNaN(alpha)) && bgEl.parentElement) {
        bgEl = bgEl.parentElement;
        const bgcs = getComputedStyle(bgEl).backgroundColor;
        bg = rgb(bgcs);
        alpha = parseFloat(bgcs.match(/\(([^)]+)\)/)?.[1].split(',')[3] ?? '1');
      }
      const fg = rgb(cs.color);
      const r = ratio(fg, bg);
      if (r < minRatio) {
        failures.push({ sel, ratio: r.toFixed(2), need: minRatio, fg: cs.color, bg: getComputedStyle(bgEl).backgroundColor });
      }
    }
    return failures;
  });
}

const lightFailures = await contrastCheck(`${BASE}/home.html`);
if (lightFailures.length > 0)
  fail(
    `light mode contrast failures (${lightFailures.length}): ` +
      JSON.stringify(lightFailures.slice(0, 3))
  );
else ok('light mode passes WCAG AA contrast on key selectors');

// Force dark for next check.
await page.evaluate(() => localStorage.setItem('tossinvest:theme', 'dark'));
const darkFailures = await contrastCheck(`${BASE}/home.html`);
if (darkFailures.length > 0)
  fail(
    `dark mode contrast failures (${darkFailures.length}): ` +
      JSON.stringify(darkFailures.slice(0, 3))
  );
else ok('dark mode passes WCAG AA contrast on key selectors');
await page.evaluate(() => localStorage.removeItem('tossinvest:theme'));

// ========================== 23. I18N LOCALE SWITCH ==========================
console.log('--- 23. i18n locale switch ---');
await page.goto(`${BASE}/home.html`, { waitUntil: 'load' });
// Force KO start regardless of browser locale, then verify cycle.
await page.evaluate(() => localStorage.setItem('tossinvest:locale', 'ko'));
await page.reload({ waitUntil: 'load' });

const koHomeText = await page.textContent('.gnb__item[data-page="home"]');
if (koHomeText !== '홈') fail('initial KO label wrong: ' + koHomeText);
else ok('locale=ko renders KO');

// Cycle is ko → en → ja → ko.
await page.click('[data-locale-toggle]');
await page.waitForTimeout(60);
const enHomeText = await page.textContent('.gnb__item[data-page="home"]');
if (enHomeText !== 'Home') fail('EN label wrong after click: ' + enHomeText);
else ok('locale toggle switches ko → en');

await page.click('[data-locale-toggle]');
await page.waitForTimeout(60);
const jaHomeText = await page.textContent('.gnb__item[data-page="home"]');
if (jaHomeText !== 'ホーム') fail('JA label wrong after click: ' + jaHomeText);
else ok('locale toggle switches en → ja');

// Persists across navigation.
await page.goto(`${BASE}/portfolio.html`, { waitUntil: 'load' });
const portfolioJaNav = await page.textContent('.gnb__item[data-page="home"]');
if (portfolioJaNav !== 'ホーム') fail('locale did not persist on navigation');
else ok('locale persists across pages');

// document.documentElement.lang updates too.
const docLang = await page.getAttribute('html', 'lang');
if (docLang !== 'ja') fail('html lang attribute not updated: ' + docLang);
else ok('html lang reflects locale');

// ========================== 23b. I18N COVERAGE EXPANSION ==========================
console.log('--- 23b. i18n coverage (hero/tabs/metrics/order) ---');

// Home hero in EN.
await page.evaluate(() => localStorage.setItem('tossinvest:locale', 'en'));
await page.goto(`${BASE}/home.html`, { waitUntil: 'load' });
const heroTitle = await page.textContent('.hero__title');
const watchlistLabel = await page.textContent('#watchlistSection .card__title');
const heroBtn = await page.textContent('.hero a.btn--primary');
if (!/US markets/.test(heroTitle)) fail('hero title not translated: ' + heroTitle);
else if (watchlistLabel.trim() !== 'Watchlist') fail('watchlist label not translated: ' + watchlistLabel);
else if (!/today/i.test(heroBtn)) fail('hero CTA not translated: ' + heroBtn);
else ok('home hero/watchlist/CTA translated');

// Detail page range buttons + tabs in JA.
await page.evaluate(() => localStorage.setItem('tossinvest:locale', 'ja'));
await page.goto(`${BASE}/index.html?focusedProductCode=NAS0221219002`, { waitUntil: 'load' });
await page.waitForSelector('.chart .line');
const rangeLabels = await page.$$eval('.range__btn', els => els.map(e => e.textContent.trim()));
const tabLabels = await page.$$eval('.tab', els => els.map(e => e.textContent.trim()));
const placeButtonJa = await page.textContent('#placeOrder');
const metricsFirstLabel = await page.textContent('.metrics li:first-child span');
const aboutHeading = await page.textContent('.panel__h');
if (!rangeLabels.includes('1日') || !rangeLabels.includes('全て'))
  fail('range labels not JA: ' + rangeLabels.join('/'));
else if (!tabLabels.some(s => s === '銘柄情報')) fail('tab labels not JA: ' + tabLabels.join('/'));
else if (placeButtonJa.trim() !== '購入する') fail('place button not JA: ' + placeButtonJa);
else if (metricsFirstLabel !== '始値') fail('metrics first label not JA: ' + metricsFirstLabel);
else if (aboutHeading !== '企業概要') fail('about heading not JA: ' + aboutHeading);
else ok('detail page range/tabs/place/metrics/about all JA');

// History page filter chips + status badges in JA.
await page.goto(`${BASE}/history.html`, { waitUntil: 'load' });
const chipAll = await page.textContent('.chip[data-filter="all"]');
const firstStatusBadge = await page.textContent('#historyBody tr:first-child .badge');
if (chipAll.trim() !== 'すべて') fail('filter chip not JA: ' + chipAll);
else if (firstStatusBadge.trim() !== '約定') fail('status badge not JA: ' + firstStatusBadge);
else ok('history chips and status badges JA');

// Restore KO so downstream tests/screenshots are deterministic.
await page.evaluate(() => localStorage.setItem('tossinvest:locale', 'ko'));

// ========================== 24. BACKTEST CARD ==========================
console.log('--- 24. Backtest results ---');
await page.goto(`${BASE}/index.html?focusedProductCode=NAS0221219002`, { waitUntil: 'load' });
await page.waitForSelector('.chart .line');
const backtestCells = await page.$$('#backtest > div');
if (backtestCells.length < 6) fail('backtest cards missing: ' + backtestCells.length);
else ok(`backtest renders ${backtestCells.length} metrics`);

// Switch range — backtest should re-render.
const beforeBt = await page.textContent('#backtest');
await page.click('.range__btn[data-range="1Y"]');
await page.waitForTimeout(150);
const afterBt = await page.textContent('#backtest');
if (beforeBt === afterBt) fail('backtest did not re-render on range change');
else ok('backtest re-renders on range change');

// ========================== 25. ERROR REPORTER ==========================
console.log('--- 25. Error reporter ---');
const errLogs = [];
page.on('console', msg => {
  if (msg.text().startsWith('[errors] flushing')) errLogs.push(msg.text());
});
await page.goto(`${BASE}/home.html`, { waitUntil: 'load' });
await page.waitForTimeout(300);
// Capture an error via the test hook.
await page.evaluate(() => {
  window.__captureError(new Error('test-induced'), { source: 'verify' });
});
// Trigger a visibilitychange to flush.
await page.evaluate(() => {
  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    get: () => 'hidden',
  });
  document.dispatchEvent(new Event('visibilitychange'));
});
await page.waitForTimeout(150);
if (errLogs.length === 0) fail('error reporter did not flush');
else ok(`error reporter flushed (${errLogs.length} batches)`);

// ========================== 26. SWIPE NAV ==========================
console.log('--- 26. Swipe navigation ---');
await page.goto(`${BASE}/home.html`, { waitUntil: 'load' });
const navPromise = page.waitForURL(/index\.html/, { timeout: 5000 });
await page.evaluate(() =>
  import('./assets/gestures.js').then(m => m._testNavigate('home', 1))
);
await navPromise;
const afterSwipeUrl = page.url();
if (!/index\.html/.test(afterSwipeUrl)) fail('swipe nav did not advance: ' + afterSwipeUrl);
else ok('swipe forward navigates home → stock');

// ========================== 27. STOOQ LIVE DATA SOURCE ==========================
console.log('--- 27. Stooq live source (route-mocked) ---');

// Intercept all stooq.com requests with deterministic CSV.
const STOOQ_QUOTE_CSV =
  'Symbol,Date,Time,Open,High,Low,Close,Volume\n' +
  'NVDA.US,2026-04-28,15:59:59,950.10,955.20,945.50,952.55,40123456';
const STOOQ_SERIES_CSV =
  'Date,Open,High,Low,Close,Volume\n' +
  '2026-04-21,920,925,918,922,30000000\n' +
  '2026-04-22,922,930,920,928,32000000\n' +
  '2026-04-23,928,935,925,933,28000000\n' +
  '2026-04-24,933,940,930,938,33000000\n' +
  '2026-04-25,938,945,935,942,30500000\n' +
  '2026-04-26,942,948,940,946,31000000\n' +
  '2026-04-27,946,953,944,948.32,42700000\n' +
  '2026-04-28,948,956,946,952.55,40123456';

await page.route('https://stooq.com/q/l/**', route => {
  route.fulfill({ status: 200, contentType: 'text/csv', body: STOOQ_QUOTE_CSV });
});
await page.route('https://stooq.com/q/d/l/**', route => {
  route.fulfill({ status: 200, contentType: 'text/csv', body: STOOQ_SERIES_CSV });
});

// Switch source to stooq via localStorage and load detail page.
await page.evaluate(() => localStorage.setItem('tossinvest:source', 'stooq'));
await page.goto(`${BASE}/index.html?focusedProductCode=NAS0221219002`, { waitUntil: 'load' });
await page.waitForSelector('.chart .line');
// Wait for async live load to apply.
await page.waitForTimeout(400);

const livePrice = await page.textContent('#price');
if (!/952\.55/.test(livePrice)) fail('live quote not applied: ' + livePrice);
else ok('live quote applied to header: ' + livePrice);

const sourceBtnText = await page.textContent('[data-source-toggle]');
if (!/STOOQ/i.test(sourceBtnText)) fail('source toggle not reflecting stooq: ' + sourceBtnText);
else ok('source toggle shows STOOQ');

// Verify the chart re-rendered with live series (line path d should differ from mock).
const liveD = await page.locator('.chart .line').getAttribute('d');
await page.evaluate(() => localStorage.setItem('tossinvest:source', 'mock'));
await page.reload({ waitUntil: 'load' });
await page.waitForSelector('.chart .line');
await page.waitForTimeout(150);
const mockD = await page.locator('.chart .line').getAttribute('d');
if (liveD === mockD) fail('live and mock chart paths identical — live data not used');
else ok('chart line path differs between live and mock');

// Source toggle button is clickable and persists choice.
const initialBtn = await page.textContent('[data-source-toggle]');
if (!/MOCK/i.test(initialBtn)) fail('expected MOCK badge initially: ' + initialBtn);
else ok('source toggle defaults to MOCK after reset');

// Stooq fallback when API fails: route returns 500.
await page.unroute('https://stooq.com/q/l/**');
await page.unroute('https://stooq.com/q/d/l/**');
await page.route('https://stooq.com/**', route => route.fulfill({ status: 500, body: 'fail' }));
await page.evaluate(() => localStorage.setItem('tossinvest:source', 'stooq'));
await page.goto(`${BASE}/index.html?focusedProductCode=NAS0221219002`, { waitUntil: 'load' });
await page.waitForSelector('.chart .line');
await page.waitForTimeout(300);
const fallbackPrice = await page.textContent('#price');
if (!/948\.32/.test(fallbackPrice))
  fail('stooq 500 should fall back to mock NVDA $948.32, got: ' + fallbackPrice);
else ok('stooq 500 → graceful mock fallback');

// Reset for downstream tests.
await page.unroute('https://stooq.com/**');
await page.evaluate(() => localStorage.removeItem('tossinvest:source'));

await browser.close();

if (errors.length) {
  console.error('\nFAIL —', errors.length, 'error(s)');
  process.exit(1);
}
console.log('\nOK — all checks passed.');
