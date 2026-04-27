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
