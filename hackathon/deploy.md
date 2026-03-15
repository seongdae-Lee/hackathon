# 배포 및 검증 가이드 - Sprint 4

> **Sprint 4 작업일:** 2026-03-15
> **브랜치:** sprint4

---

## Sprint 4 신규 기능

- 관리자 백엔드 — `GET /api/admin/stats`, `POST/PUT/DELETE /api/admin/games` CRUD API + FluentValidation
- 관리자 프론트엔드 — `/admin` 페이지 (통계 카드, 게임 목록 테이블, 추가/수정/삭제 모달, AI 재분석 버튼, 데이터 수집 트리거)
- 성능 최적화 — TanStack Query staleTime (게임 목록 5분, 상세 10분)
- 에러 처리 강화 — 글로벌 에러 바운더리 (`app/error.tsx`), Claude API HTTP 타임아웃 30초
- 신규 단위 테스트 8개 추가 (총 37개)

---

## Sprint 4 에지케이스 수정 이력 (2026-03-15)

코드베이스 전체 에지케이스 분석 후 다음 항목 수정 완료:

| # | 파일 | 이슈 | 수정 내용 |
|---|------|------|---------|
| 1 | `GameService.cs` | AI 재분석 버튼이 이미 분석된 게임을 Skip | `forceReanalyze` 파라미터 추가; 관리자 컨트롤러에서 `true` 전달 |
| 2 | `GameRepository.cs` | `DeleteAsync` 레이스 컨디션 | 레포지토리에서도 명시적 `KeyNotFoundException` 발생 |
| 3 | `HealthGoalRecommendService.cs` | 입력값 길이 제한 없음 | 50자 초과 목표값 필터링 추가 |
| 4 | `AdminController.cs` | AnalyzeGame 오류 판정 불명확 | `string.IsNullOrEmpty(result.GameName)` 조건으로 단순화 |
| 5 | `types/index.ts` | `aiDescription: string` 타입 불일치 | `string \| null`로 수정 |
| 6 | `lib/api.ts` | axios 타임아웃 미설정 | 10초 타임아웃 추가 |
| 7 | `lib/api.ts` | `searchGames` 클라이언트 가드 없음 | 2글자 미만 빈 배열 반환 + 100자 제한 |
| 8 | `lib/api.ts` | `collectGames` POST body `null` | `{}` 빈 객체로 변경 |
| 9 | `hooks/useAdmin.ts` | mutation `onError` 핸들러 없음 | 에러 로깅 + `retry: 0` 추가 |
| 10 | `app/games/[id]/page.tsx` | `Number(params.id)` 파싱 불안정 | `parseInt(rawId, 10)` + 배열 처리 + `isValidId > 0` 가드 |
| 11 | `GameFormModal.tsx` | useEffect 의존성 객체 참조 비교 | `initialData?.id` 사용으로 변경 |
| 12 | `GameFormModal.tsx` | `iconUrl` URL 형식 검증 없음 | `new URL()` 시도로 유효성 검증 추가 |
| 13 | `GameFormModal.tsx` | 서버 에러 메시지 미표시 | `errorMessage` prop 추가 |
| 14 | `GameTable.tsx` | `img onError` 무한 루프 위험 | `Set<number>` 상태로 실패 이미지 추적 |
| 15 | `admin/page.tsx` | 데이터 수집 실패 시 에러 메시지 없음 | `collectError` 상태 + UI 표시 추가 |
| 16 | `recommend/page.tsx` | 목표 미선택 시 사용자 피드백 없음 | 힌트 텍스트 추가 |

---

## Sprint 4 자동 검증 완료 항목

- ✅ `dotnet build` — 경고 0, 오류 0
- ✅ `dotnet test` — 37개 단위 테스트 모두 통과 (에지케이스 수정 후 재확인)
  - GameServiceTests (8개)
  - ClaudeApiServiceTests (3개)
  - GameRecommendationServiceTests (4개)
  - GameDataCollectorServiceTests (2개)
  - GameSearchServiceTests (6개)
  - HealthGoalRecommendServiceTests (6개)
  - AdminServiceTests (8개: 신규)
- ✅ `npm run build` — TypeScript 오류 없음, 빌드 성공 (/, /admin, /recommend, /search, /games/[id] 포함)

---

## Sprint 4 수동 검증 필요 항목

### 관리자 대시보드 UI 검증

```bash
# 백엔드 실행
cd backend
dotnet run --project src/HealthGameCurator.Api --urls "http://localhost:5000"

# 프론트엔드 실행 (별도 터미널)
cd frontend
npm run dev

# 관리자 API 직접 테스트
curl http://localhost:5000/api/admin/stats

# 게임 추가 테스트
curl -X POST http://localhost:5000/api/admin/games \
  -H "Content-Type: application/json" \
  -d '{"name":"테스트 게임","description":"테스트 설명","category":"달리기","rating":4.0,"downloadCount":10000}'

# 게임 수정 테스트 (ID는 실제 생성된 게임 ID로 변경)
curl -X PUT http://localhost:5000/api/admin/games/{id} \
  -H "Content-Type: application/json" \
  -d '{"name":"수정된 게임","description":"수정된 설명","category":"달리기","rating":4.5,"downloadCount":20000}'

# 게임 삭제 테스트
curl -X DELETE http://localhost:5000/api/admin/games/{id}
```

- ⬜ `/admin` 페이지 접속 → 통계 카드 3개(전체/AI완료/미분석) 표시 확인
- ⬜ "게임 추가" 모달 → 폼 입력 → 저장 → 게임 목록에 추가 확인
- ⬜ 게임 "수정" 버튼 → 기존 데이터 로드 → 수정 → 저장 → 변경 확인
- ⬜ 게임 "삭제" 버튼 → 확인 다이얼로그 → 삭제 → 목록에서 제거 확인
- ⬜ "AI 재분석" 버튼 → 로딩 상태 → 태그 갱신 확인 (Claude API 키 설정 필요)
- ⬜ "데이터 수집 시작" 버튼 → 완료/실패 상태 표시 확인
- ⬜ 평점 범위 초과 입력 (예: 6.0) → 유효성 검사 오류 메시지 표시 확인

### Docker 환경 재빌드 (Sprint 4 코드 반영)

```bash
# .env 파일 생성 (없는 경우)
echo "CLAUDE_API_KEY=your_api_key_here" > .env

# Sprint 4 신규 코드 포함 전체 스택 재빌드
docker compose up --build
```

- ⬜ `docker compose up --build` — Sprint 4 신규 코드 포함 전체 스택 빌드 성공 확인
- ⬜ `http://localhost:3000/admin` 접속 확인
- ⬜ `http://localhost:5000/swagger` — `/api/admin/stats`, `/api/admin/games` 엔드포인트 표시 확인

---

## 검증 보고서

- [Sprint 4 자동 검증 보고서](docs/sprint/sprint4/validation-report.md)

---

## Sprint 3 기록 (2026-03-15, 브랜치: sprint3)

---

# 배포 및 검증 가이드 - Sprint 3

> **Sprint 3 작업일:** 2026-03-15
> **브랜치:** sprint3

---

## Sprint 3 신규 기능

- 맞춤 추천 백엔드 - `POST /api/recommend` (HealthTag 기반 필터링 + Claude AI 추천 이유 생성)
- 맞춤 추천 프론트엔드 - `/recommend` 페이지 (건강 목표 카드 선택 + 추천 결과)
- 검색 백엔드 - `GET /api/games/search?q={keyword}` (EF Core Contains 다중 필드 검색)
- 검색 프론트엔드 - `/search?q={keyword}` 페이지 (하이라이팅 + 빈 상태 UI + debounce 300ms)
- 신규 단위 테스트 12개 추가 (총 29개)

---

## Sprint 3 자동 검증 완료 항목

- ✅ `dotnet build` - 경고 0, 오류 0
- ✅ `dotnet test` - 29개 단위 테스트 모두 통과
  - GameServiceTests (8개)
  - ClaudeApiServiceTests (3개)
  - GameRecommendationServiceTests (4개)
  - GameDataCollectorServiceTests (2개)
  - GameSearchServiceTests (6개: 신규)
  - HealthGoalRecommendServiceTests (6개: 신규)
- ✅ `npm run build` - TypeScript 오류 없음, 빌드 성공 (/, /recommend, /search, /games/[id] 6개 페이지)

---

## Sprint 3 수동 검증 필요 항목

### Claude API 키 설정 및 AI 분석 검증

```bash
# appsettings.json에 API 키 설정 후
# 1. 백엔드 실행
cd backend
dotnet run --project src/HealthGameCurator.Api --urls "http://localhost:5000"

# 2. 단일 게임 AI 분석 트리거
curl -X POST http://localhost:5000/api/admin/analyze/1

# 3. 전체 게임 일괄 분석
curl -X POST http://localhost:5000/api/admin/analyze/all

# 4. Mock 게임 데이터 수집
curl -X POST "http://localhost:5000/api/admin/collect?maxCount=5"
```

- ⬜ Admin API: `POST /api/admin/analyze/{id}` - AI 분석 트리거 → DB에 `isAiAnalyzed=true` 확인
- ⬜ Admin API: `POST /api/admin/analyze/all` - 전체 일괄 분석 완료 확인
- ⬜ Admin API: `POST /api/admin/collect` - Mock 게임 수집 → 신규 게임 DB 저장 확인

### Sprint 3 신규 기능 수동 검증

```bash
# 백엔드 실행 후 검증
cd backend
dotnet run --project src/HealthGameCurator.Api --urls "http://localhost:5000"

# 검색 API 테스트
curl "http://localhost:5000/api/games/search?q=달리기"

# 맞춤 추천 API 테스트
curl -X POST http://localhost:5000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"healthGoals": ["심폐기능", "스트레스해소"]}'
```

- ⬜ `/recommend` 페이지 - 건강 목표 카드 5개 표시 확인 (심폐기능, 근력강화, 스트레스해소, 인지개선, 반응훈련)
- ⬜ `/recommend` 페이지 - 목표 카드 복수 선택 후 "추천받기" 클릭 → AI 추천 이유 텍스트 확인
- ⬜ Claude API 키 미설정 상태에서 추천 요청 시 기본 텍스트 반환 확인
- ⬜ Header 검색 입력 → 엔터 시 `/search?q=` 페이지 이동 확인
- ⬜ `/search?q=달리기` 페이지 - 검색 결과 카드 표시 + "달리기" 키워드 하이라이팅(노란 배경) 확인
- ⬜ `/search?q=존재하지않는게임xyz` 페이지 - "검색 결과가 없습니다" 메시지 확인

### Docker 환경 재빌드 (Sprint 3 코드 반영)

```bash
# .env 파일 생성 (없는 경우)
echo "CLAUDE_API_KEY=your_api_key_here" > .env

# Sprint 3 신규 코드 포함 전체 스택 재빌드
docker compose up --build
```

- ⬜ `docker compose up --build` - Sprint 3 신규 코드 포함 전체 스택 빌드 성공 확인
- ⬜ `http://localhost:3000/recommend` 접속 확인
- ⬜ `http://localhost:3000/search?q=달리기` 접속 확인
- ⬜ `http://localhost:5000/swagger` - `/api/recommend`, `/api/games/search` 엔드포인트 표시 확인

### Sprint 2 이월 수동 검증 항목

- ⬜ Admin API: `POST /api/admin/analyze/{id}` - AI 분석 트리거 → DB에 `isAiAnalyzed=true` 확인
- ⬜ Admin API: `POST /api/admin/analyze/all` - 전체 일괄 분석 완료 확인
- ⬜ Admin API: `POST /api/admin/collect` - Mock 게임 수집 → 신규 게임 DB 저장 확인
- ⬜ 상세 페이지 - AI 분석 배지(`✨ AI 분석` / `📋 수동 태그`) 표시 확인
- ⬜ 상세 페이지 - AI 분석 근거 펼침/접기 정상 동작 확인

---

## Sprint 2 기록 (2026-03-15, 브랜치: sprint2)

---

## Sprint 1 기록 (2026-03-14, 브랜치: sprint1)

---

## 개발 환경 시작 방법

### 사전 요구사항

- .NET 9 SDK (또는 .NET 8+)
- Node.js 18+
- npm 또는 yarn

### 백엔드 실행

```bash
cd backend
dotnet run --project src/HealthGameCurator.Api --urls "http://localhost:5000"
```

- 첫 실행 시 EF Core 마이그레이션 및 시드 데이터(21개 게임)가 자동 적용됩니다.
- SQLite DB 파일: `backend/src/HealthGameCurator.Api/healthgamecurator.db`
- Swagger UI: `http://localhost:5000/swagger`

### 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

- 접속 URL: `http://localhost:3000`
- 백엔드가 `http://localhost:5000`에서 실행 중이어야 합니다.

---

## 자동 검증 완료 항목

아래 항목은 sprint-close 시점에 자동으로 실행하여 검증 완료된 항목입니다.

- ✅ `dotnet build` - 경고 0, 오류 0
- ✅ `dotnet test` - 6개 단위 테스트 모두 통과 (GameService 테스트)
- ✅ `npm run build` - TypeScript 오류 없음, 빌드 성공
- ✅ `GET /api/games` - 21개 게임 데이터 정상 반환 확인
- ✅ `GET /api/games/{id}` - 게임 상세 데이터 정상 반환 확인
- ✅ `GET /api/games/{id}/similar` - 유사 게임 추천 API 정상 반환 확인
- ✅ `GET /api/categories` - 카테고리 목록 정상 반환 확인

---

## 수동 검증 필요 항목

아래 항목은 사용자가 직접 브라우저에서 확인해야 합니다.

### UI 기능 검증

- ⬜ `http://localhost:3000` 접속 - 게임 홈 페이지 렌더링 확인
- ⬜ 게임 카드 그리드 레이아웃 표시 확인 (21개 게임)
- ⬜ 카테고리 필터 클릭 - 해당 카테고리 게임만 필터링 확인
- ⬜ 정렬 드롭다운 변경 - 인기순/평점순/최신순 정렬 확인
- ⬜ 게임 카드 클릭 - `/games/[id]` 상세 페이지 이동 확인
- ⬜ 상세 페이지 - 게임명, 설명, 평점, 다운로드 수 표시 확인
- ⬜ 상세 페이지 - 건강 효과 태그 배지 표시 확인
- ⬜ 상세 페이지 - Google Play / App Store 스토어 링크 버튼 확인
- ⬜ 상세 페이지 - 유사 게임 추천 섹션 표시 확인
- ⬜ 상세 페이지 - 뒤로가기 버튼으로 홈 복귀 확인

### 반응형 레이아웃 검증

- ⬜ 모바일 뷰포트 (375px) - 1열 레이아웃 확인
- ⬜ 태블릿 뷰포트 (768px) - 2열 레이아웃 확인
- ⬜ 데스크톱 뷰포트 (1440px) - 3~4열 레이아웃 확인

### 콘솔 에러 확인

- ⬜ 홈 페이지 - 브라우저 콘솔 에러 없음 확인
- ⬜ 상세 페이지 - 브라우저 콘솔 에러 없음 확인

### Docker 환경 검증 (선택사항)

- ⬜ `docker-compose up --build` - 전체 스택 컨테이너 빌드 및 실행
  > 주의: Docker Compose 설정은 Sprint 2에서 완성 예정 (현재 로컬 실행 방식 권장)

---

## API 엔드포인트 목록 (Sprint 3 기준)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/games` | 게임 목록 (query: category, sort, page, pageSize) |
| GET | `/api/games/{id}` | 게임 상세 |
| GET | `/api/games/{id}/similar` | 유사 게임 추천 (Confidence 가중 유사도) |
| GET | `/api/games/search?q={keyword}` | **(Sprint 3 신규)** 키워드 검색 (게임명, 태그, 카테고리) |
| GET | `/api/categories` | 카테고리 목록 |
| POST | `/api/recommend` | **(Sprint 3 신규)** 건강 목표 기반 맞춤 추천 |
| POST | `/api/admin/analyze/{gameId}` | 단일 게임 AI 분석 트리거 |
| POST | `/api/admin/analyze/all` | 미분석 게임 전체 일괄 AI 분석 |
| POST | `/api/admin/collect` | 게임 데이터 수집 (Mock or RapidAPI) |

### 쿼리 파라미터 (`GET /api/games`)

| 파라미터 | 타입 | 기본값 | 설명 |
|---------|------|--------|------|
| `category` | string | - | 카테고리 필터 |
| `sort` | string | `popular` | 정렬 (`popular`, `rating`, `latest`) |
| `page` | int | `1` | 페이지 번호 |
| `pageSize` | int | `12` | 페이지당 항목 수 |

상세 API 명세는 [docs/API.md](docs/API.md)를 참고하세요.

---

## 검증 보고서

- [Sprint 3 자동 검증 보고서](docs/sprint/sprint3/validation-report.md)
- [Sprint 1 자동 검증 보고서](docs/sprint/sprint1/validation-report.md)
