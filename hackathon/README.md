# 헬스케어 게이미피케이션 큐레이터

건강 목표 달성에 도움되는 게임을 AI 기반으로 큐레이션하여 제공하는 풀스택 웹 애플리케이션.

---

## 🌐 배포 URL

| 구분 | URL |
|------|-----|
| **프론트엔드 (Vercel)** | https://frontend-o95y4zyqi-seongdae-lees-projects.vercel.app |
| **백엔드 API (Railway)** | https://hackathon-api-production-3278.up.railway.app |
| **Swagger UI** | https://hackathon-api-production-3278.up.railway.app/swagger |
| **관리자 페이지** | https://frontend-o95y4zyqi-seongdae-lees-projects.vercel.app/admin |

> 관리자 로그인: ID `admin` / PW `admin`

---

## 주요 기능

- **게임 목록 탐색** - 카테고리 필터(달리기, 명상, 팔 운동 등) + 인기순/평점순/최신순 정렬
- **게임 상세 정보** - 게임 설명, 평점, 다운로드 수, AI 건강 효과 태그
- **Claude AI 자동 태깅** - Anthropic API로 게임 건강 효과 자동 분류 + DB 캐싱
- **AI 신뢰도 표시** - 태그별 Confidence 퍼센트 바 + AI 분석 근거 펼침
- **스토어 바로가기** - Google Play / App Store 링크 제공
- **유사 게임 추천** - Confidence 가중 유사도 기반 추천 (AI 분석 완료 게임 우선)
- **맞춤 추천** - 건강 목표(심폐기능, 근력강화, 스트레스해소, 인지개선, 반응훈련) 선택 후 AI 추천 이유 포함 게임 추천
- **키워드 검색** - 게임명/태그/카테고리 검색, 매칭 키워드 하이라이팅
- **관리자 대시보드** - 게임 CRUD, AI 재분석 트리거, 데이터 수집 관리
- **반응형 UI** - 모바일(1열) / 태블릿(2열) / 데스크톱(3~4열) 레이아웃

---

## 기술 스택

### 프론트엔드

| 항목 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) + TypeScript strict mode |
| 스타일링 | Tailwind CSS |
| 서버 상태 | TanStack Query 5 |
| 테스트 | Jest + React Testing Library (53개), Playwright E2E |
| 호스팅 | Vercel |

### 백엔드

| 항목 | 기술 |
|------|------|
| 프레임워크 | ASP.NET Core (.NET 9) |
| 아키텍처 | Clean Architecture |
| ORM | Entity Framework Core + SQLite |
| AI 연동 | Anthropic Claude API (HttpClient) |
| 로깅 | Serilog |
| 테스트 | xUnit (37개) |
| 호스팅 | Railway (Docker) |

### CI/CD

| 항목 | 기술 |
|------|------|
| 워크플로우 | GitHub Actions |
| 프론트엔드 자동 배포 | master 브랜치 push → Vercel 자동 배포 |
| 백엔드 자동 배포 | master 브랜치 push → Railway 자동 배포 |
| 트리거 조건 | `frontend/**` 변경 시 Vercel / `backend/**` 변경 시 Railway |

---

## 프로젝트 구조

```
hackathon/
├── .github/workflows/
│   ├── deploy-frontend.yml   # Vercel 자동 배포 워크플로우
│   └── deploy-backend.yml    # Railway 자동 배포 워크플로우
├── backend/
│   ├── src/
│   │   ├── HealthGameCurator.Api/            # 컨트롤러, 진입점
│   │   ├── HealthGameCurator.Application/    # 서비스, DTOs, 인터페이스
│   │   ├── HealthGameCurator.Domain/         # 도메인 엔티티, Enums
│   │   └── HealthGameCurator.Infrastructure/ # DB, Claude API, 데이터 수집
│   └── tests/
│       └── HealthGameCurator.Tests/          # xUnit 단위 테스트 (37개)
├── frontend/
│   ├── app/                                  # Next.js App Router 페이지
│   │   ├── admin/                            # 관리자 대시보드
│   │   ├── recommend/                        # 맞춤 추천 페이지
│   │   ├── search/                           # 검색 결과 페이지
│   │   └── games/[id]/                       # 게임 상세 페이지
│   ├── components/
│   │   ├── game/                             # 게임 관련 컴포넌트
│   │   ├── admin/                            # 관리자 컴포넌트
│   │   ├── recommend/                        # 추천 관련 컴포넌트
│   │   └── layout/                           # 레이아웃 컴포넌트
│   ├── __tests__/                            # Jest 단위 테스트 (53개)
│   └── e2e/                                  # Playwright E2E 테스트
├── docs/
│   ├── PRD.md                # 제품 요구사항 문서
│   ├── ROADMAP.md            # 프로젝트 로드맵
│   ├── API.md                # API 명세
│   ├── CODE_REVIEW_CHECKLIST.md  # 코드 리뷰 체크리스트
│   ├── 개발완료보고서.md
│   └── sprint/
│       ├── sprint1.md ~ sprint4.md
├── docker-compose.yml
└── deploy.md                 # 실행 방법 및 검증 체크리스트
```

---

## 시작하기

### 로컬 개발

```bash
# 백엔드 실행 (http://localhost:5000)
cd backend
dotnet run --project src/HealthGameCurator.Api --urls "http://localhost:5000"

# 프론트엔드 실행 (http://localhost:3000)
cd frontend
npm install && npm run dev
```

### Docker Compose

```bash
# Claude API 키 설정 (선택사항 — 없으면 Mock 자동 사용)
echo "CLAUDE_API_KEY=your_api_key_here" > .env

# 전체 스택 실행
docker compose up --build
```

### 환경 변수 설정

**프론트엔드 (`frontend/.env.local`)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000   # 로컬
# NEXT_PUBLIC_API_URL=https://hackathon-api-production-3278.up.railway.app  # 프로덕션
```

**백엔드 (`backend/src/HealthGameCurator.Api/appsettings.json`)**
```json
{
  "ClaudeApi": { "ApiKey": "your_claude_api_key" },
  "AllowedOrigins": "http://localhost:3000,https://frontend-o95y4zyqi-seongdae-lees-projects.vercel.app"
}
```

### Claude AI 분석 트리거

```bash
# 프로덕션 환경
BASE=https://hackathon-api-production-3278.up.railway.app

# 단일 게임 분석
curl -X POST $BASE/api/admin/analyze/1

# 전체 미분석 게임 일괄 분석
curl -X POST $BASE/api/admin/analyze/all

# Mock 게임 데이터 수집
curl -X POST "$BASE/api/admin/collect?maxCount=10"
```

---

## API 엔드포인트

**Base URL (프로덕션):** `https://hackathon-api-production-3278.up.railway.app/api`

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/games` | 게임 목록 (필터, 정렬, 페이지네이션) |
| GET | `/api/games/{id}` | 게임 상세 |
| GET | `/api/games/{id}/similar` | 유사 게임 추천 |
| GET | `/api/games/search?q={keyword}` | 키워드 검색 |
| GET | `/api/categories` | 카테고리 목록 |
| POST | `/api/recommend` | 건강 목표 기반 맞춤 추천 |
| GET | `/api/admin/stats` | 관리자 통계 |
| GET | `/api/admin/games` | 관리자 게임 목록 |
| POST | `/api/admin/games` | 게임 추가 |
| PUT | `/api/admin/games/{id}` | 게임 수정 |
| DELETE | `/api/admin/games/{id}` | 게임 삭제 |
| POST | `/api/admin/analyze/{id}` | 단일 게임 AI 분석 |
| POST | `/api/admin/analyze/all` | 전체 일괄 AI 분석 |
| POST | `/api/admin/collect` | 게임 데이터 수집 |

전체 명세: [docs/API.md](./docs/API.md)

---

## CI/CD

`master` 브랜치에 push 시 GitHub Actions가 자동으로 배포합니다.

| 변경 경로 | 배포 대상 | 플랫폼 |
|-----------|----------|--------|
| `frontend/**` | 프론트엔드 | Vercel |
| `backend/**` | 백엔드 | Railway |

워크플로우 파일: [`.github/workflows/`](./.github/workflows/)

---

## 테스트

```bash
# 백엔드 단위 테스트 (37개)
cd backend && dotnet test

# 프론트엔드 단위 테스트 (53개)
cd frontend && npm test

# E2E 테스트 (Playwright)
cd frontend && npx playwright test
```

---

## 문서

| 문서 | 설명 |
|------|------|
| [API 명세](./docs/API.md) | 전체 엔드포인트, 요청/응답 형식, 데이터 모델 |
| [배포 가이드](./deploy.md) | 환경 설정, 실행 방법, 검증 체크리스트 |
| [코드 리뷰 체크리스트](./docs/CODE_REVIEW_CHECKLIST.md) | PR 머지 전 리뷰 기준 |
| [프로젝트 로드맵](./docs/ROADMAP.md) | 전체 기능 계획 및 진행 현황 |
| [개발완료보고서](./docs/개발완료보고서.md) | 스프린트 이력, 기능 목록, 기술 결정 |
| [Sprint 1~4 결과](./docs/sprint/) | 각 스프린트 계획/결과/검증 보고서 |

---

## 프로젝트 진행 현황

**Sprint 4 완료** (Phase 1~4 전체 완료). Must Have 11/11 + Should Have 6/6 + Nice to Have 2/3 완료.

자세한 진행 현황은 [docs/ROADMAP.md](./docs/ROADMAP.md)를 참고하세요.
