# 헬스케어 게이미피케이션 큐레이터

건강 목표 달성에 도움되는 게임을 AI 기반으로 큐레이션하여 제공하는 풀스택 웹 애플리케이션.

---

## 주요 기능 (Sprint 3 기준)

- **게임 목록 탐색** - 카테고리 필터(달리기, 명상, 팔 운동 등) + 인기순/평점순/최신순 정렬
- **게임 상세 정보** - 게임 설명, 평점, 다운로드 수, AI 건강 효과 태그
- **Claude AI 자동 태깅** - Anthropic API로 게임 건강 효과 자동 분류 + DB 캐싱
- **AI 신뢰도 표시** - 태그별 Confidence 퍼센트 바 + AI 분석 근거 펼침
- **스토어 바로가기** - Google Play / App Store 링크 제공
- **유사 게임 추천** - Confidence 가중 유사도 기반 추천 (AI 분석 완료 게임 우선)
- **맞춤 추천** - 건강 목표(심폐기능, 근력강화, 스트레스해소, 인지개선, 반응훈련) 선택 후 AI 추천 이유 포함 게임 추천
- **키워드 검색** - 게임명/태그/카테고리 검색, 매칭 키워드 하이라이팅
- **반응형 UI** - 모바일(1열) / 태블릿(2열) / 데스크톱(3~4열) 레이아웃

---

## 기술 스택

### 프론트엔드

| 항목 | 기술 |
|------|------|
| 프레임워크 | Next.js (App Router) + TypeScript strict mode |
| 스타일링 | Tailwind CSS |
| 서버 상태 | TanStack Query 5 |
| 이미지 | next/image |

### 백엔드

| 항목 | 기술 |
|------|------|
| 프레임워크 | ASP.NET Core (.NET 9) |
| 아키텍처 | Clean Architecture |
| ORM | Entity Framework Core + SQLite |
| AI 연동 | Anthropic Claude API (HttpClient) |
| 로깅 | Serilog |

### 인프라

| 항목 | 기술 |
|------|------|
| 컨테이너 | Docker Compose (백엔드 + 프론트엔드) |

---

## 프로젝트 구조

```
hackathon/
├── backend/
│   ├── src/
│   │   ├── HealthGameCurator.Api/            # 컨트롤러, 진입점
│   │   ├── HealthGameCurator.Application/    # 서비스, DTOs, 인터페이스
│   │   ├── HealthGameCurator.Domain/         # 도메인 엔티티, Enums
│   │   └── HealthGameCurator.Infrastructure/ # DB, Claude API, 데이터 수집
│   └── tests/
│       └── HealthGameCurator.Tests/          # xUnit 단위 테스트 (29개)
├── frontend/
│   ├── app/                                  # Next.js App Router 페이지
│   │   ├── recommend/                        # 맞춤 추천 페이지 (Sprint 3)
│   │   └── search/                           # 검색 결과 페이지 (Sprint 3)
│   └── components/
│       ├── game/                             # 게임 관련 컴포넌트
│       ├── recommend/                        # 추천 관련 컴포넌트 (Sprint 3)
│       └── layout/                           # 레이아웃 컴포넌트
├── docs/
│   ├── PRD.md          # 제품 요구사항 문서
│   ├── ROADMAP.md      # 프로젝트 로드맵
│   ├── API.md          # API 명세
│   └── sprint/
│       ├── sprint1.md  # Sprint 1 계획/결과
│       ├── sprint2.md  # Sprint 2 계획/결과
│       └── sprint3.md  # Sprint 3 계획/결과
├── docker-compose.yml
└── deploy.md           # 실행 방법 및 검증 체크리스트
```

---

## 시작하기

자세한 실행 방법 및 검증 절차는 [deploy.md](./deploy.md)를 참고하세요.

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

### Claude AI 분석 트리거

```bash
# 단일 게임 분석
curl -X POST http://localhost:5000/api/admin/analyze/1

# 전체 미분석 게임 일괄 분석
curl -X POST http://localhost:5000/api/admin/analyze/all

# Mock 게임 데이터 수집
curl -X POST "http://localhost:5000/api/admin/collect?maxCount=10"
```

---

## API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/games` | 게임 목록 (필터, 정렬, 페이지네이션) |
| GET | `/api/games/{id}` | 게임 상세 |
| GET | `/api/games/{id}/similar` | 유사 게임 추천 |
| GET | `/api/games/search?q={keyword}` | 키워드 검색 (Sprint 3) |
| GET | `/api/categories` | 카테고리 목록 |
| POST | `/api/recommend` | 건강 목표 기반 맞춤 추천 (Sprint 3) |
| POST | `/api/admin/analyze/{id}` | 단일 게임 AI 분석 |
| POST | `/api/admin/analyze/all` | 전체 일괄 AI 분석 |
| POST | `/api/admin/collect` | 게임 데이터 수집 |

Swagger UI: `http://localhost:5000/swagger`

---

## 문서

- [API 명세](./docs/API.md) - 전체 엔드포인트, 요청/응답 형식, 데이터 모델
- [배포 가이드](./deploy.md) - 환경 설정, 실행 방법, 검증 체크리스트
- [프로젝트 로드맵](./docs/ROADMAP.md) - 전체 기능 계획 및 진행 현황
- [Sprint 3 결과](./docs/sprint/sprint3.md) - Sprint 3 구현 내용 및 검증 결과
- [Sprint 2 결과](./docs/sprint/sprint2.md) - Sprint 2 구현 내용 및 검증 결과

---

## 프로젝트 진행 현황

현재 **Sprint 3 완료** (Phase 3: 맞춤 추천 + 검색 기능 완성). Must Have 11/11 + Should Have 5/6 완료.

자세한 진행 현황은 [docs/ROADMAP.md](./docs/ROADMAP.md)를 참고하세요.
