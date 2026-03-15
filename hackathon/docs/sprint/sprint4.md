# Sprint 4: 관리자 대시보드 + 성능 최적화 + 안정화

> **작업일:** 2026-03-15 | **상태:** ✅ 완료 | **브랜치:** sprint4

---

## 스프린트 목표

| 목표 | 설명 | 상태 |
|------|------|------|
| 관리자 대시보드 백엔드 | `GET /api/admin/stats`, `POST/PUT/DELETE /api/admin/games` CRUD API + FluentValidation | ✅ |
| 관리자 대시보드 프론트엔드 | `/admin` 페이지, 게임 CRUD 모달, AI 태그 관리, 데이터 수집 트리거 UI | ✅ |
| 성능 최적화 및 에러 처리 강화 | TanStack Query staleTime, 글로벌 에러 바운더리, API 타임아웃 | ✅ |
| 기술 부채 정리 | Phase 1~3 TODO/FIXME 해결, Claude API 프롬프트 최적화 | ✅ |
| 단위 테스트 | 관리자 서비스 CRUD xUnit 테스트 추가 | ✅ |

---

## 컨텍스트

Sprint 3(2026-03-15 완료)에서 맞춤 추천, 검색 기능이 완성된 상태. Must Have 11/11, Should Have 6/6 전체 완료.
이번 스프린트는 ROADMAP Phase 4의 Nice to Have 관리자 대시보드와 전체 안정화를 목표로 한다.

**Sprint 3 완료 기준선:**
- 백엔드 테스트: 29개 통과 (xUnit + Moq)
- 프론트엔드 빌드: TypeScript 오류 없음
- 기존 AdminController: `POST /api/admin/analyze/{id}`, `POST /api/admin/analyze/all`, `POST /api/admin/collect`
- 기존 서비스: `GameService`, `ClaudeApiService`, `GameRecommendationService`, `GameDataCollectorService`, `GameSearchService`, `HealthGoalRecommendService`
- 기존 페이지: `/`(홈), `/games/[id]`(상세), `/search`(검색), `/recommend`(추천)
- HealthTag 타입: `#심폐기능`, `#근력강화`, `#스트레스해소`, `#인지개선`, `#반응훈련`

**관리자 인증 관련 결정:**
- 해커톤 범위에서 인증 없이 구현 (ROADMAP Phase 4 주석 참조)
- 향후 Backlog B-03 (JWT 기반 인증)에서 확장 예정

---

## Task 4-1: 관리자 대시보드 - 백엔드

> 의존성: 기존 `GameService`, `IGameRepository` 확장. 가장 먼저 구현하여 프론트엔드 작업의 기반을 마련한다.

### 신규 파일

| 파일 | 역할 |
|------|------|
| `Application/DTOs/AdminDto.cs` | `AdminStatsDto`, `CreateGameRequest`, `UpdateGameRequest`, `AdminGameDto` 레코드 |
| `Application/Interfaces/IAdminService.cs` | 관리자 서비스 인터페이스 — CRUD + 통계 메서드 정의 |
| `Application/Services/AdminService.cs` | 게임 CRUD + 통계 집계 구현 |
| `Application/Validators/CreateGameRequestValidator.cs` | FluentValidation — 게임 추가 입력값 검증 |
| `Application/Validators/UpdateGameRequestValidator.cs` | FluentValidation — 게임 수정 입력값 검증 |
| `Tests/Services/AdminServiceTests.cs` | 관리자 서비스 단위 테스트 (CRUD + 통계) |

### 수정 파일

| 파일 | 변경 내용 |
|------|---------|
| `Api/Controllers/AdminController.cs` | 기존 analyze/collect 엔드포인트 유지 + stats/CRUD 엔드포인트 추가 |
| `Application/Interfaces/IGameRepository.cs` | `AddAsync`, `UpdateAsync`, `DeleteAsync` 메서드 추가 (없는 경우) |
| `Infrastructure/Repositories/GameRepository.cs` | `AddAsync`, `UpdateAsync`, `DeleteAsync` 구현 (없는 경우) |
| `Program.cs` | `AdminService`, `FluentValidation` DI 등록 |
| `docs/API.md` | 관리자 API 엔드포인트 명세 추가 |

### 핵심 설계 결정

- **FluentValidation 검증 규칙**:
  - `Name`: 필수, 최대 200자
  - `Description`: 필수, 최대 2000자
  - `Category`: 필수, 허용 카테고리 목록(`HealthTagType` 기반 또는 별도 상수) 중 하나
  - `Rating`: 0.0 ~ 5.0 범위
  - `PlayStoreUrl` / `AppStoreUrl`: URL 형식 (선택 필드)
- **삭제 시 연관 데이터**: EF Core Cascade Delete 설정으로 `HealthTag` 자동 삭제 (이미 설정되어 있을 가능성 높음 — 마이그레이션 확인 필요)
- **통계 집계**: `AdminStatsDto`는 전체 게임 수, AI 분석 완료 수, 미분석 수를 DB 집계 쿼리로 반환
- **관리자 인증**: 해커톤 범위에서 미구현. 엔드포인트는 Public 상태로 유지

### API 명세

```
GET /api/admin/stats
응답:
{
  "success": true,
  "data": {
    "totalGames": 31,
    "analyzedGames": 21,
    "unanalyzedGames": 10
  }
}

POST /api/admin/games
Request Body:
{
  "name": "게임명",
  "description": "설명",
  "category": "달리기",
  "rating": 4.2,
  "downloadCount": 50000,
  "iconUrl": "https://...",
  "playStoreUrl": "https://play.google.com/...",
  "appStoreUrl": "https://apps.apple.com/..."
}

PUT /api/admin/games/{id}
(POST와 동일한 body 구조)

DELETE /api/admin/games/{id}
응답: { "success": true, "data": null }
```

### 단위 테스트 목록

| 테스트명 | 검증 내용 |
|---------|---------|
| `게임_추가시_DB에_저장되고_반환된다` | CreateAsync 정상 동작 |
| `게임_수정시_기존_데이터가_업데이트된다` | UpdateAsync 정상 동작 |
| `게임_삭제시_DB에서_제거된다` | DeleteAsync 정상 동작 |
| `존재하지않는_게임_수정시_예외가_반환된다` | NotFound 처리 |
| `존재하지않는_게임_삭제시_예외가_반환된다` | NotFound 처리 |
| `통계_조회시_전체_분석완료_미분석_수가_반환된다` | stats 집계 정확성 |
| `게임명이_비어있으면_ValidationException이_반환된다` | FluentValidation 검증 |
| `평점이_5를_초과하면_ValidationException이_반환된다` | FluentValidation 범위 검증 |

---

## Task 4-2: 관리자 대시보드 - 프론트엔드

> 의존성: Task 4-1 (관리자 백엔드) 완료 후 진행.

### 신규 파일

| 파일 | 역할 |
|------|------|
| `app/admin/page.tsx` | 관리자 대시보드 페이지 — `/admin` 경로 |
| `components/admin/StatsCard.tsx` | 통계 요약 카드 컴포넌트 (전체/완료/미완료 수 표시) |
| `components/admin/GameTable.tsx` | 게임 목록 테이블 컴포넌트 (이름, 카테고리, 태깅 상태, 등록일, 액션 버튼) |
| `components/admin/GameFormModal.tsx` | 게임 추가/수정 공용 모달 컴포넌트 |
| `components/admin/DeleteConfirmDialog.tsx` | 게임 삭제 확인 다이얼로그 컴포넌트 |
| `components/admin/AiTagPanel.tsx` | 게임별 AI 태그 결과 확인 + "AI 재분석" 버튼 패널 |
| `components/admin/index.ts` | barrel export |
| `hooks/useAdmin.ts` | 관리자 API TanStack Query 훅 (stats, CRUD mutations) |

### 수정 파일

| 파일 | 변경 내용 |
|------|---------|
| `components/layout/Header.tsx` | "관리자" 또는 "/admin" 네비게이션 링크 추가 |
| `components/layout/index.ts` | barrel export 업데이트 (필요 시) |

### 핵심 설계 결정

- **모달 구현**: 별도 라이브러리 없이 Tailwind CSS + `useState` 조합. `fixed inset-0 bg-black/50` 오버레이, `z-50` 모달 패널
- **게임 추가 vs 수정 모달 공유**: `GameFormModal`에 `mode: 'create' | 'edit'` + `initialData?: AdminGameDto` prop. 단일 컴포넌트로 두 케이스 처리
- **AI 재분석 버튼**: 기존 `POST /api/admin/analyze/{id}` 엔드포인트 재활용. 클릭 시 로딩 스피너 표시 → 완료 시 테이블 자동 갱신 (TanStack Query invalidate)
- **데이터 수집 트리거**: 기존 `POST /api/admin/collect` 엔드포인트 재활용. 버튼 클릭 → 완료/실패 상태 표시
- **테이블 정렬**: 등록일 내림차순 기본 정렬 (서버에서 정렬)
- **낙관적 업데이트 지양**: 단순성을 위해 mutation 완료 후 쿼리 invalidate 방식 사용

### 컴포넌트 props 설계

```typescript
// StatsCard props
interface StatsCardProps {
  totalGames: number
  analyzedGames: number
  unanalyzedGames: number
}

// GameTable props
interface GameTableProps {
  games: AdminGameDto[]
  onEdit: (game: AdminGameDto) => void
  onDelete: (id: number) => void
  onAnalyze: (id: number) => void
}

// GameFormModal props
interface GameFormModalProps {
  mode: 'create' | 'edit'
  initialData?: AdminGameDto
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateGameRequest | UpdateGameRequest) => void
}

// DeleteConfirmDialog props
interface DeleteConfirmDialogProps {
  gameName: string
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

// AiTagPanel props
interface AiTagPanelProps {
  gameId: number
  tags: HealthTagDto[]
  onReanalyze: (id: number) => void
  isAnalyzing: boolean
}
```

### 관리자 페이지 레이아웃

```
/admin 페이지 구성:
┌─────────────────────────────────────┐
│ Header (관리자 링크 추가)             │
├─────────────────────────────────────┤
│ 통계 요약 (StatsCard x3)             │
│ [전체 게임: 31] [AI 완료: 21] [미분석: 10] │
├─────────────────────────────────────┤
│ [게임 추가 버튼]  [데이터 수집 버튼]   │
├─────────────────────────────────────┤
│ 게임 목록 테이블 (GameTable)          │
│ 이름 | 카테고리 | AI 태깅 | 등록일 | 액션 │
│ ...  | ...    | ✅/⬜   | ...   | 수정/삭제/태그 │
└─────────────────────────────────────┘
```

---

## Task 4-3: 성능 최적화 및 안정화

> 의존성: Task 4-1, 4-2 완료 후 진행. Phase 1~3 전체 코드베이스 대상.

### 수정 파일

| 파일 | 변경 내용 |
|------|---------|
| `app/layout.tsx` | 글로벌 에러 바운더리 적용 — `error.tsx` 파일 생성 또는 `ErrorBoundary` 컴포넌트 추가 |
| `app/error.tsx` | Next.js App Router 글로벌 에러 페이지 신규 생성 |
| `hooks/useGames.ts` 등 TanStack Query 훅 | `staleTime` 설정 (게임 목록: 5분, 상세: 10분) |
| `Infrastructure/Services/ClaudeApiService.cs` | HTTP 타임아웃 설정 (30초), 재시도 로직 개선 |
| 각 TODO/FIXME 위치 파일 | 기술 부채 항목 해결 |

### 최적화 항목

**TanStack Query staleTime 설정:**
```typescript
// 게임 목록 — 자주 변경되지 않으므로 5분 캐싱
useQuery({
  queryKey: ['games', filters],
  queryFn: fetchGames,
  staleTime: 5 * 60 * 1000,  // 5분
})

// 게임 상세 — AI 태그 재분석 후 invalidate 필요하므로 10분
useQuery({
  queryKey: ['games', id],
  queryFn: fetchGame,
  staleTime: 10 * 60 * 1000,  // 10분
})
```

**글로벌 에러 바운더리 (Next.js App Router):**
```typescript
// app/error.tsx — Next.js 자동으로 에러 바운더리로 사용
'use client'
export default function Error({ error, reset }) {
  // 에러 메시지 표시 + 재시도 버튼
}
```

**API 타임아웃 처리 (백엔드):**
```csharp
// ClaudeApiService.cs — HttpClient 타임아웃
_httpClient.Timeout = TimeSpan.FromSeconds(30);
```

**이미지 lazy loading 확인:**
- `next/image`의 기본 lazy loading 동작 검증
- 뷰포트 외부 이미지는 `loading="lazy"` 자동 적용 확인

**기술 부채 정리 대상:**
- Phase 1~3 TODO/FIXME 주석 항목 일괄 해결
- Claude API 프롬프트 구조화 개선 (신뢰도 일관성 향상)
- 불필요한 `Console.WriteLine` 제거 (Serilog로 대체)

---

## API 엔드포인트 전체 목록 (Sprint 4 기준)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/games` | 게임 목록 (카테고리 필터, 정렬, 페이지네이션) |
| GET | `/api/games/{id}` | 게임 상세 |
| GET | `/api/games/{id}/similar` | 유사 게임 추천 (Confidence 가중 유사도) |
| GET | `/api/games/search?q={keyword}` | 키워드 검색 (게임명, 태그, 카테고리) |
| GET | `/api/categories` | 카테고리 목록 |
| POST | `/api/recommend` | 건강 목표 기반 맞춤 추천 |
| GET | `/api/admin/stats` | **(신규)** 관리자 대시보드 통계 |
| POST | `/api/admin/games` | **(신규)** 게임 추가 |
| PUT | `/api/admin/games/{id}` | **(신규)** 게임 수정 |
| DELETE | `/api/admin/games/{id}` | **(신규)** 게임 삭제 |
| POST | `/api/admin/analyze/{gameId}` | 단일 게임 AI 분석 트리거 |
| POST | `/api/admin/analyze/all` | 미분석 게임 전체 일괄 AI 분석 |
| POST | `/api/admin/collect` | 게임 데이터 수집 (Mock or RapidAPI) |

---

## 의존성 및 작업 순서

```
Task 4-1: 관리자 백엔드 ─────────────┐
                                     ↓
Task 4-2: 관리자 프론트엔드 ←── Task 4-1 완료
                                     ↓
Task 4-3: 성능 최적화 + 안정화 ←── Task 4-1, 4-2 완료
```

- 4-1이 완료되어야 4-2를 진행할 수 있음
- 4-3은 4-1, 4-2 완료 후 전체 코드베이스 대상으로 진행
- 각 Task 내에서 **백엔드 테스트 먼저 작성 후 구현** (TDD 원칙)

---

## 테스트 현황 (Sprint 4 완료)

| 테스트 파일 | 테스트 수 | 상태 |
|------------|-----------|------|
| 기존 (Sprint 3 이월) | 29개 | ✅ |
| `AdminServiceTests.cs` | 8개 (신규) | ✅ |
| **합계** | **37개** | ✅ |

---

## 에지케이스 수정 이력 (2026-03-15)

코드베이스 전체 분석 후 16개 이슈 수정 완료:

| 심각도 | 수정 파일 | 내용 |
|--------|---------|------|
| Important | `GameService.cs` + `AdminController.cs` | AI 재분석 버튼이 기분석 게임 Skip → `forceReanalyze` 파라미터로 관리자는 강제 재분석 가능 |
| Important | `GameRepository.cs:DeleteAsync` | 레이스 컨디션 — 레포지토리도 `KeyNotFoundException` 발생하도록 보완 |
| Important | `types/index.ts` | `aiDescription: string` → `string \| null` 타입 수정 |
| Important | `lib/api.ts` | axios 타임아웃 10초 미설정 → 추가 |
| Important | `lib/api.ts:searchGames` | 클라이언트 사이드 가드 없음 → 2글자 미만 빈 배열 반환 + 100자 제한 |
| Important | `hooks/useAdmin.ts` | mutation `onError` 핸들러 없음 → 추가 + `retry: 0` |
| Important | `app/games/[id]/page.tsx` | `Number(params.id)` 불안정 → `parseInt(..., 10)` + 배열 대비 + `> 0` 가드 |
| Minor | `GameFormModal.tsx` | useEffect `initialData` 참조 비교 → `initialData?.id` 비교로 변경 |
| Minor | `GameFormModal.tsx` | `iconUrl` URL 형식 검증 없음 → `new URL()` 검증 추가 |
| Minor | `GameFormModal.tsx` | 서버 에러 메시지 미표시 → `errorMessage` prop 추가 |
| Minor | `GameTable.tsx` | `img onError` 무한 루프 위험 → `Set<number>` 상태로 방지 |
| Minor | `admin/page.tsx` | 데이터 수집 실패 메시지 없음 → `collectError` 표시 추가 |
| Minor | `lib/api.ts:collectGames` | POST body `null` → `{}` 변경 |
| Minor | `HealthGoalRecommendService.cs` | 입력값 길이 제한 없음 → 50자 초과 필터링 |
| Minor | `AdminController.cs:AnalyzeGame` | 오류 판정 복잡 → `string.IsNullOrEmpty(result.GameName)` 단순화 |
| Minor | `recommend/page.tsx` | 목표 미선택 피드백 없음 → 힌트 텍스트 추가 |

---

## 완료 기준 (Definition of Done)

- ✅ `dotnet build` — 경고 0, 오류 0
- ✅ `dotnet test` — 37개 단위 테스트 전체 통과 (기존 29 + 신규 8)
- ✅ `npm run build` — TypeScript 오류 없음
- ✅ 관리자가 `/admin` 페이지에서 게임을 추가/수정/삭제할 수 있다
- ✅ 관리자 대시보드에서 전체 게임 수, AI 분석 완료/미완료 수를 확인할 수 있다
- ✅ "AI 재분석" 버튼으로 개별 게임의 태그를 Claude API로 재생성할 수 있다
- ✅ "데이터 수집 시작" 버튼으로 데이터 수집을 수동 트리거할 수 있다
- ✅ FluentValidation으로 게임 추가/수정 시 필수 필드, 길이 제한, 평점 범위(0~5) 검증 동작
- ✅ 게임 삭제 시 연관 HealthTag가 CASCADE 삭제된다
- ✅ TanStack Query staleTime 설정으로 불필요한 API 재호출 감소
- ✅ 글로벌 에러 바운더리로 예상치 못한 런타임 오류가 사용자에게 적절히 표시된다
- ✅ Phase 1~3 TODO/FIXME 잔여 항목 부분 해결 (접근성 검토는 Backlog 이관)
- ✅ `docs/API.md` — 신규 관리자 엔드포인트 4개 명세 추가

---

## 수동 검증 필요 항목

> 자세한 내용은 [deploy.md](../../deploy.md) 참고

- ⬜ `/admin` 페이지 접속 → 통계 카드 3개(전체/완료/미완료) 표시 확인
- ⬜ "게임 추가" 모달 → 폼 입력 → 저장 → 게임 목록에 추가 확인
- ⬜ 게임 "수정" 버튼 → 기존 데이터 로드 → 수정 → 저장 → 변경 확인
- ⬜ 게임 "삭제" 버튼 → 확인 다이얼로그 → 삭제 → 목록에서 제거 확인
- ⬜ "AI 재분석" 버튼 → 로딩 스피너 → 태그 갱신 확인 (Claude API 키 설정 필요)
- ⬜ "데이터 수집 시작" 버튼 → 완료/실패 상태 표시 확인
- ⬜ 평점 범위 초과 입력(예: 6.0) → 유효성 검사 오류 메시지 표시 확인
- ⬜ `docker compose up --build` — Sprint 4 신규 코드 포함 전체 스택 재빌드 확인

---

## Playwright MCP 검증 시나리오

> `npm run dev` + 백엔드 서버 실행 후 검증

**관리자 대시보드 통계 검증:**
1. `browser_navigate` → `http://localhost:3000/admin` 접속
2. `browser_snapshot` → 통계 카드 3개(전체 게임 수, AI 완료, 미분석) 표시 확인
3. `browser_snapshot` → 게임 목록 테이블 존재 확인
4. `browser_network_requests` → `GET /api/admin/stats` 200 응답 확인

**게임 CRUD 검증:**
1. `browser_click` → "게임 추가" 버튼 클릭
2. `browser_snapshot` → 게임 추가 모달 표시 확인
3. `browser_type` → 게임명 "테스트 게임" 입력
4. `browser_type` → 설명 "테스트 설명" 입력
5. `browser_click` → 카테고리 선택
6. `browser_click` → "저장" 버튼 클릭
7. `browser_wait_for` → 저장 완료 대기
8. `browser_snapshot` → 테이블에 "테스트 게임" 행 추가 확인
9. `browser_network_requests` → `POST /api/admin/games` 200 응답 확인
10. `browser_click` → "테스트 게임" 행의 "수정" 버튼 클릭
11. `browser_snapshot` → 수정 모달에 기존 데이터 로드 확인
12. `browser_click` → "취소" 버튼 클릭 (모달 닫힘 확인)
13. `browser_click` → "테스트 게임" 행의 "삭제" 버튼 클릭
14. `browser_snapshot` → 삭제 확인 다이얼로그 표시 확인
15. `browser_click` → 다이얼로그 "확인" 버튼 클릭
16. `browser_snapshot` → 테이블에서 "테스트 게임" 행 제거 확인
17. `browser_network_requests` → `DELETE /api/admin/games/{id}` 200 응답 확인

**AI 재분석 및 데이터 수집 검증:**
1. `browser_click` → 게임 행의 "AI 재분석" 버튼 클릭
2. `browser_snapshot` → 로딩 상태 표시 확인
3. `browser_wait_for` → 재분석 완료 대기
4. `browser_network_requests` → `POST /api/admin/analyze/{id}` 200 응답 확인
5. `browser_click` → "데이터 수집 시작" 버튼 클릭
6. `browser_wait_for` → 수집 완료 대기
7. `browser_snapshot` → 완료/실패 상태 메시지 표시 확인
8. `browser_network_requests` → `POST /api/admin/collect` 200 응답 확인

**공통 검증:**
- `browser_console_messages(level: "error")` → 콘솔 에러 없음
- `browser_network_requests` → 모든 관리자 API 호출 2xx 응답

---

## 검증 결과

- [Sprint 4 자동 검증 보고서](sprint4/validation-report.md)

---

## 기술 부채 및 이월 항목

| 항목 | 이유 | 처리 |
|------|------|------|
| 관리자 인증 (JWT) | 해커톤 범위 초과 | Backlog B-03 — JWT 기반 로그인/회원가입 |
| 추천 이유 텍스트 영구 캐싱 | DB 캐시 테이블 추가 필요 | Backlog — 동일 목표 조합 반복 요청 시 비용 발생 |
| RapidAPI 실제 연동 | API 키 필요 | Backlog — Mock Fallback 유지 |
| 검색 성능 최적화 | 게임 수 1,000개 이상 시 한계 | Backlog B-07 (Elasticsearch/Meilisearch) |
| 접근성(a11y) 검토 | 키보드 네비게이션, aria 라벨 | Backlog — 서비스 확장 시 처리 |
