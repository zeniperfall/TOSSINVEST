# TOSSINVEST

토스증권(tossinvest.com) 디자인 스타일을 모방한 정적 웹사이트 데모.

배포: `https://zeniperfall.github.io/TOSSINVEST/`

## Pages

| Path                                    | 설명                                                      |
| --------------------------------------- | --------------------------------------------------------- |
| `/home.html`                            | 홈 — 지수, 관심 종목, 인기·상승·하락 종목                 |
| `/index.html?focusedProductCode=<code>` | 종목 상세 (차트, 호가창, 보유 현황, 매수/매도, 라이브 틱) |
| `/search.html?q=<query>`                | 종목 검색                                                 |
| `/portfolio.html`                       | 내 자산 — 총 평가금액, 보유 종목 P&L, 자산 배분 도넛 차트 |
| `/history.html`                         | 주문 내역 (체결·미체결·취소, 매수/매도 필터)              |

지원 productCode: `NAS0221219002`(NVDA), `NASAAPL`, `NASTSLA`, `NASMSFT`,
`NASGOOGL`, `NASAMZN`, `NASMETA`, `NASNFLX`, `NASAMD`, `KRX005930`(삼성전자),
`KRX000660`(SK하이닉스), `KRX035420`(네이버), `KRX373220`(LG에너지솔루션).

## Features

- **차트**: 7개 기간(1D/1W/1M/3M/1Y/5Y/ALL) · 호버 툴팁 · 선/캔들 모드 토글 · MA(20) 오버레이 · 지수 비교 · 거래량 바 차트
- **호가창**: 5단계 매도/매수 호가, 클릭하면 주문 가격 자동 입력
- **주문 패널**: 매수/매도 토글, 빠른 비율(10/25/50/100%), 지정가/시장가
- **라이브 틱**: 1.5초 간격 시세 시뮬레이션, LIVE 펄스 배지, 가격 플래시 애니메이션
- **관심 종목**: 별 토글로 추가/제거, localStorage 영속화, 홈 화면에 표시
- **검색 자동완성**: 상단바 글로벌 검색 + 키보드 네비게이션
- **3-way 테마**: 자동(시스템 따름) / 라이트 / 다크 — localStorage 저장, 페이지 간 유지
- **PWA**: 설치 가능, 오프라인 지원 (Service Worker가 앱 셸 캐싱)
- **목표가 알림**: 브라우저 Notification API + 라이브 틱이 가격 도달 시 자동 알림
- **반응형**: 1180/980/640px 브레이크포인트, 모바일 가로 스크롤 0
- **다중 통화**: USD/KRW 자동 포맷팅
- **URL 파라미터**: `focusedProductCode`로 종목 동적 로딩, 잘못된 코드는 NVDA로 폴백

## Local development

```bash
npm install
npm run serve         # http://localhost:8765
npm run lint          # ESLint
npm run format        # Prettier 자동 정렬
npm run test:unit     # 12개 단위 테스트 (node:test)
npm run verify        # 53개 Playwright E2E (서버 띄운 후)
npm run verify:all    # 단위 + E2E 모두
```

## CI / Deployment

- **`.github/workflows/pages.yml`** — main 푸시 시 자동으로 GitHub Pages 배포
- **`.github/workflows/lighthouse.yml`** — PR마다 Lighthouse CI 실행 (a11y ≥ 0.9 강제)
- **`.github/dependabot.yml`** — 주간 npm 업데이트 + 월간 actions 업데이트
- 배포 단계는 lint → format check → unit test → 사이트 스테이징 → Pages 업로드

## 기여

[`CONTRIBUTING.md`](./CONTRIBUTING.md) 참조. 차기 작업은 [`ROADMAP.md`](./ROADMAP.md)에 정리.

## License

MIT — [`LICENSE`](./LICENSE)
