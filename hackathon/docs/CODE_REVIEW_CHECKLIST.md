# 코드 리뷰 체크리스트

> PR 머지 전 리뷰어와 작성자가 공통으로 확인하는 체크리스트입니다.
> 완료 항목: ✅ / 미완료 항목: ⬜

---

## 1. 공통

### 1-1. 보안
- ⬜ API 키, 비밀번호, 커넥션 스트링이 코드에 하드코딩되어 있지 않다
- ⬜ 새 환경변수가 추가된 경우 `appsettings.example.json` 및 `.env.example`이 함께 업데이트되었다
- ⬜ 민감한 정보가 로그에 출력되지 않는다
- ⬜ 사용자 입력값은 서버 사이드에서 유효성 검사를 통과한다

### 1-2. 코드 품질
- ⬜ 미사용 변수, import, 주석 처리된 코드가 없다
- ⬜ 매직 넘버/문자열 대신 `const` 또는 `enum`을 사용한다
- ⬜ 함수/메서드 하나의 역할이 단일 책임 원칙(SRP)을 준수한다
- ⬜ 복잡한 로직에 한국어 주석이 달려 있다
- ⬜ `TODO:` / `FIXME:` 항목이 이번 PR 범위라면 해결되었다

### 1-3. 테스트
- ⬜ 새 기능/버그 수정에 대응하는 테스트가 추가되었다
- ⬜ 기존 테스트가 모두 통과한다 (`dotnet test` / `npm test`)
- ⬜ 빌드 오류가 없다 (`dotnet build` / `npm run build`)
- ⬜ 린트 오류가 없다 (`npx eslint .`)

### 1-4. 문서
- ⬜ 새 API 엔드포인트가 추가된 경우 `docs/API.md`가 업데이트되었다
- ⬜ DB 스키마 변경 시 EF Core 마이그레이션 파일이 생성되었다
- ⬜ `deploy.md`에 수동 배포 절차가 기록되어 있다

---

## 2. 프론트엔드 (Next.js / TypeScript)

### 2-1. 타입 안전성
- ⬜ `any` 타입을 사용하지 않는다 (`@typescript-eslint/no-explicit-any`)
- ⬜ `@ts-ignore`, `@ts-nocheck`를 사용하지 않는다
- ⬜ 컴포넌트 props에 명시적 타입 정의가 있다

### 2-2. 스타일
- ⬜ 인라인 스타일(`style={{ ... }}`)을 사용하지 않는다
  - 동적 값이 필요한 경우 CSS 커스텀 프로퍼티 패턴(`style={{ '--var': value } as React.CSSProperties}` + `[width:var(--var)]`)을 사용한다
- ⬜ Tailwind CSS만 사용하고 별도 CSS 파일에 새 규칙을 추가하지 않는다
- ⬜ 클래스명에 오타나 존재하지 않는 Tailwind 유틸리티가 없다

### 2-3. 이미지 및 외부 리소스
- ⬜ 이미지는 `next/image`를 사용한다 (`@next/next/no-img-element`)
  - `<img>` 태그가 불가피한 경우(예: `onError` 핸들러) `eslint-disable` 주석과 이유를 명시한다
- ⬜ `next/image` 사용 시 `src`에 이모지나 잘못된 URL이 전달되지 않는다

### 2-4. React 규칙
- ⬜ `useState` lazy initializer를 사용하여 SSR에서 `window`/`sessionStorage` 직접 접근을 방지한다
- ⬜ `useEffect` 내에서 `setState`를 동기적으로 호출하지 않는다
  - 불가피한 경우 `eslint-disable` 주석과 이유를 명시한다
- ⬜ `useEffect` 의존성 배열이 정확하다 (`react-hooks/exhaustive-deps`)
  - 의도적 생략이라면 주석으로 근거를 설명한다
- ⬜ `use client` 지시자를 최소한으로 사용한다 (서버 컴포넌트 우선)

### 2-5. 데이터 페칭
- ⬜ 서버 상태는 TanStack Query (`useQuery`, `useMutation`)로 관리한다
- ⬜ 로딩/에러 상태가 UI에 반영되어 있다
- ⬜ API 에러 시 사용자에게 적절한 메시지가 표시된다

---

## 3. 백엔드 (.NET / C#)

### 3-1. 아키텍처
- ⬜ Clean Architecture 레이어 의존성 방향이 지켜진다 (API → Application → Domain ← Infrastructure)
- ⬜ 비즈니스 로직이 Controller가 아닌 Service 레이어에 있다
- ⬜ 새 서비스는 인터페이스 먼저 정의 후 구현체가 작성되었다
- ⬜ DI 컨테이너에 등록되어 있다 (`Program.cs`)

### 3-2. 비동기 처리
- ⬜ 모든 비동기 메서드에 `Async` 접미사가 붙어 있다
- ⬜ `.Result` / `.Wait()` 호출이 없다 (데드락 위험)
- ⬜ `async void` 메서드가 없다 (이벤트 핸들러 제외)

### 3-3. 에러 처리 및 응답 형식
- ⬜ API 응답이 통일된 형식을 따른다 (`{ success, data }` / `{ success, error, code }`)
- ⬜ 예외 처리가 글로벌 미들웨어에서 처리된다
- ⬜ 4xx/5xx 상태 코드가 적절히 사용된다

### 3-4. 데이터베이스
- ⬜ Raw SQL 대신 EF Core LINQ를 사용한다
- ⬜ N+1 쿼리가 발생하지 않는다 (`Include`, `Select` 확인)
- ⬜ 스키마 변경 시 마이그레이션 파일이 존재한다

---

## 4. eslint-disable 사용 규칙

`eslint-disable` 주석 사용 시 반드시 다음 형식으로 이유를 명시합니다:

```tsx
// eslint-disable-next-line <rule-name>
// 이유: <왜 이 규칙을 비활성화해야 하는지 한 줄 설명>
```

**허용되는 케이스:**
| 규칙 | 허용 케이스 |
|------|------------|
| `@next/next/no-img-element` | `onError` 핸들러가 필요한 이미지 (next/image는 onError 미지원) |
| `react-hooks/set-state-in-effect` | 모달/다이얼로그 폼 초기화 등 props 변경 동기화가 불가피한 경우 |
| `react-hooks/exhaustive-deps` | `initialData?.id` 등 의도적 부분 의존성으로 불필요한 리렌더링 방지 |

**금지:**
- 이유 없는 `eslint-disable` 블록 주석 (파일 전체 비활성화)
- `@ts-ignore`, `@ts-nocheck` 사용

---

*최종 업데이트: 2026-03-15*
