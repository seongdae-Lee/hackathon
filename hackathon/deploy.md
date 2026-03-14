# 배포 및 검증 가이드 - Sprint 2

> **Sprint 2 작업일:** 2026-03-15
> **브랜치:** sprint2

---

## Sprint 2 신규 기능

- Claude AI API 연동 - 게임 건강 효과 자동 태깅
- 게임 데이터 수집 파이프라인 (Mock Fallback 지원)
- 유사 게임 추천 개선 (Confidence 가중치 유사도)
- 프론트엔드 AI 배지 UI 개선 (AiAnalysisBadge)
- ErrorFallback 공통 컴포넌트
- Docker Compose 설정

---

## Sprint 2 자동 검증 완료 항목

- ✅ `dotnet build` - 경고 0, 오류 0
- ✅ `dotnet test` - 17개 단위 테스트 모두 통과
  - GameService 테스트 (8개: 기존 5개 + AI 분석 3개 추가)
  - ClaudeApiServiceTests (3개)
  - GameRecommendationServiceTests (4개)
  - GameDataCollectorServiceTests (2개)

---

## Sprint 2 수동 검증 필요 항목

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

### 프론트엔드 AI 태그 UI 검증

- ⬜ 상세 페이지 - AI 분석 배지(`✨ AI 분석` / `📋 수동 태그`) 표시 확인
- ⬜ 상세 페이지 - "Claude AI 분석 완료" 헤더 표시 (isAiAnalyzed=true 게임)
- ⬜ 상세 페이지 - AI 분석 근거 펼침/접기 정상 동작 확인
- ⬜ 홈 페이지 - ErrorFallback UI 표시 (백엔드 미실행 시)

### Docker 환경 검증

```bash
# .env 파일 생성
echo "CLAUDE_API_KEY=your_api_key_here" > .env

# Docker Compose 빌드 및 실행
docker compose up --build
```

- ⬜ `docker compose up --build` - 전체 스택 빌드 성공 확인
- ⬜ `http://localhost:3000` 프론트엔드 접속 확인
- ⬜ `http://localhost:5000/swagger` 백엔드 Swagger 접속 확인

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

## API 엔드포인트 목록

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/games` | 게임 목록 (query: category, sort, page, pageSize) |
| GET | `/api/games/{id}` | 게임 상세 |
| GET | `/api/games/{id}/similar` | 유사 게임 추천 |
| GET | `/api/categories` | 카테고리 목록 |

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

- [Sprint 1 자동 검증 보고서](docs/sprint/sprint1/validation-report.md)
