# Sprint 3: 맞춤 추천 + 검색 기능

> **작업일:** 2026-03-15 | **상태:** ✅ 완료 | **브랜치:** sprint3

---

## 스프린트 목표

| 목표 | 설명 | 상태 |
|------|------|------|
| 맞춤 추천 백엔드 | `POST /api/recommend` 엔드포인트, HealthTag 기반 필터링 + Claude AI 추천 이유 생성 | ✅ |
| 맞춤 추천 프론트엔드 | `/recommend` 페이지, 건강 목표 카드 선택 UI + 추천 결과 표시 | ✅ |
| 검색 백엔드 | `GET /api/games/search?q={keyword}`, EF Core Contains 검색 + 매칭 필드 정보 반환 | ✅ |
| 검색 프론트엔드 | `/search?q={keyword}` 페이지, 하이라이팅 + 빈 상태 UI + debounce 300ms | ✅ |
| 단위 테스트 | 추천 서비스 + 검색 서비스 xUnit 테스트 추가 | ✅ |

---

## 컨텍스트

Sprint 2(2026-03-15 완료)에서 Claude API 연동, 데이터 수집 파이프라인, 유사 게임 추천, 프론트엔드 AI UI가 완성된 상태.
이번 스프린트는 Must Have(FR-01~11) 외에 Should Have인 FR-12~16을 구현한다.
기존에 `IGameRecommendationService`, `IClaudeApiService`, `HealthTagType` 상수(5개 태그)가 이미 정의되어 있어 확장 포인트가 명확하다.

**Sprint 2 완료 기준선:**
- 백엔드 테스트: 17개 통과 (xUnit + Moq)
- 프론트엔드 빌드: TypeScript 오류 없음
- 기존 서비스: `GameService`, `ClaudeApiService`, `GameRecommendationService`, `GameDataCollectorService`
- 기존 인터페이스: `IClaudeApiService`, `IGameRecommendationService`, `IGameDataCollectorService`
- HealthTag 타입: `#심폐기능`, `#근력강화`, `#스트레스해소`, `#인지개선`, `#반응훈련`

---

## Task 3-1: 검색 기능 - 백엔드

> 의존성 없음. 가장 먼저 구현하여 프론트엔드 작업의 기반을 마련한다.

### 신규 파일

| 파일 | 역할 |
|------|------|
| `Application/DTOs/SearchDto.cs` | `SearchResultDto`, `SearchRequest` 레코드 — 검색 결과 + 매칭 필드 정보 포함 |
| `Application/Interfaces/IGameSearchService.cs` | 검색 서비스 인터페이스 |
| `Application/Services/GameSearchService.cs` | EF Core Contains 기반 다중 필드 검색 구현 |
| `Tests/Services/GameSearchServiceTests.cs` | 검색 서비스 단위 테스트 (한글, 태그, 빈 결과 등) |

### 수정 파일

| 파일 | 변경 내용 |
|------|---------|
| `Api/Controllers/GamesController.cs` | `GET /api/games/search` 엔드포인트 추가 — `IGameSearchService` 주입 |
| `Application/Interfaces/IGameService.cs` | (필요 시) 검색 관련 메서드 추가 |
| `Infrastructure/DependencyInjection.cs` 또는 `Program.cs` | `GameSearchService` DI 등록 |
| `docs/API.md` | 검색 엔드포인트 명세 추가 |

### 핵심 설계 결정

- **검색 범위**: 게임명(`Name`), 건강 효과 태그(`HealthTags[].Tag`), 카테고리(`Category`)
- **검색 방식**: EF Core `Contains` — 소규모 데이터(수십~수백 개)에서 충분. 전문 검색 엔진 불필요 (Karpathy: 과도한 최적화 금지)
- **매칭 필드 정보**: 응답에 `matchedFields: ["name", "tag", "category"]` 포함하여 프론트엔드 하이라이팅 지원
- **빈 쿼리 처리**: `q`가 비어 있거나 1글자 이하면 빈 배열 반환 (400 대신 빈 결과)

### API 명세

```
GET /api/games/search?q={keyword}

응답 예시:
{
  "success": true,
  "data": [
    {
      "game": { ...GameDto },
      "matchedFields": ["name", "tag"],
      "matchedKeyword": "달리기"
    }
  ]
}
```

### 단위 테스트 목록

| 테스트명 | 검증 내용 |
|---------|---------|
| `게임명으로_검색하면_매칭된_게임이_반환된다` | Name 필드 Contains 검색 동작 |
| `태그명으로_검색하면_매칭된_게임이_반환된다` | HealthTag.Tag 필드 Contains 검색 동작 |
| `카테고리로_검색하면_매칭된_게임이_반환된다` | Category 필드 Contains 검색 동작 |
| `존재하지않는_키워드로_검색하면_빈_배열이_반환된다` | 빈 결과 처리 |
| `빈_키워드로_검색하면_빈_배열이_반환된다` | 1글자 이하 입력 처리 |
| `검색결과에_매칭필드_정보가_포함된다` | matchedFields 정확성 검증 |

---

## Task 3-2: 맞춤 추천 기능 - 백엔드

> 의존성: `IClaudeApiService` (Task 2-1에서 구현 완료). 검색 백엔드와 병렬 진행 가능.

### 신규 파일

| 파일 | 역할 |
|------|------|
| `Application/DTOs/RecommendDto.cs` | `RecommendRequest`, `RecommendResultDto`, `RecommendResponse` 레코드 |
| `Application/Interfaces/IHealthGoalRecommendService.cs` | 맞춤 추천 서비스 인터페이스 |
| `Application/Services/HealthGoalRecommendService.cs` | HealthTag 기반 필터링 + Claude AI 추천 이유 생성 |
| `Api/Controllers/RecommendController.cs` | `POST /api/recommend` 엔드포인트 |
| `Tests/Services/HealthGoalRecommendServiceTests.cs` | 추천 서비스 단위 테스트 |

### 수정 파일

| 파일 | 변경 내용 |
|------|---------|
| `Program.cs` | `HealthGoalRecommendService` DI 등록 |
| `docs/API.md` | 추천 엔드포인트 명세 추가 |

### 핵심 설계 결정

- **필터링 로직**: 요청된 `healthGoals`가 `HealthTagType` 상수와 매핑 → 해당 태그를 보유한 게임 조회. 복수 목표는 OR 조건 (더 많은 추천 결과 확보)
- **AI 추천 이유**: `IClaudeApiService`를 재활용하여 "선택한 목표 + 게임 정보"를 입력으로 추천 이유 텍스트 생성
- **캐싱 전략**: 동일한 `healthGoals` 조합(정렬된 문자열 key)에 대해 DB에 추천 이유 텍스트 저장. `RecommendationCache` 엔티티 추가 또는 메모리 캐시 사용
- **Graceful degradation**: Claude API 실패 시 기본 추천 이유 텍스트 반환 ("선택하신 건강 목표와 관련된 게임입니다")
- **목표 유효성 검사**: `HealthTagType` 상수에 없는 값 요청 시 무시하고 유효한 목표만 처리

### API 명세

```
POST /api/recommend

Request:
{
  "healthGoals": ["심폐기능", "스트레스해소"]
}

Response:
{
  "success": true,
  "data": {
    "selectedGoals": ["심폐기능", "스트레스해소"],
    "games": [
      {
        "game": { ...GameDto },
        "matchScore": 0.85,
        "recommendReason": "이 게임은 달리기 동작으로 심폐 기능을 강화하며..."
      }
    ]
  }
}
```

### 단위 테스트 목록

| 테스트명 | 검증 내용 |
|---------|---------|
| `단일_목표로_추천하면_해당_태그_게임이_반환된다` | 단일 healthGoal 필터링 |
| `복수_목표로_추천하면_OR_조건으로_게임이_반환된다` | 복수 healthGoal 합집합 결과 |
| `매칭_게임이_없으면_빈_배열이_반환된다` | 빈 결과 처리 |
| `유효하지않은_목표는_무시된다` | HealthTagType에 없는 값 필터링 |
| `Claude_API_실패시_기본_추천이유가_반환된다` | Graceful degradation |
| `매칭점수가_높은순으로_정렬된다` | matchScore 내림차순 정렬 |

---

## Task 3-3: 검색 기능 - 프론트엔드

> 의존성: Task 3-1 (검색 백엔드) 완료 후 진행.

### 신규 파일

| 파일 | 역할 |
|------|------|
| `app/search/page.tsx` | 검색 결과 페이지 — `/search?q={keyword}` 경로 |
| `components/game/SearchResultCard.tsx` | 하이라이팅이 적용된 검색 결과 카드 컴포넌트 |
| `hooks/useSearch.ts` | 검색 TanStack Query 훅 — debounce 300ms 포함 |

### 수정 파일

| 파일 | 변경 내용 |
|------|---------|
| `components/layout/Header.tsx` | 검색 입력에서 `/search?q=` 라우팅 연동, debounce 300ms 적용 |
| `components/game/index.ts` | `SearchResultCard` barrel export 추가 |

### 핵심 설계 결정

- **라우팅**: Header의 검색 입력 엔터/제출 시 `/search?q={keyword}` 페이지로 이동. `useSearchParams`로 `q` 파라미터 읽기
- **debounce**: `useSearch` 훅 내부에서 300ms debounce 적용. 2글자 미만이면 API 호출하지 않음
- **하이라이팅**: `SearchResultCard`에서 `matchedKeyword`를 게임명/카테고리에서 찾아 `<mark>` 태그로 감싸 색상 강조 처리. Tailwind `bg-yellow-200 text-yellow-900` 사용
- **빈 상태 UI**: "검색 결과가 없습니다" + "다른 키워드로 검색해보세요" 안내 문구
- **로딩 상태**: 기존 `GameCardSkeleton` 재사용

### 컴포넌트 props 설계

```typescript
// SearchResultCard props
interface SearchResultCardProps {
  game: GameDto
  matchedFields: string[]
  matchedKeyword: string
}

// useSearch 훅 반환값
interface UseSearchReturn {
  results: SearchResultDto[]
  isLoading: boolean
  isError: boolean
  query: string
}
```

---

## Task 3-4: 맞춤 추천 기능 - 프론트엔드

> 의존성: Task 3-2 (추천 백엔드) 완료 후 진행.

### 신규 파일

| 파일 | 역할 |
|------|------|
| `app/recommend/page.tsx` | 맞춤 추천 페이지 — `/recommend` 경로 |
| `components/recommend/GoalCard.tsx` | 건강 목표 선택 카드 컴포넌트 (선택/비선택 상태) |
| `components/recommend/RecommendResultCard.tsx` | 추천 결과 카드 — 매칭 점수 + 추천 이유 텍스트 포함 |
| `components/recommend/index.ts` | barrel export |
| `hooks/useRecommend.ts` | 추천 API TanStack Query mutation 훅 |

### 수정 파일

| 파일 | 변경 내용 |
|------|---------|
| `components/layout/Header.tsx` | "맞춤 추천" 네비게이션 링크 추가 |

### 건강 목표 카드 목록

| 목표 | 태그 | 아이콘/색상 |
|------|------|---------|
| 심폐기능 향상 | `심폐기능` | 빨간색 계열 |
| 근력 강화 | `근력강화` | 주황색 계열 |
| 스트레스 해소 | `스트레스해소` | 초록색 계열 |
| 인지능력 개선 | `인지개선` | 파란색 계열 |
| 반응속도 훈련 | `반응훈련` | 보라색 계열 |

### 핵심 설계 결정

- **상태 관리**: 선택된 목표 목록은 `useState`로 관리 (서버 상태 아님, Zustand 불필요)
- **복수 선택**: 목표 카드 클릭 시 토글 방식. 선택된 카드는 테두리/배경 강조
- **"추천받기" 버튼**: 1개 이상 선택 시에만 활성화
- **추천 결과**: 버튼 클릭 → `useRecommend` mutation 실행 → 결과를 같은 페이지 하단에 표시
- **로딩 중**: "AI가 추천 이유를 생성하고 있습니다..." 스피너 표시
- **빈 결과**: "선택하신 목표에 맞는 게임을 찾지 못했습니다" 안내

### 컴포넌트 props 설계

```typescript
// GoalCard props
interface GoalCardProps {
  goalLabel: string      // 표시 레이블 (예: "심폐기능 향상")
  goalValue: string      // API 요청값 (예: "심폐기능")
  isSelected: boolean
  onClick: (value: string) => void
}

// RecommendResultCard props
interface RecommendResultCardProps {
  game: GameDto
  matchScore: number
  recommendReason: string
}
```

---

## API 엔드포인트 전체 목록 (Sprint 3 기준)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/games` | 게임 목록 (카테고리 필터, 정렬, 페이지네이션) |
| GET | `/api/games/{id}` | 게임 상세 |
| GET | `/api/games/{id}/similar` | 유사 게임 추천 (Confidence 가중 유사도) |
| GET | `/api/games/search?q={keyword}` | **(신규)** 키워드 검색 (게임명, 태그, 카테고리) |
| GET | `/api/categories` | 카테고리 목록 |
| POST | `/api/recommend` | **(신규)** 건강 목표 기반 맞춤 추천 |
| POST | `/api/admin/analyze/{gameId}` | 단일 게임 AI 분석 트리거 |
| POST | `/api/admin/analyze/all` | 미분석 게임 전체 일괄 AI 분석 |
| POST | `/api/admin/collect` | 게임 데이터 수집 (Mock or RapidAPI) |

---

## 의존성 및 작업 순서

```
Task 3-1: 검색 백엔드 ──────────────┐
Task 3-2: 추천 백엔드 ──────────────┤
                                    ↓
Task 3-3: 검색 프론트엔드 ←── Task 3-1 완료
Task 3-4: 추천 프론트엔드 ←── Task 3-2 완료
```

- 3-1과 3-2는 독립적이므로 병렬 진행 가능
- 3-3은 3-1 완료 후, 3-4는 3-2 완료 후 진행
- 각 Task 내에서 **백엔드 테스트 먼저 작성 후 구현** (TDD 원칙)

---

## 테스트 현황 (Sprint 3 목표)

| 테스트 파일 | 테스트 수 | 상태 |
|------------|-----------|------|
| 기존 (Sprint 2 이월) | 17개 | ✅ |
| `GameSearchServiceTests.cs` | 6개 (신규) | ⬜ |
| `HealthGoalRecommendServiceTests.cs` | 6개 (신규) | ⬜ |
| **합계 목표** | **29개** | ⬜ |

---

## 완료 기준 (Definition of Done)

- ✅ `dotnet build` — 경고 0, 오류 0
- ✅ `dotnet test` — 29개 이상 단위 테스트 전체 통과 (기존 17 + 신규 12)
- ✅ `npm run build` — TypeScript 오류 없음
- ✅ 건강 목표 선택 후 "추천받기" 클릭 시 맞춤 게임 추천 목록이 표시된다
- ✅ 각 추천 게임에 Claude AI가 생성한 추천 이유 텍스트가 표시된다
- ✅ Claude API 실패 시 기본 추천 이유 텍스트로 Graceful degradation 동작
- ✅ Header 검색 입력에서 엔터 시 `/search?q=` 페이지로 이동한다
- ✅ 검색 결과에서 매칭 키워드가 하이라이팅(노란 배경)된다
- ✅ 검색 결과 없음 상태("검색 결과가 없습니다")가 올바르게 표시된다
- ✅ 검색 입력에 debounce 300ms, 최소 2글자 제한이 적용된다
- ✅ `docs/API.md` — 신규 엔드포인트 2개 명세 추가

## 검증 결과

- [Sprint 3 자동 검증 보고서](sprint3/validation-report.md)

---

## 수동 검증 필요 항목

> 자세한 내용은 [deploy.md](../../deploy.md) 참고

- ⬜ `/recommend` 페이지에서 목표 카드 복수 선택 후 추천받기 → AI 추천 이유 텍스트 실제 확인
- ⬜ Claude API 키 미설정 상태에서 추천 요청 시 기본 텍스트 반환 확인
- ⬜ Header 검색 입력 → 검색 결과 페이지 이동 → 하이라이팅 시각 확인
- ⬜ 존재하지 않는 키워드 검색 → "검색 결과가 없습니다" 표시 확인
- ⬜ `docker compose up --build` — Sprint 3 신규 코드 포함 전체 스택 재빌드 확인

---

## Playwright MCP 검증 시나리오

> `npm run dev` + 백엔드 서버 실행 후 검증

**맞춤 추천 검증:**
1. `browser_navigate` → `http://localhost:3000/recommend` 접속
2. `browser_snapshot` → 건강 목표 카드 5개(심폐기능, 근력강화, 스트레스해소, 인지개선, 반응훈련)가 표시되는지 확인
3. `browser_click` → "심폐기능 향상" 목표 카드 클릭
4. `browser_click` → "스트레스 해소" 목표 카드 클릭
5. `browser_snapshot` → 두 카드가 선택 상태(테두리/배경 강조)인지 확인
6. `browser_click` → "추천받기" 버튼 클릭
7. `browser_wait_for` → 추천 결과 로딩 대기
8. `browser_snapshot` → 추천 게임 카드 + 추천 이유 텍스트 존재 확인
9. `browser_network_requests` → `POST /api/recommend` 200 응답 확인
10. `browser_console_messages(level: "error")` → 에러 없음

**검색 기능 검증:**
1. `browser_navigate` → `http://localhost:3000` 접속
2. `browser_click` → Header 검색 입력 필드 클릭
3. `browser_type` → "달리기" 입력 후 엔터
4. `browser_wait_for` → `/search?q=달리기` 페이지 로딩 대기
5. `browser_snapshot` → 검색 결과 카드 표시 + "달리기" 키워드 하이라이팅(노란 배경) 확인
6. `browser_network_requests` → `GET /api/games/search?q=달리기` 200 응답 확인
7. `browser_navigate` → `http://localhost:3000/search?q=존재하지않는게임xyz` 접속
8. `browser_snapshot` → "검색 결과가 없습니다" 메시지 확인
9. `browser_console_messages(level: "error")` → 에러 없음

**공통 검증:**
- `browser_network_requests` → `/api/recommend`, `/api/games/search` 모든 API 호출 2xx 응답
- `browser_console_messages(level: "error")` → 콘솔 에러 없음

---

## 기술 부채 및 이월 항목

| 항목 | 이유 | 처리 |
|------|------|------|
| 추천 이유 텍스트 영구 캐싱 | 동일 목표 조합 반복 요청 시 API 비용 발생 가능 | Phase 4 또는 Backlog — DB 캐시 테이블 추가 검토 |
| 검색 성능 최적화 | 게임 수 1,000개 이상 시 EF Core Contains 한계 | Backlog B-07 (Elasticsearch/Meilisearch) |
| Admin API 인증 | 현재 인증 없이 호출 가능 | Phase 4에서 처리 예정 |
| RapidAPI 실제 연동 | API 키 필요, 해커톤 시간 제약 | Backlog — Mock Fallback으로 대체 유지 |
