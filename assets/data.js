// Mock market data store. Keyed by Toss Invest-style productCode.
// Structure inspired by tossinvest.com/?focusedProductCode=...
// All values are illustrative.

export const STOCKS = {
  NAS0221219002: {
    code: 'NAS0221219002',
    ticker: 'NVDA',
    nameKo: '엔비디아',
    nameEn: 'NVIDIA Corp',
    market: '나스닥',
    currency: 'USD',
    logo: 'NV',
    logoColor: 'linear-gradient(135deg,#76b900 0%,#2c5f00 100%)',
    price: 948.32,
    prevClose: 929.58,
    open: 931.1,
    high: 952.88,
    low: 928.4,
    volume: '42.7M',
    high52: 974.0,
    low52: 373.56,
    marketCap: '$2.34T',
    per: 74.21,
    eps: 12.78,
    yieldPct: 0.02,
    about:
      '엔비디아(NVIDIA)는 GPU와 AI 가속기를 설계하는 미국 반도체 기업으로, 데이터센터·게이밍·자율주행 분야에서 핵심 솔루션을 공급합니다.',
    profile: {
      ceo: '젠슨 황 (Jensen Huang)',
      hq: '미국 캘리포니아 산타클라라',
      founded: '1993년 4월',
      sector: '반도체',
      ipo: '1999-01-22',
      site: 'nvidia.com',
    },
    financials: [
      { year: 'FY2022', rev: '$26.9B', op: '$10.04B', net: '$9.75B', opm: '37.3%', eps: '$3.85' },
      { year: 'FY2023', rev: '$26.97B', op: '$4.22B', net: '$4.37B', opm: '15.6%', eps: '$1.74' },
      {
        year: 'FY2024',
        rev: '$60.92B',
        op: '$32.97B',
        net: '$29.76B',
        opm: '54.1%',
        eps: '$11.93',
      },
    ],
  },
  NASAAPL: {
    code: 'NASAAPL',
    ticker: 'AAPL',
    nameKo: '애플',
    nameEn: 'Apple Inc.',
    market: '나스닥',
    currency: 'USD',
    logo: 'AA',
    logoColor: 'linear-gradient(135deg,#1d1d1f,#3a3a3c)',
    price: 224.18,
    prevClose: 220.85,
    open: 221.5,
    high: 225.04,
    low: 220.9,
    volume: '38.1M',
    high52: 237.23,
    low52: 164.08,
    marketCap: '$3.42T',
    per: 34.12,
    eps: 6.58,
    yieldPct: 0.45,
    about:
      '애플(Apple)은 아이폰·맥·서비스 사업을 영위하는 글로벌 IT 기업으로, 하드웨어와 소프트웨어 수직 통합 모델을 가진 대표 기업입니다.',
    profile: {
      ceo: '팀 쿡 (Tim Cook)',
      hq: '미국 캘리포니아 쿠퍼티노',
      founded: '1976년 4월',
      sector: '소비자 가전',
      ipo: '1980-12-12',
      site: 'apple.com',
    },
    financials: [
      { year: 'FY2022', rev: '$394.3B', op: '$119.4B', net: '$99.8B', opm: '30.3%', eps: '$6.11' },
      { year: 'FY2023', rev: '$383.3B', op: '$114.3B', net: '$97.0B', opm: '29.8%', eps: '$6.13' },
      { year: 'FY2024', rev: '$391.0B', op: '$123.2B', net: '$93.7B', opm: '31.5%', eps: '$6.08' },
    ],
  },
  NASTSLA: {
    code: 'NASTSLA',
    ticker: 'TSLA',
    nameKo: '테슬라',
    nameEn: 'Tesla, Inc.',
    market: '나스닥',
    currency: 'USD',
    logo: 'TS',
    logoColor: 'linear-gradient(135deg,#cc0000,#7a0000)',
    price: 184.75,
    prevClose: 188.21,
    open: 187.4,
    high: 189.1,
    low: 183.05,
    volume: '95.3M',
    high52: 299.29,
    low52: 138.8,
    marketCap: '$586B',
    per: 51.6,
    eps: 3.58,
    yieldPct: 0,
    about:
      '테슬라(Tesla)는 전기차·에너지 저장·자율주행 솔루션을 제공하는 미국 기업입니다. 모델 Y와 사이버트럭 등 다양한 라인업을 보유하고 있습니다.',
    profile: {
      ceo: '일론 머스크 (Elon Musk)',
      hq: '미국 텍사스 오스틴',
      founded: '2003년 7월',
      sector: '자동차',
      ipo: '2010-06-29',
      site: 'tesla.com',
    },
    financials: [
      { year: 'FY2022', rev: '$81.5B', op: '$13.7B', net: '$12.6B', opm: '16.8%', eps: '$3.62' },
      { year: 'FY2023', rev: '$96.8B', op: '$8.9B', net: '$15.0B', opm: '9.2%', eps: '$4.30' },
      { year: 'FY2024', rev: '$97.7B', op: '$7.1B', net: '$7.1B', opm: '7.3%', eps: '$2.04' },
    ],
  },
  NASMSFT: {
    code: 'NASMSFT',
    ticker: 'MSFT',
    nameKo: '마이크로소프트',
    nameEn: 'Microsoft Corp',
    market: '나스닥',
    currency: 'USD',
    logo: 'MS',
    logoColor: 'linear-gradient(135deg,#00a4ef,#0078d4)',
    price: 415.24,
    prevClose: 412.5,
    open: 413.2,
    high: 416.9,
    low: 411.8,
    volume: '20.8M',
    high52: 468.35,
    low52: 309.45,
    marketCap: '$3.09T',
    per: 35.6,
    eps: 11.66,
    yieldPct: 0.74,
    about:
      '마이크로소프트(Microsoft)는 윈도우·오피스·애저(Azure) 클라우드를 중심으로 한 글로벌 소프트웨어 기업이며, AI 코파일럿 영역에서도 선두에 있습니다.',
    profile: {
      ceo: '사티아 나델라 (Satya Nadella)',
      hq: '미국 워싱턴 레드먼드',
      founded: '1975년 4월',
      sector: '소프트웨어',
      ipo: '1986-03-13',
      site: 'microsoft.com',
    },
    financials: [
      { year: 'FY2022', rev: '$198.3B', op: '$83.4B', net: '$72.7B', opm: '42.1%', eps: '$9.65' },
      { year: 'FY2023', rev: '$211.9B', op: '$88.5B', net: '$72.4B', opm: '41.8%', eps: '$9.68' },
      { year: 'FY2024', rev: '$245.1B', op: '$109.4B', net: '$88.1B', opm: '44.6%', eps: '$11.80' },
    ],
  },
  KRX005930: {
    code: 'KRX005930',
    ticker: '005930',
    nameKo: '삼성전자',
    nameEn: 'Samsung Electronics',
    market: '코스피',
    currency: 'KRW',
    logo: '삼',
    logoColor: 'linear-gradient(135deg,#1428a0,#0a1656)',
    price: 78400,
    prevClose: 77200,
    open: 77500,
    high: 78600,
    low: 77100,
    volume: '14.2M',
    high52: 88800,
    low52: 64500,
    marketCap: '467조원',
    per: 12.4,
    eps: 6320,
    yieldPct: 1.83,
    about:
      '삼성전자는 반도체·디스플레이·스마트폰·가전을 아우르는 한국 대표 IT 기업입니다. 메모리 반도체에서 세계 1위 점유율을 보유하고 있습니다.',
    profile: {
      ceo: '한종희 / 경계현',
      hq: '대한민국 경기도 수원',
      founded: '1969년 1월',
      sector: '반도체·전자',
      ipo: '1975-06-11',
      site: 'samsung.com',
    },
    financials: [
      { year: '2022', rev: '302.2조', op: '43.4조', net: '55.7조', opm: '14.4%', eps: '8,057' },
      { year: '2023', rev: '258.9조', op: '6.6조', net: '15.5조', opm: '2.5%', eps: '2,131' },
      { year: '2024', rev: '300.9조', op: '32.7조', net: '34.5조', opm: '10.9%', eps: '4,950' },
    ],
  },
};

// Default stock when no productCode in URL
export const DEFAULT_CODE = 'NAS0221219002';

// User holdings (mock).
export const HOLDINGS = [
  { code: 'NAS0221219002', qty: 12, avgPrice: 612.4 },
  { code: 'NASAAPL', qty: 25, avgPrice: 182.1 },
  { code: 'NASMSFT', qty: 8, avgPrice: 392.5 },
  { code: 'KRX005930', qty: 80, avgPrice: 71200 },
];

export const MARKET = {
  indices: [
    { name: '나스닥', value: 18421.34, change: 1.12 },
    { name: 'S&P 500', value: 5482.21, change: 0.84 },
    { name: '다우존스', value: 39875.6, change: 0.31 },
    { name: '코스피', value: 2784.5, change: -0.32 },
  ],
  trending: ['NAS0221219002', 'NASTSLA', 'NASAAPL', 'NASMSFT', 'KRX005930'],
  movers: {
    gainers: ['NAS0221219002', 'NASMSFT'],
    losers: ['NASTSLA'],
  },
  benchmark: {
    name: '나스닥 종합',
    series: buildBenchmark(),
  },
};

function buildBenchmark() {
  // Smooth uptrending series for comparison overlay.
  const out = [];
  let v = 100;
  let seed = 42;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < 60; i++) {
    v = v * (1 + (rand() - 0.45) * 0.012);
    out.push(v);
  }
  return out;
}

// Format helpers.
export function fmtPrice(value, currency = 'USD') {
  if (currency === 'KRW') {
    return Math.round(value).toLocaleString('ko-KR') + '원';
  }
  return (
    '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  );
}

export function fmtChange(abs, pct) {
  const sign = abs >= 0 ? '+' : '';
  return `${sign}${abs.toFixed(2)} (${sign}${pct.toFixed(2)}%)`;
}

// Build a deterministic price series for charts (5 ranges).
export function buildSeries(stock, range) {
  const cfg = {
    '1D': { points: 78, days: 1, span: 0.02 },
    '1W': { points: 60, days: 7, span: 0.045 },
    '1M': { points: 80, days: 30, span: 0.09 },
    '3M': { points: 90, days: 90, span: 0.18 },
    '1Y': { points: 120, days: 365, span: 0.55 },
    '5Y': { points: 140, days: 365 * 5, span: 0.85 },
    ALL: { points: 160, days: 365 * 26, span: 0.99 },
  }[range];
  if (!cfg) return [];
  const end = stock.price;
  const start = end * (1 - cfg.span);
  const series = [];
  let seed = stock.ticker.charCodeAt(0) * 9301 + cfg.points;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const now = Date.now();
  const totalMs = cfg.days * 24 * 60 * 60 * 1000;
  for (let i = 0; i < cfg.points; i++) {
    const t = i / (cfg.points - 1);
    const drift = start + (end - start) * t;
    const noise = (rand() - 0.5) * (end - start) * 0.18 * (1 - Math.abs(t - 0.5));
    const price = Math.max(0.01, drift + noise);
    series.push({ date: new Date(now - totalMs + totalMs * t), price });
  }
  series[series.length - 1].price = end;
  return series;
}

// Generate a mock 5-level order book (호가창).
export function buildOrderBook(stock) {
  const tick = stock.currency === 'KRW' ? 100 : 0.05;
  const asks = [];
  const bids = [];
  let seed = Math.round(stock.price * 100);
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 1; i <= 5; i++) {
    asks.push({
      price: round(stock.price + tick * i, stock.currency),
      qty: Math.round(rand() * 1800) + 200,
    });
    bids.push({
      price: round(stock.price - tick * i, stock.currency),
      qty: Math.round(rand() * 1800) + 200,
    });
  }
  asks.reverse();
  return { asks, bids };
}

function round(v, currency) {
  if (currency === 'KRW') return Math.round(v);
  return Math.round(v * 100) / 100;
}
