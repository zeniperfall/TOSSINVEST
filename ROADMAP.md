# ROADMAP — 차기 작업 백로그

마지막 업데이트: 2026-04-27 · 작업 단위 표기 — **S**(시간 단위) · **M**(일 단위) · **L**(주 단위)

현재 상태 요약: 5개 페이지 정적 사이트, 36개 E2E 통과, GitHub Pages 배포 완료
(`https://zeniperfall.github.io/TOSSINVEST/`).

---

## 🔴 P0 — 마무리 / 운영 준비

| # | 항목 | 단위 | 비고 |
|---|---|---|---|
| 1 | 피처 브랜치 → `main` 머지 | S | 5개 커밋, 21파일 +3637/-1 |
| 2 | `pages.yml`의 `claude/**` 트리거 제거 | S | main 머지 후 정리 |
| 3 | `github-pages` 환경 보호 규칙 복구 | S | main 전용으로 되돌리기 |
| 4 | Node.js 20 deprecation 경고 해결 | S | `actions/*@v4` → 최신 |
| 5 | Lighthouse CI 첫 실행 + 점수 베이스라인 | S | PR 트리거 동작 확인 |

## 🟠 P1 — 신뢰성 / 보안 / SEO

| # | 항목 | 단위 |
|---|---|---|
| 6 | Pretendard 자체 호스팅 (CDN 의존 제거) | S |
| 7 | 보안 헤더 — CSP, X-Frame-Options, Referrer-Policy (meta or `_headers`) | S |
| 8 | SEO — Open Graph / Twitter Card / `sitemap.xml` / `robots.txt` | S |
| 9 | 색상 대비 자동 검사 (axe-core 통합 / Playwright 확장) | M |
| 10 | 단위 테스트 도입 (Vitest) — fmtPrice, buildSeries, buildOrderBook | M |
| 11 | 에러 모니터링 (Sentry 또는 GlitchTip) — 클라이언트 예외 수집 | M |

## 🟡 P2 — 데이터 / 핵심 기능 확장

| # | 항목 | 단위 |
|---|---|---|
| 12 | 실제 시장 데이터 연동 (Yahoo Finance / Alpha Vantage / Polygon) | L |
| 13 | WebSocket 실시간 시세 — `assets/live.js` 시뮬레이터 교체 | L |
| 14 | 캔들차트 모드 추가 (커스텀 SVG 또는 lightweight-charts) | M |
| 15 | 거래량 바 차트 (가격 차트 하단 보조 패널) | M |
| 16 | 종목 카탈로그 5종 → 50+ 확장 (자동 import 구조) | M |
| 17 | 종목 검색 자동완성 + debounce + 방향키 네비게이션 | M |
| 18 | 관심 종목 (Watchlist) localStorage 영속화 + 즐겨찾기 별표 활성화 | S |
| 19 | 주문 히스토리 페이지 (체결 내역, 미체결, 취소) | M |
| 20 | 차트 인디케이터 — MA, RSI, MACD 토글 | M |

## 🟢 P3 — UX / 디자인 폴리싱

| # | 항목 | 단위 |
|---|---|---|
| 21 | PWA 지원 — `manifest.json`, Service Worker, 오프라인 폴백 | M |
| 22 | 모바일 제스처 — pull-to-refresh, swipe nav | M |
| 23 | 다국어 (i18n) — EN, JA | M |
| 24 | 다크/라이트 모드 외 시스템 자동 / 고대비 모드 추가 | S |
| 25 | 알림센터 — 목표가 도달 시 브라우저 푸시 (Notification API) | M |
| 26 | 가상 거래 시뮬레이션 모드 + 백테스트 | L |

## 🔵 P4 — 엔지니어링 인프라 / 코드 품질

| # | 항목 | 단위 |
|---|---|---|
| 27 | Vite 빌드 도입 — 번들/트리쉐이킹/캐시버스팅 해시 | M |
| 28 | TypeScript 점진 도입 — JSDoc 보강 → `.ts` 변환 | L |
| 29 | Storybook (또는 Histoire) 컴포넌트 카탈로그 | M |
| 30 | Web Vitals (LCP/INP/CLS) 자동 수집 (RUM) | M |
| 31 | 브랜치 보호 — `main` 직접 푸시 차단, 리뷰 필수 | S |
| 32 | Repo 메타 — `CONTRIBUTING.md`, PR/Issue 템플릿, `LICENSE` | S |
| 33 | Renovate / Dependabot — 의존성 자동 PR | S |

## ⚪ P5 — 장기 / 백엔드 도입 검토

| # | 항목 | 단위 |
|---|---|---|
| 34 | 백엔드 (Node + Postgres / Supabase) — 사용자 계정·보유 종목 영속화 | L |
| 35 | OAuth 로그인 (Google/카카오) | M |
| 36 | 실제 거래 시뮬레이션 엔진 — 체결 모델, 수수료, 세금 | L |
| 37 | ETF / 채권 / 옵션 자산군 추가 | L |
| 38 | 멀티 계좌 / 자산 통합 뷰 | M |

---

## 추천 다음 스프린트 묶음 (예시)

**Sprint A — "운영 정상화"** (1-2일): #1, #2, #3, #4, #5, #31, #32

**Sprint B — "신뢰성"** (3-5일): #6, #7, #8, #9, #10

**Sprint C — "실시간 시세"** (1-2주): #12, #13, #16, #17, #18

**Sprint D — "차트 강화"** (1주): #14, #15, #20

각 항목은 독립적으로 진행 가능합니다. 우선순위는 검토 후 자유롭게 재조정해 주세요.
