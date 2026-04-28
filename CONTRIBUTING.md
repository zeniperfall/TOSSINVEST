# Contributing

이 프로젝트는 정적 사이트 데모입니다. 빌드 도구 없이 바닐라 ES Modules로 동작합니다.

## 개발 환경

- Node 20+ (E2E 테스트 실행용)
- 모던 브라우저 (Chrome 110+ / Safari 16+)

## 시작하기

```bash
npm install      # http-server, eslint, prettier, playwright
npm run serve    # http://localhost:8765
```

## 워크플로우

1. 이슈 생성 또는 기존 이슈 선택
2. 피처 브랜치 생성: `feat/<short-name>` 또는 `fix/<short-name>`
3. 코드 변경
4. **로컬 검증**:
   ```bash
   npm run lint          # ESLint
   npm run format        # Prettier 자동 정렬
   npm run test:unit     # node:test 단위 테스트
   npm run verify        # Playwright E2E (서버가 떠 있어야 함)
   ```
5. PR 생성 (PR 템플릿 자동 적용됨)

## 커밋 컨벤션

명령형, 한 줄 제목 + 본문(선택). 영어 권장.

```
add candlestick chart mode

Toggles between line and candle render via mode-btn group; persists
the user's preference for the session.
```

## 코드 스타일

- Prettier (`.prettierrc.json`) — single-quote, semi, 100 char width
- ESLint flat config (`eslint.config.js`)
- CSS — token 기반 (`:root` + `[data-theme="dark"]`)
- HTML — 시맨틱 태그 우선 (`main`, `section`, `nav`, `header`, `footer`)

## 디렉터리 구조

```
.
├─ index.html / home.html / search.html / portfolio.html / history.html
├─ assets/
│   ├─ data.js          # 종목·시장·홀딩스·히스토리 mock
│   ├─ theme.js         # 다크 모드 + 네비 하이라이트
│   ├─ live.js          # 라이브 시세 시뮬레이터
│   ├─ watchlist.js     # localStorage 관심 종목
│   ├─ autocomplete.js  # 글로벌 검색 자동완성
│   ├─ home.js / portfolio.js / search.js / history.js
├─ script.js            # 종목 상세 페이지 진입점
├─ styles.css           # 전체 스타일
└─ tests/
    ├─ verify.mjs       # Playwright E2E
    └─ unit.mjs         # node:test 단위 테스트
```

## PR 체크리스트

- [ ] `npm run lint` 통과
- [ ] `npm run format:check` 통과
- [ ] `npm run test:unit` 통과
- [ ] `npm run verify` 통과
- [ ] 모바일 뷰포트(375px)에서 가로 스크롤 없음
- [ ] 다크 모드에서도 정상 동작
- [ ] 새 기능 추가 시 E2E 케이스 추가
