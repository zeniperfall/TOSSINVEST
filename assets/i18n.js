// Lightweight i18n. Pages can wire data-i18n="key" attributes on elements,
// or call t(key) for dynamic strings. Dictionary keys are dot-separated.

const DICT = {
  ko: {
    // Navigation
    'nav.home': '홈',
    'nav.stock': '주식',
    'nav.search': '검색',
    'nav.portfolio': '내 자산',
    'nav.history': '주문 내역',
    'topbar.searchPlaceholder': '종목명·티커 검색',
    'topbar.login': '로그인',
    // Aria labels
    'aria.notify': '알림',
    'aria.share': '공유',
    'aria.star': '관심 등록',
    'aria.theme': '테마 전환',
    'aria.locale': '언어 전환',

    // Home
    'home.heroEyebrow': '오늘의 시장',
    'home.heroTitle': '미국장이 강하게 출발했어요',
    'home.heroSub': 'AI 반도체 섹터를 중심으로 매수세가 유입되고 있습니다.',
    'home.todaysStock': '오늘의 종목 보기 →',
    'home.watchlist': '관심 종목',
    'home.trending': '실시간 인기 종목',
    'home.gainers': '상승 종목',
    'home.losers': '하락 종목',
    'home.top5': '상위 5개',

    // Search
    'search.title': '종목 검색',
    'search.fullPlaceholder': '종목명, 티커, 또는 productCode로 검색',
    'search.hint': '예) 엔비디아, NVDA, NAS0221219002',
    'search.results': '검색 결과',
    'search.empty': "'{q}' 에 대한 결과가 없어요.",

    // Portfolio
    'portfolio.totalValue': '총 평가 금액',
    'portfolio.holdings': '보유 종목',
    'portfolio.col.stock': '종목',
    'portfolio.col.qty': '수량',
    'portfolio.col.avgPrice': '평균 단가',
    'portfolio.col.currentPrice': '현재가',
    'portfolio.col.value': '평가 금액',
    'portfolio.col.pnl': '평가 손익',

    // History
    'history.title': '주문 내역',
    'history.filterAll': '전체',
    'history.filterFilled': '체결',
    'history.filterPending': '미체결',
    'history.filterCanceled': '취소',
    'history.filterBuy': '구매',
    'history.filterSell': '판매',
    'history.heading': '내역',
    'history.col.placedAt': '주문 시각',
    'history.col.side': '구분',
    'history.col.type': '유형',
    'history.col.price': '주문 가격',
    'history.col.status': '상태',
    'history.empty': '해당 조건의 주문이 없어요.',

    // Detail page – chart card
    'chart.range.1D': '1일',
    'chart.range.1W': '1주',
    'chart.range.1M': '1개월',
    'chart.range.3M': '3개월',
    'chart.range.1Y': '1년',
    'chart.range.5Y': '5년',
    'chart.range.ALL': '전체',
    'chart.mode.line': '선',
    'chart.mode.candle': '캔들',
    'chart.toggleBenchmark': '지수 비교',
    'chart.toggleMA': 'MA(20)',

    // Detail page – sections
    'detail.metrics': '시세 정보',
    'detail.metric.open': '시가',
    'detail.metric.high': '고가',
    'detail.metric.low': '저가',
    'detail.metric.volume': '거래량',
    'detail.metric.prevClose': '전일 종가',
    'detail.metric.high52': '52주 최고',
    'detail.metric.low52': '52주 최저',
    'detail.metric.marketCap': '시가총액',
    'detail.metric.per': 'PER',
    'detail.metric.eps': 'EPS',
    'detail.backtest': '백테스트 (현재 차트 기간)',
    'detail.backtestSub': '현재 선택된 기간을 매수 후 보유했을 때의 결과예요.',
    'detail.bt.totalReturn': '총 수익률',
    'detail.bt.mdd': '최대 낙폭(MDD)',
    'detail.bt.volatility': '변동성 (연환산)',
    'detail.bt.sharpe': '샤프 비율',
    'detail.bt.start': '구간 시작',
    'detail.bt.end': '구간 종료',
    'detail.holding': '내가 보유한 {ticker}',
    'detail.holding.qty': '보유 수량',
    'detail.holding.avg': '평균 단가',
    'detail.holding.value': '평가 금액',
    'detail.holding.pnl': '평가 손익',
    'detail.tab.overview': '종목정보',
    'detail.tab.news': '뉴스',
    'detail.tab.community': '커뮤니티',
    'detail.tab.financials': '재무',
    'detail.about': '기업 개요',
    'detail.profile.ceo': '대표',
    'detail.profile.hq': '본사',
    'detail.profile.founded': '설립',
    'detail.profile.sector': '업종',
    'detail.profile.ipo': '상장일',
    'detail.profile.site': '홈페이지',
    'detail.fin.label': '항목',
    'detail.fin.rev': '매출',
    'detail.fin.op': '영업이익',
    'detail.fin.net': '순이익',
    'detail.fin.opm': '영업이익률',
    'detail.fin.eps': 'EPS',
    'detail.code': '코드',
    'detail.live': 'LIVE',

    // Order panel
    'order.book': '호가',
    'order.bookCurrent': '현재가',
    'order.tab.buy': '구매',
    'order.tab.sell': '판매',
    'order.type': '주문 유형',
    'order.type.limit': '지정가',
    'order.type.market': '시장가',
    'order.type.reserved': '예약 주문',
    'order.price': '주문 가격',
    'order.qty': '수량',
    'order.expectedTotal': '예상 체결금액',
    'order.cashAvail': '주문 가능 금액',
    'order.placeBuy': '구매하기',
    'order.placeSell': '판매하기',
    'order.acceptedBuy': '구매 주문 접수됨',
    'order.acceptedSell': '판매 주문 접수됨',
    'order.disclaimer': '시세는 약 15분 지연될 수 있어요. 본 화면은 디자인 예시입니다.',

    // Alert
    'alert.title': '목표가 알림',
    'alert.sub': '설정한 가격에 도달하면 브라우저 알림으로 알려드려요.',
    'alert.above': '이상',
    'alert.below': '이하',
    'alert.placeholder': '예) 1000',
    'alert.add': '설정',
    'alert.remove': '삭제',

    // Footer
    'foot.demo': '학습용 데모 · 토스증권 디자인 스타일',
    'foot.long':
      '본 페이지는 토스증권 디자인 스타일의 학습용 데모입니다. 실제 투자에 사용하지 마세요.',
  },

  en: {
    'nav.home': 'Home',
    'nav.stock': 'Stocks',
    'nav.search': 'Search',
    'nav.portfolio': 'Portfolio',
    'nav.history': 'Orders',
    'topbar.searchPlaceholder': 'Search by name or ticker',
    'topbar.login': 'Sign in',
    'aria.notify': 'Notifications',
    'aria.share': 'Share',
    'aria.star': 'Add to watchlist',
    'aria.theme': 'Switch theme',
    'aria.locale': 'Switch language',

    'home.heroEyebrow': "Today's market",
    'home.heroTitle': 'US markets opened strong',
    'home.heroSub': 'AI semiconductor sector leads buying flow.',
    'home.todaysStock': "See today's pick →",
    'home.watchlist': 'Watchlist',
    'home.trending': 'Trending',
    'home.gainers': 'Top gainers',
    'home.losers': 'Top losers',
    'home.top5': 'Top 5',

    'search.title': 'Search stocks',
    'search.fullPlaceholder': 'Search by name, ticker, or productCode',
    'search.hint': 'e.g. NVIDIA, NVDA, NAS0221219002',
    'search.results': 'Results',
    'search.empty': "No matches for '{q}'.",

    'portfolio.totalValue': 'Total value',
    'portfolio.holdings': 'Holdings',
    'portfolio.col.stock': 'Stock',
    'portfolio.col.qty': 'Qty',
    'portfolio.col.avgPrice': 'Avg cost',
    'portfolio.col.currentPrice': 'Price',
    'portfolio.col.value': 'Value',
    'portfolio.col.pnl': 'P&L',

    'history.title': 'Order history',
    'history.filterAll': 'All',
    'history.filterFilled': 'Filled',
    'history.filterPending': 'Open',
    'history.filterCanceled': 'Canceled',
    'history.filterBuy': 'Buy',
    'history.filterSell': 'Sell',
    'history.heading': 'Orders',
    'history.col.placedAt': 'Placed',
    'history.col.side': 'Side',
    'history.col.type': 'Type',
    'history.col.price': 'Price',
    'history.col.status': 'Status',
    'history.empty': 'No orders match this filter.',

    'chart.range.1D': '1D',
    'chart.range.1W': '1W',
    'chart.range.1M': '1M',
    'chart.range.3M': '3M',
    'chart.range.1Y': '1Y',
    'chart.range.5Y': '5Y',
    'chart.range.ALL': 'ALL',
    'chart.mode.line': 'Line',
    'chart.mode.candle': 'Candle',
    'chart.toggleBenchmark': 'Index compare',
    'chart.toggleMA': 'MA(20)',

    'detail.metrics': 'Quote',
    'detail.metric.open': 'Open',
    'detail.metric.high': 'High',
    'detail.metric.low': 'Low',
    'detail.metric.volume': 'Volume',
    'detail.metric.prevClose': 'Prev close',
    'detail.metric.high52': '52w high',
    'detail.metric.low52': '52w low',
    'detail.metric.marketCap': 'Market cap',
    'detail.metric.per': 'P/E',
    'detail.metric.eps': 'EPS',
    'detail.backtest': 'Backtest (current range)',
    'detail.backtestSub': 'Buy-and-hold result if you bought at the start of the range.',
    'detail.bt.totalReturn': 'Total return',
    'detail.bt.mdd': 'Max drawdown',
    'detail.bt.volatility': 'Volatility (annualized)',
    'detail.bt.sharpe': 'Sharpe ratio',
    'detail.bt.start': 'Range start',
    'detail.bt.end': 'Range end',
    'detail.holding': 'My {ticker} position',
    'detail.holding.qty': 'Quantity',
    'detail.holding.avg': 'Avg cost',
    'detail.holding.value': 'Market value',
    'detail.holding.pnl': 'P&L',
    'detail.tab.overview': 'Overview',
    'detail.tab.news': 'News',
    'detail.tab.community': 'Community',
    'detail.tab.financials': 'Financials',
    'detail.about': 'About',
    'detail.profile.ceo': 'CEO',
    'detail.profile.hq': 'HQ',
    'detail.profile.founded': 'Founded',
    'detail.profile.sector': 'Sector',
    'detail.profile.ipo': 'IPO',
    'detail.profile.site': 'Website',
    'detail.fin.label': 'Item',
    'detail.fin.rev': 'Revenue',
    'detail.fin.op': 'Operating income',
    'detail.fin.net': 'Net income',
    'detail.fin.opm': 'Op margin',
    'detail.fin.eps': 'EPS',
    'detail.code': 'Code',
    'detail.live': 'LIVE',

    'order.book': 'Order book',
    'order.bookCurrent': 'Current',
    'order.tab.buy': 'Buy',
    'order.tab.sell': 'Sell',
    'order.type': 'Order type',
    'order.type.limit': 'Limit',
    'order.type.market': 'Market',
    'order.type.reserved': 'Scheduled',
    'order.price': 'Order price',
    'order.qty': 'Quantity',
    'order.expectedTotal': 'Estimated total',
    'order.cashAvail': 'Available cash',
    'order.placeBuy': 'Buy',
    'order.placeSell': 'Sell',
    'order.acceptedBuy': 'Buy order placed',
    'order.acceptedSell': 'Sell order placed',
    'order.disclaimer': 'Quotes may be delayed up to 15 min. This is a design demo only.',

    'alert.title': 'Price alert',
    'alert.sub': 'Get a browser notification when the target is hit.',
    'alert.above': 'above',
    'alert.below': 'below',
    'alert.placeholder': 'e.g. 1000',
    'alert.add': 'Set',
    'alert.remove': 'Remove',

    'foot.demo': 'Learning demo · Toss Invest design style',
    'foot.long':
      'This page is a learning demo styled after Toss Invest. Do not use for actual investing.',
  },

  ja: {
    'nav.home': 'ホーム',
    'nav.stock': '株式',
    'nav.search': '検索',
    'nav.portfolio': '資産',
    'nav.history': '注文履歴',
    'topbar.searchPlaceholder': '銘柄名・ティッカー検索',
    'topbar.login': 'ログイン',
    'aria.notify': '通知',
    'aria.share': '共有',
    'aria.star': 'ウォッチリストに追加',
    'aria.theme': 'テーマ切替',
    'aria.locale': '言語切替',

    'home.heroEyebrow': '今日のマーケット',
    'home.heroTitle': '米国市場は堅調にスタート',
    'home.heroSub': 'AI半導体セクター中心に買いが流入しています。',
    'home.todaysStock': '今日の銘柄を見る →',
    'home.watchlist': 'ウォッチリスト',
    'home.trending': '人気の銘柄',
    'home.gainers': '上昇銘柄',
    'home.losers': '下落銘柄',
    'home.top5': '上位5件',

    'search.title': '銘柄検索',
    'search.fullPlaceholder': '銘柄名・ティッカー・productCodeで検索',
    'search.hint': '例) NVIDIA、NVDA、NAS0221219002',
    'search.results': '検索結果',
    'search.empty': "'{q}' に一致する銘柄はありません。",

    'portfolio.totalValue': '総評価額',
    'portfolio.holdings': '保有銘柄',
    'portfolio.col.stock': '銘柄',
    'portfolio.col.qty': '数量',
    'portfolio.col.avgPrice': '平均取得',
    'portfolio.col.currentPrice': '現在値',
    'portfolio.col.value': '評価額',
    'portfolio.col.pnl': '損益',

    'history.title': '注文履歴',
    'history.filterAll': 'すべて',
    'history.filterFilled': '約定',
    'history.filterPending': '未約定',
    'history.filterCanceled': 'キャンセル',
    'history.filterBuy': '買い',
    'history.filterSell': '売り',
    'history.heading': '注文',
    'history.col.placedAt': '注文時刻',
    'history.col.side': '区分',
    'history.col.type': '種類',
    'history.col.price': '注文価格',
    'history.col.status': '状態',
    'history.empty': '該当する注文はありません。',

    'chart.range.1D': '1日',
    'chart.range.1W': '1週',
    'chart.range.1M': '1ヶ月',
    'chart.range.3M': '3ヶ月',
    'chart.range.1Y': '1年',
    'chart.range.5Y': '5年',
    'chart.range.ALL': '全て',
    'chart.mode.line': 'ライン',
    'chart.mode.candle': 'ローソク',
    'chart.toggleBenchmark': '指数比較',
    'chart.toggleMA': 'MA(20)',

    'detail.metrics': '株価情報',
    'detail.metric.open': '始値',
    'detail.metric.high': '高値',
    'detail.metric.low': '安値',
    'detail.metric.volume': '出来高',
    'detail.metric.prevClose': '前日終値',
    'detail.metric.high52': '52週高値',
    'detail.metric.low52': '52週安値',
    'detail.metric.marketCap': '時価総額',
    'detail.metric.per': 'PER',
    'detail.metric.eps': 'EPS',
    'detail.backtest': 'バックテスト (現在期間)',
    'detail.backtestSub': '選択期間を買い持ちした場合の結果です。',
    'detail.bt.totalReturn': '総リターン',
    'detail.bt.mdd': '最大ドローダウン',
    'detail.bt.volatility': 'ボラティリティ (年率)',
    'detail.bt.sharpe': 'シャープレシオ',
    'detail.bt.start': '期間開始',
    'detail.bt.end': '期間終了',
    'detail.holding': '保有中の {ticker}',
    'detail.holding.qty': '保有数量',
    'detail.holding.avg': '平均取得',
    'detail.holding.value': '評価額',
    'detail.holding.pnl': '損益',
    'detail.tab.overview': '銘柄情報',
    'detail.tab.news': 'ニュース',
    'detail.tab.community': 'コミュニティ',
    'detail.tab.financials': '財務',
    'detail.about': '企業概要',
    'detail.profile.ceo': 'CEO',
    'detail.profile.hq': '本社',
    'detail.profile.founded': '設立',
    'detail.profile.sector': '業種',
    'detail.profile.ipo': '上場日',
    'detail.profile.site': 'ウェブサイト',
    'detail.fin.label': '項目',
    'detail.fin.rev': '売上',
    'detail.fin.op': '営業利益',
    'detail.fin.net': '純利益',
    'detail.fin.opm': '営業利益率',
    'detail.fin.eps': 'EPS',
    'detail.code': 'コード',
    'detail.live': 'LIVE',

    'order.book': '気配値',
    'order.bookCurrent': '現在値',
    'order.tab.buy': '買い',
    'order.tab.sell': '売り',
    'order.type': '注文タイプ',
    'order.type.limit': '指値',
    'order.type.market': '成行',
    'order.type.reserved': '予約注文',
    'order.price': '注文価格',
    'order.qty': '数量',
    'order.expectedTotal': '想定約定金額',
    'order.cashAvail': '注文可能額',
    'order.placeBuy': '購入する',
    'order.placeSell': '売却する',
    'order.acceptedBuy': '買い注文を受け付けました',
    'order.acceptedSell': '売り注文を受け付けました',
    'order.disclaimer': '株価は約15分遅れる場合があります。本画面はデザインデモです。',

    'alert.title': '価格アラート',
    'alert.sub': '指定価格に到達するとブラウザ通知でお知らせします。',
    'alert.above': '以上',
    'alert.below': '以下',
    'alert.placeholder': '例) 1000',
    'alert.add': '設定',
    'alert.remove': '削除',

    'foot.demo': '学習用デモ · トス証券デザイン',
    'foot.long':
      '本ページはトス証券のデザインを模した学習用デモです。実投資には使用しないでください。',
  },
};

const KEY = 'tossinvest:locale';
const VALID = ['ko', 'en', 'ja'];
const subs = new Set();

export function getLocale() {
  const stored = localStorage.getItem(KEY);
  if (VALID.includes(stored)) return stored;
  const browser = (navigator.language || 'ko').slice(0, 2).toLowerCase();
  return VALID.includes(browser) ? browser : 'ko';
}

export function setLocale(loc) {
  if (!VALID.includes(loc)) return;
  localStorage.setItem(KEY, loc);
  applyLocale(loc);
  subs.forEach(fn => {
    try {
      fn(loc);
    } catch (e) {
      console.warn('[i18n] subscriber failed:', e.message);
    }
  });
}

export function onLocaleChange(fn) {
  subs.add(fn);
  return () => subs.delete(fn);
}

export function t(key, vars = {}, loc = getLocale()) {
  const raw = DICT[loc]?.[key] ?? DICT.ko[key] ?? key;
  return raw.replace(/\{(\w+)\}/g, (_, name) => (vars[name] !== undefined ? vars[name] : ''));
}

function applyLocale(loc) {
  document.documentElement.setAttribute('lang', loc);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n, {}, loc);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder, {}, loc));
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    el.setAttribute('aria-label', t(el.dataset.i18nAria, {}, loc));
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
