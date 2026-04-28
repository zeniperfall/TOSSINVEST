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
await page.click('[data-theme-toggle]');
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
await page.click('[data-theme-toggle]');

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

// theme toggle should reflect aria-pressed.
const ariaInitial = await page.getAttribute('[data-theme-toggle]', 'aria-pressed');
await page.click('[data-theme-toggle]');
await page.waitForTimeout(100);
const ariaAfter = await page.getAttribute('[data-theme-toggle]', 'aria-pressed');
if (ariaInitial === ariaAfter) fail('aria-pressed did not toggle: ' + ariaInitial);
else ok('aria-pressed reflects theme state');
await page.click('[data-theme-toggle]'); // reset

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

await browser.close();

if (errors.length) {
  console.error('\nFAIL —', errors.length, 'error(s)');
  process.exit(1);
}
console.log('\nOK — all checks passed.');
