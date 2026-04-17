# TODO — 미완성 및 개선 항목

> 분석 기준일: 2026-04-17  
> 우선순위: 🔴 Critical · 🟠 High · 🟡 Medium · 🟢 Low

---

## 🔴 Critical — 버그 / 배포 장애

### 1. GitHub Pages 배포 시 assets 로드 실패
- **파일:** `vite.config.js`
- **원인:** `base` 경로 미설정. GitHub Pages는 `/sample/` 서브패스에서 서비스되므로 빌드된 JS·CSS 경로가 `/assets/…`로 잘못 생성됨
- **수정:**
  ```js
  // vite.config.js
  export default defineConfig({
    plugins: [react()],
    base: '/sample/',
  })
  ```

### 2. Todo ID 충돌 위험
- **파일:** `src/App.jsx` — reducer `ADD` 케이스
- **원인:** `id: Date.now()` 는 밀리초 단위라 빠르게 연속 추가 시 동일 ID 생성 가능
- **수정:** `crypto.randomUUID()` 사용
  ```js
  id: crypto.randomUUID(),
  ```

### 3. `Date.now()` 이중 호출
- **파일:** `src/App.jsx` — reducer `ADD` 케이스
- **원인:** `id: Date.now()` 와 `created: Date.now()` 가 같은 객체 리터럴 안에서 두 번 호출되어 미세한 시간차로 값이 달라질 수 있음
- **수정:** 하나의 변수로 캡처 후 재사용
  ```js
  case 'ADD': {
    const now = Date.now()
    return [{ id: crypto.randomUUID(), created: now, ... }, ...state]
  }
  ```

---

## 🟠 High — UX 결함 / 기능 누락

### 4. 마감일 포맷 미처리
- **파일:** `src/components/TodoItem.jsx` (172번째 줄)
- **원인:** `todo.due` 가 `"2026-04-20"` 그대로 표시됨
- **수정:** 날짜 포매터 적용
  ```js
  const formatDue = (due) =>
    new Date(due).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
  ```

### 5. 추가 버튼 비활성화 처리 없음
- **파일:** `src/components/TodoInput.jsx`
- **원인:** 입력값이 비어 있어도 "추가" 버튼이 활성화 상태로 표시됨
- **수정:** `disabled={!text.trim()}` + 비활성 스타일 추가

### 6. 과거 마감일 선택 가능
- **파일:** `src/components/TodoInput.jsx` — date input
- **원인:** `min` 속성 없음
- **수정:**
  ```jsx
  <input type="date" min={new Date().toISOString().slice(0, 10)} ... />
  ```

### 7. 완료 항목에서 편집 버튼 노출
- **파일:** `src/components/TodoItem.jsx`
- **원인:** `todo.done === true` 여도 수정·삭제 버튼이 그대로 보임
- **수정:** 완료 상태에서 편집 버튼 숨기기 또는 비활성화

### 8. 우선순위·마감일 편집 불가
- **파일:** `src/App.jsx` (reducer), `src/components/TodoItem.jsx`
- **원인:** `EDIT` 액션이 `text` 만 수정하고 `priority`, `due` 는 변경 불가
- **수정:** reducer에 `UPDATE_META` 액션 추가 또는 편집 모드에서 메타 필드 함께 표시

### 9. 삭제 및 완료 항목 일괄 삭제 시 확인 없음
- **파일:** `src/components/TodoItem.jsx`, `src/App.jsx` (ClearButton)
- **원인:** 클릭 즉시 삭제 실행, 실수 복구 방법 없음
- **수정:** 삭제 시 확인 다이얼로그 또는 Undo 토스트 알림

### 10. 검색어 초기화 버튼 없음
- **파일:** `src/components/FilterBar.jsx`
- **원인:** 검색 입력 필드에 클리어(×) 버튼 없음
- **수정:** 검색어 있을 때 × 버튼 표시

### 11. 완료 항목 없을 때 "완료 항목 삭제" 버튼 노출
- **파일:** `src/App.jsx`
- **원인:** 완료 항목이 0개여도 버튼이 항상 표시됨
- **수정:**
  ```jsx
  {doneCount > 0 && <ClearButton onClick={handleClear} />}
  ```

### 12. `getDateLabel()` 매 렌더마다 재호출
- **파일:** `src/App.jsx`
- **원인:** 함수를 JSX 안에서 직접 호출, 렌더마다 `new Date()` 생성
- **수정:** 컴포넌트 바깥 상수로 이동 또는 `useMemo`

---

## 🟡 Medium — 코드 품질 / 접근성

### 13. 접근성(a11y) — 체크박스가 `<div>`로 구현
- **파일:** `src/components/TodoItem.jsx` (107번째 줄)
- **원인:** `<div onClick>` 은 키보드 접근 불가, 스크린 리더 인식 안 됨
- **수정:** `<button role="checkbox" aria-checked={todo.done}>` 또는 `<input type="checkbox">` 로 교체

### 14. 접근성 — ARIA 속성 누락
- **파일:** `src/components/TodoItem.jsx`, `src/components/FilterBar.jsx`
- **원인:** `aria-label`, `aria-live`, `role` 등 미설정
- **수정 예시:**
  - 삭제 버튼: `aria-label={`${todo.text} 삭제`}`
  - 검색 입력: `aria-label="할 일 검색"`
  - 할 일 목록: `role="list"` / 각 항목: `role="listitem"`

### 15. 접근성 — 포커스 스타일 없음
- **파일:** `src/index.css`
- **원인:** `outline: none` 만 설정되고 `:focus-visible` 대체 스타일 없음
- **수정:**
  ```css
  :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  ```

### 16. `IconButton`에 `type="button"` 누락
- **파일:** `src/components/TodoItem.jsx` (28번째 줄 `IconButton`)
- **원인:** 기본값 `type="submit"` 이므로 form 컨텍스트에서 의도치 않게 submit 발생 가능
- **수정:** `<button type="button" ...>`

### 17. `isOverdue` 함수 prop 전달 구조 어색
- **파일:** `src/components/TodoList.jsx` (2번째 줄), `TodoItem.jsx`
- **원인:** `isOverdue`를 `App.jsx`에서 export → `TodoList` → `TodoItem` 으로 prop drilling
- **수정:** `src/utils/date.js` 같은 공유 유틸 파일로 분리 후 각 컴포넌트에서 직접 import

### 18. `ClearButton`이 `App.jsx` 내부에 인라인 정의
- **파일:** `src/App.jsx` (134번째 줄)
- **원인:** 파일 구조 일관성 저하
- **수정:** `src/components/ClearButton.jsx` 로 분리

### 19. `todo.updatedAt` 타임스탬프 없음
- **파일:** `src/App.jsx` — reducer
- **원인:** 편집 시간 추적 불가
- **수정:** `EDIT` / `TOGGLE` 액션에서 `updatedAt: Date.now()` 업데이트

### 20. PropTypes 또는 TypeScript 타입 정의 없음
- **파일:** 전체
- **원인:** props 타입 검증 없음 → 오탈자나 잘못된 타입 전달 시 런타임 오류
- **수정 옵션 A:** `prop-types` 패키지 추가  
  **수정 옵션 B:** TypeScript(`.tsx`) 로 마이그레이션

### 21. ESLint / Prettier 미설정
- **파일:** `package.json`, 프로젝트 루트
- **원인:** 코드 스타일 일관성 도구 없음
- **수정:**
  ```bash
  npm install -D eslint prettier eslint-plugin-react eslint-plugin-react-hooks
  ```

---

## 🟡 Medium — 배포 파이프라인

### 22. `Makefile` deploy 명령 — dist가 .gitignore에 포함됨
- **파일:** `Makefile`, `.gitignore`
- **원인:** `.gitignore` 에 `dist` 포함되어 `git add dist -f` 로 강제 추가해야 하나, 표준 워크플로우 아님
- **수정 옵션 A:** GitHub Actions 워크플로우 (`gh-pages` 브랜치 자동 배포)  
  **수정 옵션 B:** `npm install -D gh-pages` + deploy 스크립트 사용

### 23. GitHub Actions CI 없음
- **파일:** `.github/workflows/` 디렉토리 없음
- **원인:** PR 시 자동 빌드·배포 없음
- **수정:** `.github/workflows/deploy.yml` 추가 (push → build → gh-pages 브랜치 배포)

---

## 🟢 Low — 기능 확장

### 24. 라이트 모드 미지원
- **파일:** `src/index.css`
- **원인:** CSS 변수가 다크 고정
- **수정:** `@media (prefers-color-scheme: light)` 미디어 쿼리 또는 테마 토글 버튼

### 25. 모바일 반응형 미비
- **파일:** `src/index.css`, 각 컴포넌트 인라인 스타일
- **원인:** 고정 padding, 미디어 쿼리 없음
- **수정:** `@media (max-width: 480px)` 구간 추가

### 26. 테스트 코드 없음
- **파일:** 없음
- **수정:** Vitest + React Testing Library 설치 후 주요 reducer·컴포넌트 단위 테스트 작성
  ```bash
  npm install -D vitest @testing-library/react @testing-library/user-event
  ```

### 27. 실행 취소(Undo) 기능 없음
- **파일:** `src/App.jsx`
- **원인:** 삭제/완료 처리 후 복구 수단 없음
- **수정:** `useReducer` 상태에 `history` 스택 추가 또는 토스트 UI에 "되돌리기" 버튼

### 28. 카테고리 / 태그 기능 없음
- **원인:** 데이터 모델에 `tags` 필드 없음
- **수정:** todo 객체에 `tags: string[]` 추가, FilterBar에 태그 필터 UI 추가

### 29. JSON 내보내기 / 가져오기 없음
- **원인:** 데이터 이동 수단 없음
- **수정:** 내보내기: `JSON.stringify(todos)` → Blob 다운로드  
  가져오기: file input → JSON.parse → dispatch

### 30. PWA / 오프라인 지원 없음
- **원인:** `vite-plugin-pwa` 미설치, `manifest.json` 없음
- **수정:**
  ```bash
  npm install -D vite-plugin-pwa
  ```

---

## 체크리스트 요약

| # | 항목 | 우선순위 | 파일 |
|---|------|---------|------|
| 1 | vite.config.js base 경로 설정 | 🔴 | `vite.config.js` |
| 2 | ID 생성 → `crypto.randomUUID()` | 🔴 | `App.jsx` |
| 3 | Date.now() 이중 호출 수정 | 🔴 | `App.jsx` |
| 4 | 마감일 한국어 포맷 표시 | 🟠 | `TodoItem.jsx` |
| 5 | 추가 버튼 disabled 처리 | 🟠 | `TodoInput.jsx` |
| 6 | date input min=today | 🟠 | `TodoInput.jsx` |
| 7 | 완료 항목 편집 버튼 숨김 | 🟠 | `TodoItem.jsx` |
| 8 | 우선순위·마감일 편집 | 🟠 | `App.jsx`, `TodoItem.jsx` |
| 9 | 삭제 확인 / Undo | 🟠 | `TodoItem.jsx`, `App.jsx` |
| 10 | 검색 초기화 버튼 | 🟠 | `FilterBar.jsx` |
| 11 | 완료 0개 시 삭제 버튼 숨김 | 🟠 | `App.jsx` |
| 12 | getDateLabel 최적화 | 🟡 | `App.jsx` |
| 13 | 체크박스 `<div>` → `<button>` | 🟡 | `TodoItem.jsx` |
| 14 | ARIA 속성 추가 | 🟡 | 전체 |
| 15 | :focus-visible 스타일 | 🟡 | `index.css` |
| 16 | `type="button"` 추가 | 🟡 | `TodoItem.jsx` |
| 17 | isOverdue utils 분리 | 🟡 | `App.jsx`, `TodoList.jsx` |
| 18 | ClearButton 파일 분리 | 🟡 | `App.jsx` |
| 19 | updatedAt 타임스탬프 | 🟡 | `App.jsx` |
| 20 | PropTypes / TypeScript | 🟡 | 전체 |
| 21 | ESLint / Prettier 설정 | 🟡 | `package.json` |
| 22 | deploy 워크플로우 개선 | 🟡 | `Makefile` |
| 23 | GitHub Actions CI/CD | 🟡 | `.github/workflows/` |
| 24 | 라이트 모드 | 🟢 | `index.css` |
| 25 | 모바일 반응형 | 🟢 | `index.css` |
| 26 | 테스트 코드 (Vitest) | 🟢 | 신규 |
| 27 | Undo 기능 | 🟢 | `App.jsx` |
| 28 | 카테고리 / 태그 | 🟢 | 전체 |
| 29 | JSON 내보내기/가져오기 | 🟢 | 신규 |
| 30 | PWA / 오프라인 | 🟢 | `vite.config.js` |
