// Lightweight i18n. Pages can wire data-i18n="key" attributes on elements,
// or call t(key) for dynamic strings. Dictionary keys are dot-separated.

const DICT = {
  ko: {
    'nav.home': '홈',
    'nav.stock': '주식',
    'nav.search': '검색',
    'nav.portfolio': '내 자산',
    'nav.history': '주문 내역',
    'topbar.searchPlaceholder': '종목명·티커 검색',
    'topbar.login': '로그인',
    'home.heroEyebrow': '오늘의 시장',
    'home.heroTitle': '미국장이 강하게 출발했어요',
    'home.heroSub': 'AI 반도체 섹터를 중심으로 매수세가 유입되고 있습니다.',
    'home.todaysStock': '오늘의 종목 보기 →',
    'home.watchlist': '관심 종목',
    'home.trending': '실시간 인기 종목',
    'home.gainers': '상승 종목',
    'home.losers': '하락 종목',
    'home.top5': '상위 5개',
    'history.title': '주문 내역',
    'history.filterAll': '전체',
    'history.filterFilled': '체결',
    'history.filterPending': '미체결',
    'history.filterCanceled': '취소',
    'history.filterBuy': '구매',
    'history.filterSell': '판매',
    'history.heading': '내역',
    'portfolio.totalValue': '총 평가 금액',
    'portfolio.holdings': '보유 종목',
  },
  en: {
    'nav.home': 'Home',
    'nav.stock': 'Stocks',
    'nav.search': 'Search',
    'nav.portfolio': 'Portfolio',
    'nav.history': 'Orders',
    'topbar.searchPlaceholder': 'Search by name or ticker',
    'topbar.login': 'Sign in',
    'home.heroEyebrow': "Today's market",
    'home.heroTitle': 'US markets opened strong',
    'home.heroSub': 'AI semiconductor sector leads buying flow.',
    'home.todaysStock': "See today's pick →",
    'home.watchlist': 'Watchlist',
    'home.trending': 'Trending',
    'home.gainers': 'Top gainers',
    'home.losers': 'Top losers',
    'home.top5': 'Top 5',
    'history.title': 'Order history',
    'history.filterAll': 'All',
    'history.filterFilled': 'Filled',
    'history.filterPending': 'Open',
    'history.filterCanceled': 'Canceled',
    'history.filterBuy': 'Buy',
    'history.filterSell': 'Sell',
    'history.heading': 'Orders',
    'portfolio.totalValue': 'Total value',
    'portfolio.holdings': 'Holdings',
  },
  ja: {
    'nav.home': 'ホーム',
    'nav.stock': '株式',
    'nav.search': '検索',
    'nav.portfolio': '資産',
    'nav.history': '注文履歴',
    'topbar.searchPlaceholder': '銘柄名・ティッカー検索',
    'topbar.login': 'ログイン',
    'home.heroEyebrow': '今日のマーケット',
    'home.heroTitle': '米国市場は堅調にスタート',
    'home.heroSub': 'AI半導体セクター中心に買いが流入しています。',
    'home.todaysStock': '今日の銘柄を見る →',
    'home.watchlist': 'ウォッチリスト',
    'home.trending': '人気の銘柄',
    'home.gainers': '上昇銘柄',
    'home.losers': '下落銘柄',
    'home.top5': '上位5件',
    'history.title': '注文履歴',
    'history.filterAll': 'すべて',
    'history.filterFilled': '約定',
    'history.filterPending': '未約定',
    'history.filterCanceled': 'キャンセル',
    'history.filterBuy': '買い',
    'history.filterSell': '売り',
    'history.heading': '注文',
    'portfolio.totalValue': '総評価額',
    'portfolio.holdings': '保有銘柄',
  },
};

const KEY = 'tossinvest:locale';
const VALID = ['ko', 'en', 'ja'];

export function getLocale() {
  const stored = localStorage.getItem(KEY);
  if (VALID.includes(stored)) return stored;
  // Default: prefer browser language if KO/EN/JA, else ko.
  const browser = (navigator.language || 'ko').slice(0, 2).toLowerCase();
  return VALID.includes(browser) ? browser : 'ko';
}

export function setLocale(loc) {
  if (!VALID.includes(loc)) return;
  localStorage.setItem(KEY, loc);
  applyLocale(loc);
}

export function t(key, loc = getLocale()) {
  return DICT[loc]?.[key] ?? DICT.ko[key] ?? key;
}

function applyLocale(loc) {
  document.documentElement.setAttribute('lang', loc);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n, loc);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder, loc));
  });
  document.querySelectorAll('[data-locale-toggle]').forEach(btn => {
    btn.textContent = loc.toUpperCase();
    btn.setAttribute('title', `Locale: ${loc}`);
  });
}

export function wireLocaleToggle() {
  document.querySelectorAll('[data-locale-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const next = VALID[(VALID.indexOf(getLocale()) + 1) % VALID.length];
      setLocale(next);
    });
  });
}

applyLocale(getLocale());
