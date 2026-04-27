# TOSSINVEST

토스증권(tossinvest.com) 디자인 스타일을 모방한 정적 웹사이트 데모.

## Pages

| Path | 설명 |
| --- | --- |
| `/index.html?focusedProductCode=<code>` | 종목 상세 (차트, 호가창, 보유 현황, 매수/매도) |
| `/home.html` | 홈 — 지수, 인기 종목, 상승/하락 종목 |
| `/search.html?q=<query>` | 종목 검색 |
| `/portfolio.html` | 내 자산 — 총 평가금액, 보유 종목 P&L, 자산 배분 도넛 차트 |

지원 productCode: `NAS0221219002` (NVDA), `NASAAPL`, `NASTSLA`, `NASMSFT`, `KRX005930`.

## Features

- **차트**: 7개 기간(1D/1W/1M/3M/1Y/5Y/ALL) · 호버 툴팁 · 나스닥 지수 비교 토글
- **호가창**: 5단계 매도/매수 호가, 클릭하면 주문 가격 자동 입력
- **주문 패널**: 매수/매도 토글, 빠른 비율(10/25/50/100%), 지정가/시장가
- **다크 모드**: localStorage 저장, 페이지 간 유지
- **반응형**: 1080/980/640px 브레이크포인트
- **다중 통화**: USD/KRW 자동 포맷팅
- **URL 파라미터**: `focusedProductCode` 로 종목 동적 로딩

## Local development

```bash
npm install
npm run serve       # http://localhost:8765
npm run lint        # ESLint 검사
npm run format      # Prettier 자동 포맷
npm run verify      # Playwright 통합 검증 (24 checks)
```

## Deployment

`main` 브랜치에 푸시되면 GitHub Actions가 자동으로 GitHub Pages에 배포합니다 (`.github/workflows/pages.yml`).
