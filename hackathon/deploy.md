# 배포 및 검증 가이드 - Sprint 1

> **Sprint 1 완료일:** 2026-03-14
> **브랜치:** sprint1

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

---

## 검증 보고서

- [Sprint 1 자동 검증 보고서](docs/sprint/sprint1/validation-report.md)
