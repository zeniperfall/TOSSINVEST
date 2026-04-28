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
  NASGOOGL: {
    code: 'NASGOOGL',
    ticker: 'GOOGL',
    nameKo: '알파벳',
    nameEn: 'Alphabet Inc.',
    market: '나스닥',
    currency: 'USD',
    logo: 'GA',
    logoColor: 'linear-gradient(135deg,#4285f4,#0f4ea0)',
    price: 168.42,
    prevClose: 165.8,
    open: 166.1,
    high: 169.05,
    low: 165.5,
    volume: '24.5M',
    high52: 191.75,
    low52: 121.46,
    marketCap: '$2.07T',
    per: 26.4,
    eps: 6.38,
    yieldPct: 0.48,
    about:
      '알파벳(Alphabet)은 구글 검색·유튜브·클라우드·웨이모를 자회사로 두고 있는 글로벌 IT 지주회사입니다.',
    profile: {
      ceo: '순다르 피차이 (Sundar Pichai)',
      hq: '미국 캘리포니아 마운틴뷰',
      founded: '2015년 10월',
      sector: '인터넷 서비스',
      ipo: '2004-08-19',
      site: 'abc.xyz',
    },
    financials: [
      { year: 'FY2022', rev: '$282.8B', op: '$74.8B', net: '$60.0B', opm: '26.5%', eps: '$4.56' },
      { year: 'FY2023', rev: '$307.4B', op: '$84.3B', net: '$73.8B', opm: '27.4%', eps: '$5.80' },
      { year: 'FY2024', rev: '$350.0B', op: '$112.4B', net: '$94.3B', opm: '32.1%', eps: '$7.54' },
    ],
  },
  NASAMZN: {
    code: 'NASAMZN',
    ticker: 'AMZN',
    nameKo: '아마존',
    nameEn: 'Amazon.com Inc.',
    market: '나스닥',
    currency: 'USD',
    logo: 'AM',
    logoColor: 'linear-gradient(135deg,#ff9900,#bf6f00)',
    price: 184.72,
    prevClose: 181.45,
    open: 182.0,
    high: 185.3,
    low: 181.2,
    volume: '36.2M',
    high52: 201.2,
    low52: 118.35,
    marketCap: '$1.93T',
    per: 49.8,
    eps: 3.71,
    yieldPct: 0,
    about: '아마존(Amazon)은 전자상거래·AWS 클라우드·미디어를 운영하는 미국 빅테크 기업입니다.',
    profile: {
      ceo: '앤디 재시 (Andy Jassy)',
      hq: '미국 워싱턴 시애틀',
      founded: '1994년 7월',
      sector: '전자상거래·클라우드',
      ipo: '1997-05-15',
      site: 'amazon.com',
    },
    financials: [
      { year: 'FY2022', rev: '$514.0B', op: '$12.2B', net: '$-2.7B', opm: '2.4%', eps: '$-0.27' },
      { year: 'FY2023', rev: '$574.8B', op: '$36.9B', net: '$30.4B', opm: '6.4%', eps: '$2.90' },
      { year: 'FY2024', rev: '$638.0B', op: '$68.6B', net: '$59.2B', opm: '10.8%', eps: '$5.53' },
    ],
  },
  NASMETA: {
    code: 'NASMETA',
    ticker: 'META',
    nameKo: '메타 플랫폼스',
    nameEn: 'Meta Platforms',
    market: '나스닥',
    currency: 'USD',
    logo: 'ME',
    logoColor: 'linear-gradient(135deg,#1877f2,#0a3d80)',
    price: 512.34,
    prevClose: 506.12,
    open: 507.5,
    high: 514.6,
    low: 505.8,
    volume: '15.8M',
    high52: 542.81,
    low52: 274.38,
    marketCap: '$1.30T',
    per: 28.1,
    eps: 18.23,
    yieldPct: 0.39,
    about:
      '메타(Meta)는 페이스북·인스타그램·왓츠앱·VR 헤드셋(Quest) 등 SNS·메타버스 사업을 영위합니다.',
    profile: {
      ceo: '마크 저커버그 (Mark Zuckerberg)',
      hq: '미국 캘리포니아 멘로파크',
      founded: '2004년 2월',
      sector: '소셜 미디어',
      ipo: '2012-05-18',
      site: 'meta.com',
    },
    financials: [
      { year: 'FY2022', rev: '$116.6B', op: '$28.9B', net: '$23.2B', opm: '24.8%', eps: '$8.59' },
      { year: 'FY2023', rev: '$134.9B', op: '$46.8B', net: '$39.1B', opm: '34.7%', eps: '$14.87' },
      { year: 'FY2024', rev: '$164.5B', op: '$69.4B', net: '$55.5B', opm: '42.2%', eps: '$22.05' },
    ],
  },
  NASNFLX: {
    code: 'NASNFLX',
    ticker: 'NFLX',
    nameKo: '넷플릭스',
    nameEn: 'Netflix Inc.',
    market: '나스닥',
    currency: 'USD',
    logo: 'NF',
    logoColor: 'linear-gradient(135deg,#e50914,#7c0006)',
    price: 678.45,
    prevClose: 670.32,
    open: 671.5,
    high: 681.0,
    low: 668.9,
    volume: '4.1M',
    high52: 736.45,
    low52: 488.71,
    marketCap: '$292B',
    per: 44.6,
    eps: 15.21,
    yieldPct: 0,
    about:
      '넷플릭스(Netflix)는 글로벌 OTT 스트리밍 1위 사업자입니다. 자체 제작 콘텐츠와 라이브 이벤트를 확대 중입니다.',
    profile: {
      ceo: '테드 사란도스 / 그레그 피터스',
      hq: '미국 캘리포니아 로스가토스',
      founded: '1997년 8월',
      sector: '엔터테인먼트',
      ipo: '2002-05-23',
      site: 'netflix.com',
    },
    financials: [
      { year: 'FY2022', rev: '$31.6B', op: '$5.6B', net: '$4.5B', opm: '17.8%', eps: '$10.10' },
      { year: 'FY2023', rev: '$33.7B', op: '$7.0B', net: '$5.4B', opm: '20.6%', eps: '$12.03' },
      { year: 'FY2024', rev: '$39.0B', op: '$10.9B', net: '$8.7B', opm: '27.9%', eps: '$19.84' },
    ],
  },
  NASAMD: {
    code: 'NASAMD',
    ticker: 'AMD',
    nameKo: '에이엠디',
    nameEn: 'Advanced Micro Devices',
    market: '나스닥',
    currency: 'USD',
    logo: 'AM',
    logoColor: 'linear-gradient(135deg,#000000,#ed1c24)',
    price: 162.18,
    prevClose: 165.4,
    open: 165.0,
    high: 165.8,
    low: 161.2,
    volume: '46.5M',
    high52: 227.3,
    low52: 93.12,
    marketCap: '$262B',
    per: 215.3,
    eps: 0.75,
    yieldPct: 0,
    about:
      'AMD는 CPU·GPU·반도체 제품을 설계하는 미국 팹리스 반도체 기업으로, 데이터센터 AI 시장에서 엔비디아의 주요 경쟁자입니다.',
    profile: {
      ceo: '리사 수 (Lisa Su)',
      hq: '미국 캘리포니아 산타클라라',
      founded: '1969년 5월',
      sector: '반도체',
      ipo: '1972-09-27',
      site: 'amd.com',
    },
    financials: [
      { year: 'FY2022', rev: '$23.6B', op: '$1.3B', net: '$1.3B', opm: '5.4%', eps: '$0.84' },
      { year: 'FY2023', rev: '$22.7B', op: '$0.4B', net: '$0.85B', opm: '1.8%', eps: '$0.53' },
      { year: 'FY2024', rev: '$25.8B', op: '$1.9B', net: '$1.6B', opm: '7.3%', eps: '$1.00' },
    ],
  },
  KRX000660: {
    code: 'KRX000660',
    ticker: '000660',
    nameKo: 'SK하이닉스',
    nameEn: 'SK hynix',
    market: '코스피',
    currency: 'KRW',
    logo: 'SK',
    logoColor: 'linear-gradient(135deg,#ed1c24,#7a0a0e)',
    price: 198500,
    prevClose: 195000,
    open: 195500,
    high: 199000,
    low: 195000,
    volume: '4.8M',
    high52: 248500,
    low52: 119000,
    marketCap: '144조원',
    per: 7.6,
    eps: 26120,
    yieldPct: 1.01,
    about:
      'SK하이닉스는 메모리 반도체(DRAM·NAND) 글로벌 2위 기업으로, HBM(High Bandwidth Memory) 분야에서 세계 1위 점유율을 보유하고 있습니다.',
    profile: {
      ceo: '곽노정',
      hq: '대한민국 경기도 이천',
      founded: '1983년 2월',
      sector: '반도체',
      ipo: '1996-12-26',
      site: 'skhynix.com',
    },
    financials: [
      { year: '2022', rev: '44.6조', op: '7.0조', net: '2.4조', opm: '15.7%', eps: '3,358' },
      { year: '2023', rev: '32.8조', op: '-7.7조', net: '-9.1조', opm: '-23.5%', eps: '-12,491' },
      { year: '2024', rev: '66.2조', op: '23.5조', net: '19.8조', opm: '35.5%', eps: '27,162' },
    ],
  },
  KRX035420: {
    code: 'KRX035420',
    ticker: '035420',
    nameKo: '네이버',
    nameEn: 'NAVER Corp',
    market: '코스피',
    currency: 'KRW',
    logo: 'N',
    logoColor: 'linear-gradient(135deg,#03c75a,#016b30)',
    price: 175200,
    prevClose: 173800,
    open: 174000,
    high: 176500,
    low: 173500,
    volume: '0.7M',
    high52: 235000,
    low52: 152200,
    marketCap: '28조원',
    per: 19.2,
    eps: 9120,
    yieldPct: 0.46,
    about:
      '네이버(NAVER)는 검색·커머스·핀테크·콘텐츠를 운영하는 한국 최대 인터넷 기업입니다. 라인, 웹툰 등 글로벌 서비스도 보유.',
    profile: {
      ceo: '최수연',
      hq: '대한민국 경기도 성남',
      founded: '1999년 6월',
      sector: '인터넷 서비스',
      ipo: '2002-10-29',
      site: 'navercorp.com',
    },
    financials: [
      { year: '2022', rev: '8.2조', op: '1.3조', net: '0.6조', opm: '15.9%', eps: '4,142' },
      { year: '2023', rev: '9.7조', op: '1.5조', net: '1.0조', opm: '15.1%', eps: '6,290' },
      { year: '2024', rev: '10.7조', op: '1.9조', net: '1.4조', opm: '17.6%', eps: '8,930' },
    ],
  },
  KRX373220: {
    code: 'KRX373220',
    ticker: '373220',
    nameKo: 'LG에너지솔루션',
    nameEn: 'LG Energy Solution',
    market: '코스피',
    currency: 'KRW',
    logo: 'LG',
    logoColor: 'linear-gradient(135deg,#a50034,#5e001e)',
    price: 318500,
    prevClose: 322000,
    open: 322500,
    high: 324000,
    low: 317500,
    volume: '0.4M',
    high52: 462500,
    low52: 285500,
    marketCap: '74조원',
    per: 64.8,
    eps: 4915,
    yieldPct: 0.16,
    about: 'LG에너지솔루션은 LG화학에서 분사한 글로벌 2차전지(EV 배터리) 1위급 기업입니다.',
    profile: {
      ceo: '김동명',
      hq: '대한민국 서울 영등포구',
      founded: '2020년 12월',
      sector: '2차전지',
      ipo: '2022-01-27',
      site: 'lgensol.com',
    },
    financials: [
      { year: '2022', rev: '25.6조', op: '1.2조', net: '0.8조', opm: '4.7%', eps: '3,520' },
      { year: '2023', rev: '33.7조', op: '2.2조', net: '1.6조', opm: '6.5%', eps: '7,008' },
      { year: '2024', rev: '24.5조', op: '0.6조', net: '0.4조', opm: '2.4%', eps: '1,720' },
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
  { code: 'NASGOOGL', qty: 20, avgPrice: 142.5 },
  { code: 'NASAMZN', qty: 15, avgPrice: 158.0 },
];

// Mock order history for the new history page.
export const ORDER_HISTORY = [
  {
    id: 'ord_2026_0427_01',
    code: 'NAS0221219002',
    side: 'buy',
    type: '시장가',
    qty: 4,
    price: 902.18,
    status: '체결',
    placedAt: '2026-04-27 21:34:11',
    filledAt: '2026-04-27 21:34:13',
  },
  {
    id: 'ord_2026_0426_03',
    code: 'NASMETA',
    side: 'buy',
    type: '지정가',
    qty: 2,
    price: 498.0,
    status: '체결',
    placedAt: '2026-04-26 22:10:08',
    filledAt: '2026-04-26 22:31:42',
  },
  {
    id: 'ord_2026_0426_02',
    code: 'KRX000660',
    side: 'sell',
    type: '지정가',
    qty: 5,
    price: 195000,
    status: '미체결',
    placedAt: '2026-04-26 09:02:55',
    filledAt: null,
  },
  {
    id: 'ord_2026_0425_01',
    code: 'NASTSLA',
    side: 'sell',
    type: '시장가',
    qty: 6,
    price: 191.42,
    status: '체결',
    placedAt: '2026-04-25 23:07:18',
    filledAt: '2026-04-25 23:07:20',
  },
  {
    id: 'ord_2026_0424_02',
    code: 'NASMSFT',
    side: 'buy',
    type: '지정가',
    qty: 3,
    price: 405.0,
    status: '취소',
    placedAt: '2026-04-24 11:48:00',
    filledAt: null,
  },
  {
    id: 'ord_2026_0424_01',
    code: 'NASAAPL',
    side: 'buy',
    type: '시장가',
    qty: 10,
    price: 218.5,
    status: '체결',
    placedAt: '2026-04-24 21:00:01',
    filledAt: '2026-04-24 21:00:03',
  },
];

export const MARKET = {
  indices: [
    { name: '나스닥', value: 18421.34, change: 1.12 },
    { name: 'S&P 500', value: 5482.21, change: 0.84 },
    { name: '다우존스', value: 39875.6, change: 0.31 },
    { name: '코스피', value: 2784.5, change: -0.32 },
  ],
  trending: ['NAS0221219002', 'NASTSLA', 'NASAAPL', 'NASMSFT', 'NASMETA', 'KRX005930', 'KRX000660'],
  movers: {
    gainers: ['NAS0221219002', 'NASMETA', 'NASMSFT', 'NASGOOGL'],
    losers: ['NASTSLA', 'NASAMD', 'KRX373220'],
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

// Build OHLC candle series for candlestick mode. Derived from buildSeries
// by sampling N consecutive ticks per candle.
export function buildCandles(stock, range) {
  const series = buildSeries(stock, range);
  const groupSize = Math.max(2, Math.floor(series.length / 30));
  const candles = [];
  for (let i = 0; i < series.length; i += groupSize) {
    const slice = series.slice(i, i + groupSize);
    if (slice.length < 2) break;
    const prices = slice.map(s => s.price);
    const open = prices[0];
    const close = prices[prices.length - 1];
    const high = Math.max(...prices);
    const low = Math.min(...prices);
    candles.push({ date: slice[0].date, open, high, low, close });
  }
  return candles;
}

// Synthetic per-bucket volume (correlated with price range) for the volume bar chart.
export function buildVolume(stock, range) {
  const candles = buildCandles(stock, range);
  return candles.map(c => {
    const range_ = (c.high - c.low) / Math.max(c.open, 0.0001);
    const baseVol = stock.currency === 'KRW' ? 50000 : 80000;
    return {
      date: c.date,
      volume: Math.round(baseVol * (1 + range_ * 50) * (0.6 + Math.random() * 0.8)),
      up: c.close >= c.open,
    };
  });
}

// Simple moving average of length n over a price series.
export function movingAverage(series, n = 20) {
  const out = [];
  for (let i = 0; i < series.length; i++) {
    if (i < n - 1) {
      out.push(null);
      continue;
    }
    let sum = 0;
    for (let j = i - n + 1; j <= i; j++) sum += series[j].price;
    out.push(sum / n);
  }
  return out;
}
