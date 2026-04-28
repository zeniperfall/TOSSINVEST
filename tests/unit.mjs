// Unit tests using node:test (built-in, no extra deps).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  STOCKS,
  HOLDINGS,
  ORDER_HISTORY,
  MARKET,
  fmtPrice,
  fmtChange,
  buildSeries,
  buildCandles,
  buildVolume,
  buildOrderBook,
  movingAverage,
} from '../assets/data.js';

test('STOCKS catalog has all required fields per stock', () => {
  for (const [code, s] of Object.entries(STOCKS)) {
    assert.equal(s.code, code, `code mirrors key for ${code}`);
    for (const k of [
      'ticker',
      'nameKo',
      'market',
      'currency',
      'price',
      'prevClose',
      'open',
      'high',
      'low',
      'high52',
      'low52',
      'per',
      'eps',
      'about',
      'profile',
      'financials',
    ]) {
      assert.ok(s[k] !== undefined, `${code}.${k} required`);
    }
    assert.ok(['USD', 'KRW'].includes(s.currency), `currency must be USD or KRW (${code})`);
    assert.equal(s.financials.length, 3, `3 financial years (${code})`);
  }
  assert.ok(Object.keys(STOCKS).length >= 12, 'catalog has >= 12 stocks');
});

test('HOLDINGS reference real stocks', () => {
  for (const h of HOLDINGS) {
    assert.ok(STOCKS[h.code], `holding code ${h.code} exists`);
    assert.ok(h.qty > 0);
    assert.ok(h.avgPrice > 0);
  }
});

test('ORDER_HISTORY references real stocks and uses valid statuses', () => {
  const validStatus = new Set(['체결', '미체결', '취소']);
  for (const o of ORDER_HISTORY) {
    assert.ok(STOCKS[o.code], `order code ${o.code} exists`);
    assert.ok(validStatus.has(o.status), `valid status: ${o.status}`);
    assert.ok(['buy', 'sell'].includes(o.side));
  }
});

test('fmtPrice formats USD with 2 decimals', () => {
  assert.equal(fmtPrice(948.32, 'USD'), '$948.32');
  assert.equal(fmtPrice(1234567.8, 'USD'), '$1,234,567.80');
});

test('fmtPrice formats KRW with 원 suffix and locale separators', () => {
  assert.equal(fmtPrice(78400, 'KRW'), '78,400원');
  assert.equal(fmtPrice(195000.6, 'KRW'), '195,001원');
});

test('fmtChange includes sign for positive and negative', () => {
  assert.equal(fmtChange(18.74, 2.01), '+18.74 (+2.01%)');
  assert.equal(fmtChange(-3.46, -1.84), '-3.46 (-1.84%)');
});

test('buildSeries returns deterministic-length series ending at current price', () => {
  const stock = STOCKS.NAS0221219002;
  for (const range of ['1D', '1W', '1M', '3M', '1Y', '5Y', 'ALL']) {
    const s = buildSeries(stock, range);
    assert.ok(s.length > 10, `${range} should have plenty of points`);
    assert.equal(s[s.length - 1].price, stock.price, `${range} last point at current price`);
    s.forEach(p => assert.ok(p.price > 0, 'no zero/negative prices'));
  }
});

test('buildCandles produces ~30 OHLC candles where high >= max(open,close)', () => {
  const candles = buildCandles(STOCKS.NASTSLA, '3M');
  assert.ok(candles.length >= 5);
  for (const c of candles) {
    assert.ok(c.high >= Math.max(c.open, c.close), 'high invariant');
    assert.ok(c.low <= Math.min(c.open, c.close), 'low invariant');
  }
});

test('buildVolume bars correlate with candles 1:1', () => {
  const candles = buildCandles(STOCKS.NASTSLA, '3M');
  const bars = buildVolume(STOCKS.NASTSLA, '3M');
  assert.equal(bars.length, candles.length);
  for (const b of bars) assert.ok(b.volume > 0);
});

test('buildOrderBook returns 5 asks above price and 5 bids below', () => {
  const stock = STOCKS.NAS0221219002;
  const { asks, bids } = buildOrderBook(stock);
  assert.equal(asks.length, 5);
  assert.equal(bids.length, 5);
  // Asks sorted descending (closest-to-price last), all above current.
  asks.forEach(a => assert.ok(a.price > stock.price, 'ask > price'));
  bids.forEach(b => assert.ok(b.price < stock.price, 'bid < price'));
});

test('movingAverage returns nulls before window then averages', () => {
  const series = Array.from({ length: 25 }, (_, i) => ({ price: i + 1 }));
  const ma = movingAverage(series, 5);
  for (let i = 0; i < 4; i++) assert.equal(ma[i], null);
  // ma[4] = avg(1..5) = 3
  assert.equal(ma[4], 3);
  // ma[24] = avg(21..25) = 23
  assert.equal(ma[24], 23);
});

test('MARKET trending and movers reference valid codes', () => {
  for (const c of MARKET.trending) assert.ok(STOCKS[c], `trending ${c}`);
  for (const c of MARKET.movers.gainers) assert.ok(STOCKS[c], `gainer ${c}`);
  for (const c of MARKET.movers.losers) assert.ok(STOCKS[c], `loser ${c}`);
});

test('crossed: detects upward target crossing only on transition', async () => {
  const { crossed } = await import('../assets/notification.js');
  // Crossing upward: prev below target, current at/above.
  assert.equal(crossed(100, 105, 102, 'above'), true);
  assert.equal(crossed(100, 102, 102, 'above'), true);
  // Already above: no cross.
  assert.equal(crossed(105, 110, 102, 'above'), false);
  // Going up but not reaching target.
  assert.equal(crossed(99, 100, 102, 'above'), false);
});

test('crossed: detects downward target crossing only on transition', async () => {
  const { crossed } = await import('../assets/notification.js');
  assert.equal(crossed(100, 95, 98, 'below'), true);
  assert.equal(crossed(100, 98, 98, 'below'), true);
  assert.equal(crossed(95, 90, 98, 'below'), false);
  assert.equal(crossed(101, 100, 98, 'below'), false);
});

test('backtest: computes return, drawdown, volatility, sharpe', async () => {
  const { backtest } = await import('../assets/backtest.js');
  // Steady up trend: 100 → 110 with no drawdown.
  const series = Array.from({ length: 11 }, (_, i) => ({ price: 100 + i }));
  const r = backtest(series);
  assert.equal(r.start, 100);
  assert.equal(r.end, 110);
  assert.ok(r.totalReturn > 9.99 && r.totalReturn < 10.01);
  assert.equal(r.maxDrawdown, 0);
  assert.ok(r.volatility > 0);
});

test('backtest: detects max drawdown', async () => {
  const { backtest } = await import('../assets/backtest.js');
  // Up then down: peak 200, trough 100 → -50% drawdown.
  const series = [{ price: 100 }, { price: 200 }, { price: 100 }];
  const r = backtest(series);
  assert.ok(Math.abs(r.maxDrawdown - -50) < 0.01, 'maxDrawdown=-50%');
});

test('backtest: handles empty/single series gracefully', async () => {
  const { backtest } = await import('../assets/backtest.js');
  assert.equal(backtest([]), null);
  assert.equal(backtest([{ price: 100 }]), null);
});

test('stooq: symbolFor maps NASDAQ → .us, KOSPI → .kr', async () => {
  const { symbolFor } = await import('../assets/sources/stooq.js');
  assert.equal(symbolFor({ ticker: 'NVDA', market: '나스닥' }), 'nvda.us');
  assert.equal(symbolFor({ ticker: 'AAPL', market: '나스닥' }), 'aapl.us');
  assert.equal(symbolFor({ ticker: '005930', market: '코스피' }), '005930.kr');
  assert.equal(symbolFor({ ticker: 'XYZ', market: 'unknown' }), null);
  assert.equal(symbolFor(null), null);
});

test('stooq: parseQuoteCsv extracts OHLCV from light quote format', async () => {
  const { parseQuoteCsv } = await import('../assets/sources/stooq.js');
  const csv =
    'Symbol,Date,Time,Open,High,Low,Close,Volume\n' +
    'NVDA.US,2026-04-28,15:59:59,950.00,955.00,945.00,952.50,40123456';
  const r = parseQuoteCsv(csv);
  assert.equal(r.open, 950);
  assert.equal(r.high, 955);
  assert.equal(r.low, 945);
  assert.equal(r.price, 952.5);
  assert.equal(r.volume, 40123456);
  assert.equal(r.date, '2026-04-28');
});

test('stooq: parseQuoteCsv rejects empty or N/D rows', async () => {
  const { parseQuoteCsv } = await import('../assets/sources/stooq.js');
  assert.throws(() => parseQuoteCsv(''), /empty/);
  assert.throws(
    () =>
      parseQuoteCsv(
        'Symbol,Date,Time,Open,High,Low,Close,Volume\nNVDA.US,N/D,N/D,N/D,N/D,N/D,N/D,N/D'
      ),
    /N\/D/
  );
});

test('stooq: parseSeriesCsv returns sorted OHLC rows with Date objects', async () => {
  const { parseSeriesCsv } = await import('../assets/sources/stooq.js');
  const csv =
    'Date,Open,High,Low,Close,Volume\n' +
    '2026-04-26,940.0,945.0,938.0,942.5,30000000\n' +
    '2026-04-27,943.0,950.0,941.0,948.32,42700000';
  const rows = parseSeriesCsv(csv);
  assert.equal(rows.length, 2);
  assert.ok(rows[0].date instanceof Date);
  assert.equal(rows[0].price, 942.5);
  assert.equal(rows[1].price, 948.32);
  assert.equal(rows[1].open, 943);
  assert.equal(rows[1].volume, 42700000);
});

test('stooq: parseSeriesCsv throws on empty data', async () => {
  const { parseSeriesCsv } = await import('../assets/sources/stooq.js');
  assert.throws(() => parseSeriesCsv('Date,Open,High,Low,Close,Volume\n'), /empty/);
});

test('buildCandles: passes through pre-fetched OHLC series', async () => {
  const { buildCandles } = await import('../assets/data.js');
  const baseSeries = [
    { date: new Date('2026-04-26'), open: 940, high: 945, low: 938, price: 942.5 },
    { date: new Date('2026-04-27'), open: 943, high: 950, low: 941, price: 948.32 },
  ];
  const candles = buildCandles({ ticker: 'NVDA' }, '1W', baseSeries);
  assert.equal(candles.length, 2);
  assert.equal(candles[0].open, 940);
  assert.equal(candles[0].close, 942.5);
});

test('buildVolume: passes through real volume when available', async () => {
  const { buildVolume } = await import('../assets/data.js');
  const baseSeries = [
    { date: new Date(), open: 100, price: 102, volume: 1000 },
    { date: new Date(), open: 102, price: 99, volume: 2000 },
  ];
  const bars = buildVolume({ currency: 'USD' }, '1W', baseSeries);
  assert.equal(bars[0].volume, 1000);
  assert.equal(bars[0].up, true);
  assert.equal(bars[1].up, false);
});
