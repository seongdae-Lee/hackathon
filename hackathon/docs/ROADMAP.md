# 프로젝트 로드맵 - 헬스케어 게이미피케이션 큐레이터

## 개요

- **프로젝트 목표**: 건강 목표 달성에 도움되는 게임을 AI 기반으로 큐레이션하여 제공하는 풀스택 웹 애플리케이션
- **전체 예상 기간**: 4 스프린트 (약 8주, 해커톤 MVP는 Sprint 1~2로 커버)
- **현재 진행 단계**: Phase 1 완료 (Sprint 1 완료: 2026-03-14)
- **기준일**: 2026-03-14

---

## 진행 상태 범례

- ✅ 완료
- 🔄 진행 중
- 📋 예정
- ⏸️ 보류

---

## 프로젝트 현황 대시보드

| 항목 | 상태 |
|------|------|
| 전체 진행률 | 25% (Phase 1 완료) |
| 현재 Phase | Phase 1 완료 - 프론트엔드 UI + Mock API |
| 다음 마일스톤 | Phase 2 완료 (AI 태깅 + 백엔드 완성, Sprint 2) |
| Must Have 진행률 | 5 / 11 태스크 (FR-01~05, FR-07 완료) |
| Should Have 진행률 | 0 / 6 태스크 |
| Nice to Have 진행률 | 0 / 3 태스크 |

### 기능 요구사항 매핑

| FR ID | 기능 | 우선순위 | Phase | 상태 |
|-------|------|----------|-------|------|
| FR-01 | 게임 목록 필터/정렬 | Must Have | 1 | ✅ |
| FR-02 | 카테고리 목록 정의 | Must Have | 1 | ✅ |
| FR-03 | 정렬 옵션 (인기/평점/최신) | Must Have | 1 | ✅ |
| FR-04 | 게임 카드 UI | Must Have | 1 | ✅ |
| FR-05 | 게임 상세 정보 표시 | Must Have | 1 | ✅ |
| FR-06 | AI 건강 효과 설명 표시 | Must Have | 2 | 📋 |
| FR-07 | 스토어 바로가기 링크 | Must Have | 1 | ✅ |
| FR-08 | 유사 게임 추천 | Must Have | 2 | 📋 |
| FR-09 | Claude API 건강 효과 자동 분류 | Must Have | 2 | 📋 |
| FR-10 | 건강 효과 태그 목록 | Must Have | 2 | 📋 |
| FR-11 | AI 신뢰도 표시 | Must Have | 2 | 📋 |
| FR-12 | 건강 목표 선택 폼 | Should Have | 3 | 📋 |
| FR-13 | 목표 기반 게임 리스트 반환 | Should Have | 3 | 📋 |
| FR-14 | AI 추천 이유 텍스트 | Should Have | 3 | 📋 |
| FR-15 | 게임명/태그/카테고리 검색 | Should Have | 3 | 📋 |
| FR-16 | 검색 결과 하이라이팅 | Should Have | 3 | 📋 |
| FR-17 | Google Play API 데이터 수집 | Should Have | 2 | 📋 |
| FR-18 | 주기적 업데이트 (수동 트리거) | Nice to Have | 4 | 📋 |
| FR-19 | 수집 필드 정의 및 매핑 | Should Have | 2 | 📋 |

---

## 기술 아키텍처 결정 사항

### 프론트엔드

| 결정 | 선택 | 이유 |
|------|------|------|
| 프레임워크 | Next.js 14+ (App Router) | CLAUDE.md 코딩 표준에 Next.js + TypeScript로 명시. React 기반이므로 PRD와 호환 |
| 언어 | TypeScript (strict mode) | 타입 안전성, CLAUDE.md 필수 사항 |
| 스타일링 | Tailwind CSS | PRD 명시, inline style 금지 |
| 상태관리 | TanStack Query (서버 상태) + Zustand (클라이언트 상태) | CLAUDE.md 필수 사항 |
| 이미지 | next/image | CLAUDE.md 필수 사항 |

### 백엔드

| 결정 | 선택 | 이유 |
|------|------|------|
| 프레임워크 | ASP.NET Core 8 Web API | PRD 명시 |
| 언어 | C# 12 | CLAUDE.md 필수 사항 |
| 아키텍처 | Clean Architecture | API -> Application -> Domain -> Infrastructure |
| ORM | Entity Framework Core | CLAUDE.md 필수 사항 |
| 검증 | FluentValidation | CLAUDE.md 보안 규칙 |
| 로깅 | Serilog | CLAUDE.md 필수 사항 |
| 예외 처리 | IExceptionHandler 글로벌 미들웨어 | 통합 에러 응답 |

### 데이터베이스

| 결정 | 선택 | 이유 |
|------|------|------|
| 개발 환경 | SQLite | 빠른 셋업, 해커톤에 적합 |
| 운영 환경 | PostgreSQL | 확장성, PRD 명시 |
| 마이그레이션 | EF Core Migrations | CLAUDE.md 필수 사항 |

### 외부 서비스

| 결정 | 선택 | 이유 |
|------|------|------|
| 게임 데이터 | Mock 데이터 우선 -> RapidAPI 연동 | Google Play API 제한 (PRD 제약사항) |
| AI 태깅 | Claude API | PRD 명시, 게임당 1회 분석 후 DB 캐싱 |
| 배포 | Docker | 환경 일관성 |

### API 응답 형식 (CLAUDE.md 준수)

```json
// 성공
{ "success": true, "data": T }
// 실패
{ "success": false, "error": "메시지", "code": "ERROR_CODE" }
```

---

## Phase 1: 프론트엔드 UI + Mock 데이터 (Sprint 1, 2주)

### 목표
사용자가 게임 목록을 탐색하고 상세 정보를 확인할 수 있는 프론트엔드 완성. Mock 데이터 기반으로 UI를 먼저 완성하여 사용자 검토를 받는다.

### 작업 목록

#### 1-1. 프로젝트 초기 설정 (복잡도: 낮음)
- ✅ **Next.js 프로젝트 생성**: `create-next-app` + TypeScript strict mode + Tailwind CSS
  - `tsconfig.json` strict: true 설정
  - Tailwind CSS 설정 및 기본 테마 정의 (색상, 폰트)
  - ESLint + Prettier 설정
- ✅ **ASP.NET Core 프로젝트 생성**: Clean Architecture 솔루션 구조 셋업
  - `HealthGameCurator.Api` (Web API)
  - `HealthGameCurator.Application` (Services, DTOs)
  - `HealthGameCurator.Domain` (Entities)
  - `HealthGameCurator.Infrastructure` (DB, External API)
  - `HealthGameCurator.Tests` (xUnit 테스트)
- ⬜ **Docker Compose 설정**: 프론트엔드 + 백엔드 + DB 컨테이너 구성
- ✅ **Mock 데이터 준비**: 21개 건강 게임 샘플 데이터 DB 시딩으로 구현
  - Game 모델: Name, Description, IconUrl, Rating, DownloadCount, Category, PlayStoreUrl, AppStoreUrl
  - HealthTag 모델: Tag, Confidence, AiDescription

#### 1-2. 공통 컴포넌트 개발 (복잡도: 중간)
- ✅ **레이아웃 컴포넌트**: Header (로고, 네비게이션, 검색 입력) + Footer
  - 반응형 대응: 모바일 햄버거 메뉴
- ✅ **게임 카드 컴포넌트** (FR-04): 썸네일, 게임명, 카테고리, 평점(별점), 건강 효과 태그 배지
  - next/image로 아이콘 렌더링
  - 태그는 색상 구분된 배지 형태
- ✅ **카테고리 필터 컴포넌트** (FR-02): 달리기, 명상/스트레스 해소, 팔 운동, 반응훈련, 밸런스, 피트니스
  - 클릭 시 URL 쿼리 파라미터 변경
- ✅ **정렬 드롭다운 컴포넌트** (FR-03): 인기순, 평점순, 최신순

#### 1-3. 게임 홈 페이지 (S-01) (복잡도: 중간)
- ✅ **게임 목록 페이지** (FR-01): `/` 경로
  - 카테고리 필터 사이드바 또는 상단 탭
  - 정렬 드롭다운
  - 게임 카드 그리드 레이아웃 (반응형: 모바일 1열, 태블릿 2열, PC 3~4열)
  - TanStack Query로 백엔드 API 호출
  - 빈 상태 UI ("해당 카테고리에 게임이 없습니다")
- ⬜ **인기 게임 섹션**: 상위 5개 게임 하이라이트 영역 (Phase 2로 이월)

#### 1-4. 게임 상세 페이지 (S-02) (복잡도: 중간)
- ✅ **게임 상세 페이지** (FR-05): `/games/[id]` 경로
  - 게임 기본 정보: 이름, 설명, 개발사, 스크린샷, 평점, 다운로드 수
  - 스토어 바로가기 버튼 (FR-07): Google Play / App Store 아이콘 + 외부 링크
  - AI 건강 효과 태그 영역 (FR-06): 태그 배지 + 신뢰도 바 (Mock 데이터)
  - AI 분석 근거 텍스트 표시 (FR-11)
  - 유사 게임 추천 섹션 (FR-08): GET /api/games/{id}/similar 엔드포인트 연동
  - 뒤로가기 버튼

#### 1-5. 백엔드 기초 API (복잡도: 중간)
- ✅ **Domain 레이어**: Game, HealthTag 엔티티 정의
- ✅ **Application 레이어**: GameDto, HealthTagDto record 타입 정의
- ✅ **Infrastructure 레이어**: EF Core DbContext + SQLite 설정 + 초기 마이그레이션
- ✅ **Seed 데이터**: 21개 Mock 게임 데이터를 DB에 시딩
- ✅ **API 엔드포인트**:
  - `GET /api/games` - 게임 목록 (카테고리 필터, 정렬, 페이지네이션)
  - `GET /api/games/{id}` - 게임 상세
  - `GET /api/games/{id}/similar` - 유사 게임 추천
  - `GET /api/categories` - 카테고리 목록
- ✅ **통합 응답 형식**: `ApiResponse<T>` 래퍼 적용
- ✅ **CORS 설정**: 프론트엔드 도메인 명시적 허용
- ✅ **Serilog 설정**: 구조화된 로깅

### 완료 기준 (Definition of Done)
- ✅ 게임 홈 페이지에서 카테고리 필터, 정렬이 동작한다
- ✅ 게임 카드 클릭 시 상세 페이지로 이동한다
- ✅ 상세 페이지에서 게임 정보, 건강 효과 태그, 스토어 링크가 표시된다
- ✅ 모바일/태블릿/PC에서 반응형 레이아웃이 정상 동작한다
- ✅ 백엔드 API가 게임 목록/상세 데이터를 정상 반환한다
- ✅ `dotnet build` + `npm run build` 오류 없음
- ✅ 콘솔에 에러/경고 없음

### Playwright MCP 검증 시나리오
> `npm run dev` 실행 후 아래 순서로 검증

**게임 홈 페이지 검증:**
1. `browser_navigate` -> `http://localhost:3000` 접속
2. `browser_snapshot` -> 게임 카드 그리드가 렌더링되었는지 확인
3. `browser_click` -> 카테고리 필터 "반응훈련" 클릭
4. `browser_snapshot` -> 필터된 게임 목록만 표시되는지 확인
5. `browser_select_option` -> 정렬 드롭다운에서 "평점순" 선택
6. `browser_snapshot` -> 정렬 순서 변경 확인
7. `browser_console_messages(level: "error")` -> 에러 없음 확인

**게임 상세 페이지 검증:**
1. `browser_navigate` -> `http://localhost:3000` 접속
2. `browser_click` -> 첫 번째 게임 카드 클릭
3. `browser_wait_for` -> 상세 페이지 로딩 대기
4. `browser_snapshot` -> 게임명, 설명, 평점, 건강 효과 태그, 스토어 링크 존재 확인
5. `browser_snapshot` -> 유사 게임 추천 섹션 존재 확인
6. `browser_click` -> 뒤로가기 버튼 클릭
7. `browser_snapshot` -> 홈 페이지로 복귀 확인
8. `browser_console_messages(level: "error")` -> 에러 없음 확인

**반응형 레이아웃 검증:**
1. `browser_navigate` -> `http://localhost:3000` 접속
2. `browser_resize(width: 375, height: 812)` -> 모바일 뷰포트
3. `browser_snapshot` -> 1열 레이아웃 + 햄버거 메뉴 확인
4. `browser_resize(width: 768, height: 1024)` -> 태블릿 뷰포트
5. `browser_snapshot` -> 2열 레이아웃 확인
6. `browser_resize(width: 1440, height: 900)` -> 데스크톱 뷰포트
7. `browser_snapshot` -> 3~4열 레이아웃 확인

**공통 검증:**
- `browser_network_requests` -> API 호출이 200 응답인지 확인
- `browser_console_messages(level: "error")` -> 콘솔 에러 없음 확인

### 기술 고려사항
- **Karpathy Guidelines 준수**: 프로젝트 초기 설정은 최소한의 구조만 생성. 불필요한 추상화 금지.
- Mock 데이터는 별도 JSON 파일로 관리하여 Phase 2에서 실제 API 전환 시 수정 최소화
- next/image의 외부 이미지 도메인을 `next.config.js`에 허용 설정 필요
- TanStack Query의 `queryKey` 설계: `['games', { category, sort, page }]` 패턴

---

## Phase 2: AI 태깅 + 백엔드 완성 + 데이터 수집 (Sprint 2, 2주)

### 목표
Claude API를 연동하여 AI 건강 효과 태깅을 구현하고, 실제 게임 데이터 수집 파이프라인을 구축한다. Phase 1의 Mock 데이터를 실제 API로 전환한다.

### 작업 목록

#### 2-1. Claude API 연동 - AI 건강 효과 태깅 (복잡도: 높음)
- ⬜ **Claude API 서비스 구현** (FR-09):
  - `IClaudeApiService` 인터페이스 정의
  - 게임 메타데이터(이름, 설명, 카테고리)를 입력으로 건강 효과 분류 요청
  - 프롬프트 설계: 건강 효과 태그 + 신뢰도 점수 + 분석 근거를 JSON으로 반환하도록 구성
  - 응답 파싱 및 HealthTag 엔티티로 변환
- ⬜ **태그 목록 관리** (FR-10): #심폐기능, #근력강화, #스트레스해소, #인지개선, #반응훈련
  - HealthTagType enum 또는 const 정의
  - DB에 태그 마스터 테이블 또는 enum 매핑
- ⬜ **AI 신뢰도 표시** (FR-11):
  - Confidence 값을 프론트엔드 UI에 퍼센트 바 또는 라벨로 표시
  - AiDescription을 툴팁 또는 펼침 영역으로 표시
- ⬜ **API 비용 최적화**: 게임당 1회 분석 후 DB 캐싱 (PRD 제약사항)
  - HealthTag 테이블에 분석 완료 여부 플래그
  - 이미 분석된 게임은 API 호출 스킵
- ⬜ **단위 테스트**: ClaudeApiService 응답 파싱 테스트 (외부 API mock)

#### 2-2. 게임 데이터 수집 파이프라인 (복잡도: 높음)
- ⬜ **데이터 수집 서비스** (FR-17, FR-19):
  - `IGameDataCollectorService` 인터페이스 정의
  - RapidAPI Google Play Store API 연동 (또는 대안 API)
  - 수집 필드 매핑: 게임명, 설명, 아이콘 URL, 평점, 다운로드 수, 카테고리, 스토어 링크
  - 수집 결과를 Game 엔티티로 변환 및 DB 저장
- ⬜ **수동 트리거 API**: `POST /api/admin/collect` - 관리자용 데이터 수집 트리거
  - 수집 진행 상태를 로그로 기록
- ⬜ **Fallback 전략**: RapidAPI 실패 시 Mock 데이터 유지
- ⬜ **단위 테스트**: 데이터 수집 서비스 매핑 로직 테스트

#### 2-3. 유사 게임 추천 로직 (복잡도: 중간)
- ⬜ **유사 게임 추천 서비스** (FR-08):
  - `IGameRecommendationService` 인터페이스 정의
  - 태그 기반 유사도 계산: 동일 HealthTag를 가진 게임 필터링, Confidence 가중치 적용
  - `GET /api/games/{id}/similar` 엔드포인트
- ⬜ **프론트엔드 연동**: 상세 페이지의 유사 게임 섹션을 실제 API로 전환

#### 2-4. 프론트엔드 API 전환 (복잡도: 낮음)
- ⬜ **Mock -> 실제 API 전환**: TanStack Query의 queryFn을 실제 백엔드 API 호출로 변경
- ⬜ **에러 처리 UI**: API 실패 시 사용자 친화적 에러 메시지 표시
- ⬜ **로딩 상태 UI**: 스켈레톤 로더 또는 스피너

### 완료 기준 (Definition of Done)
- ✅ Claude API로 게임의 건강 효과 태그가 자동 생성된다
- ✅ 태그 분석 결과가 DB에 캐싱되어 재호출하지 않는다
- ✅ 게임 데이터 수집이 RapidAPI 또는 Mock 데이터로 동작한다
- ✅ 상세 페이지에서 유사 게임이 태그 기반으로 추천된다
- ✅ 프론트엔드가 실제 백엔드 API와 연동된다
- ✅ ClaudeApiService, GameDataCollectorService 단위 테스트 통과
- ✅ `dotnet test` 전체 통과

### Playwright MCP 검증 시나리오
> `npm run dev` + 백엔드 서버 실행 후 검증

**AI 건강 효과 태그 검증:**
1. `browser_navigate` -> `http://localhost:3000/games/1` 접속
2. `browser_snapshot` -> 건강 효과 태그 배지가 표시되는지 확인 (#심폐기능, #근력강화 등)
3. `browser_snapshot` -> AI 신뢰도 퍼센트가 표시되는지 확인
4. `browser_click` -> AI 분석 근거 펼침 영역 클릭
5. `browser_snapshot` -> AiDescription 텍스트가 표시되는지 확인
6. `browser_console_messages(level: "error")` -> 에러 없음

**유사 게임 추천 검증:**
1. `browser_navigate` -> `http://localhost:3000/games/1` 접속
2. `browser_snapshot` -> "유사 게임" 섹션에 카드 3~4개 존재 확인
3. `browser_click` -> 유사 게임 카드 클릭
4. `browser_wait_for` -> 해당 게임 상세 페이지 로딩 대기
5. `browser_snapshot` -> 새로운 게임 상세 정보 표시 확인

**API 연동 검증:**
1. `browser_navigate` -> `http://localhost:3000` 접속
2. `browser_network_requests` -> `/api/games` 호출이 200 응답인지 확인
3. `browser_click` -> 게임 카드 클릭
4. `browser_network_requests` -> `/api/games/{id}` 호출이 200 응답인지 확인
5. `browser_network_requests` -> `/api/games/{id}/similar` 호출이 200 응답인지 확인

**공통 검증:**
- `browser_console_messages(level: "error")` -> 콘솔 에러 없음
- `browser_network_requests` -> 모든 API 호출 2xx 응답

### 기술 고려사항
- **Claude API 프롬프트**: 구조화된 JSON 응답을 요청하여 파싱 안정성 확보. 예: `{ "tags": [{ "name": "#심폐기능", "confidence": 0.85, "reason": "..." }] }`
- **API Key 관리**: `appsettings.json` + 환경변수로 관리. 절대 클라이언트 노출 금지 (NF-04)
- **RapidAPI 제한**: 무료 플랜의 요청 제한 확인. 배치 수집 시 rate limit 처리 필요
- **Karpathy Guidelines**: Claude API 연동은 단순한 HTTP 호출 + JSON 파싱으로 구현. 불필요한 추상화 레이어 추가 금지

---

## Phase 3: 맞춤 추천 + 검색 (Sprint 3, 2주)

### 목표
사용자가 건강 목표를 선택하면 맞춤 게임을 추천받고, 키워드 검색으로 게임을 찾을 수 있는 기능 완성. (Should Have 기능)

### 작업 목록

#### 3-1. 맞춤 추천 페이지 - 프론트엔드 (복잡도: 중간)
- ⬜ **건강 목표 선택 폼** (FR-12, S-04): `/recommend` 경로
  - 건강 목표 카드 선택 UI: 심폐기능 향상, 근력강화, 스트레스 해소, 인지능력 개선, 반응속도 훈련
  - 복수 선택 가능
  - "추천받기" 버튼
- ⬜ **추천 결과 목록** (FR-13):
  - 선택한 목표에 매칭되는 게임 카드 리스트
  - 매칭 점수 또는 관련도 표시
- ⬜ **AI 추천 이유 텍스트** (FR-14):
  - 각 게임별 "이 게임이 추천된 이유" 텍스트 표시
  - Claude API가 생성한 자연어 설명

#### 3-2. 맞춤 추천 - 백엔드 (복잡도: 중간)
- ⬜ **추천 API 엔드포인트**: `POST /api/recommend`
  - Request Body: `{ "healthGoals": ["심폐기능", "스트레스해소"] }`
  - 선택된 목표와 매칭되는 HealthTag 기반 게임 필터링
  - Claude API로 추천 이유 텍스트 생성 (선택적 캐싱)
  - Response: 게임 리스트 + 추천 이유 텍스트
- ⬜ **단위 테스트**: 추천 로직 테스트 (다양한 목표 조합)

#### 3-3. 검색 기능 - 프론트엔드 (복잡도: 중간)
- ⬜ **검색 결과 페이지** (S-03): `/search?q={keyword}` 경로
  - Header의 검색 입력과 연동
  - 게임 카드 리스트로 결과 표시
  - 검색 결과 하이라이팅 (FR-16): 매칭된 키워드를 볼드/색상 처리
  - "검색 결과가 없습니다" 빈 상태 UI
- ⬜ **검색 입력 UX**: debounce 적용 (300ms), 최소 2글자 이상

#### 3-4. 검색 기능 - 백엔드 (복잡도: 중간)
- ⬜ **검색 API 엔드포인트** (FR-15): `GET /api/games/search?q={keyword}`
  - 게임명, 건강 효과 태그, 카테고리에서 검색
  - LIKE 쿼리 또는 EF Core Contains 사용
  - 검색 결과에 매칭 필드 정보 포함 (하이라이팅용)
- ⬜ **단위 테스트**: 검색 서비스 테스트 (한글 검색, 태그 검색, 빈 결과)

### 완료 기준 (Definition of Done)
- ✅ 건강 목표 선택 후 맞춤 게임 추천 목록이 표시된다
- ✅ 각 추천 게임에 AI가 생성한 추천 이유 텍스트가 표시된다
- ✅ 키워드 검색으로 게임명, 태그, 카테고리 기반 결과가 반환된다
- ✅ 검색 결과에서 매칭 키워드가 하이라이팅된다
- ✅ 검색 결과 없음 상태가 올바르게 표시된다
- ✅ 추천/검색 관련 단위 테스트 통과

### Playwright MCP 검증 시나리오
> `npm run dev` + 백엔드 서버 실행 후 검증

**맞춤 추천 검증:**
1. `browser_navigate` -> `http://localhost:3000/recommend` 접속
2. `browser_snapshot` -> 건강 목표 카드들이 표시되는지 확인
3. `browser_click` -> "심폐기능 향상" 목표 카드 클릭
4. `browser_click` -> "스트레스 해소" 목표 카드 클릭
5. `browser_snapshot` -> 두 개 목표가 선택 상태인지 확인
6. `browser_click` -> "추천받기" 버튼 클릭
7. `browser_wait_for` -> 추천 결과 로딩 대기
8. `browser_snapshot` -> 추천 게임 카드 + 추천 이유 텍스트 존재 확인
9. `browser_console_messages(level: "error")` -> 에러 없음

**검색 기능 검증:**
1. `browser_navigate` -> `http://localhost:3000` 접속
2. `browser_click` -> Header 검색 입력 필드 클릭
3. `browser_type` -> "달리기" 입력
4. `browser_wait_for` -> 검색 결과 페이지 로딩 대기
5. `browser_snapshot` -> 검색 결과 카드 표시 + "달리기" 키워드 하이라이팅 확인
6. `browser_type` -> 검색 필드 클리어 후 "존재하지않는게임" 입력
7. `browser_wait_for` -> 결과 로딩 대기
8. `browser_snapshot` -> "검색 결과가 없습니다" 메시지 확인

**공통 검증:**
- `browser_network_requests` -> `/api/recommend`, `/api/games/search` 호출 200 응답
- `browser_console_messages(level: "error")` -> 콘솔 에러 없음

### 기술 고려사항
- **추천 이유 텍스트 캐싱**: 동일한 목표 조합에 대한 AI 응답을 캐싱하여 비용 절감 고려
- **검색 성능**: 현재 규모(수십~수백 게임)에서는 EF Core Contains로 충분. 전문 검색 엔진은 불필요 (Karpathy: 과도한 최적화 금지)
- **debounce**: 검색 입력에 300ms debounce 적용하여 불필요한 API 호출 방지

---

## Phase 4: 관리자 기능 + 안정화 (Sprint 4, 2주)

### 목표
관리자가 게임 데이터와 AI 태깅 결과를 관리할 수 있는 대시보드 구현. 성능 최적화 및 전체 안정화. (Nice to Have 기능)

### 작업 목록

#### 4-1. 관리자 대시보드 - 프론트엔드 (복잡도: 중간)
- ⬜ **관리자 대시보드 페이지** (S-05): `/admin` 경로
  - 전체 게임 수, 태깅 완료 수, 미태깅 수 요약 통계
  - 게임 목록 테이블 (이름, 카테고리, 태깅 상태, 등록일)
- ⬜ **게임 CRUD UI** (A-01):
  - 게임 추가 모달/페이지: 필드 입력 폼
  - 게임 수정 모달/페이지: 기존 데이터 편집
  - 게임 삭제 확인 다이얼로그
- ⬜ **AI 태그 관리** (A-02):
  - 게임별 AI 태그 결과 확인 (태그, 신뢰도, 분석 근거)
  - 태그 수동 수정/추가/삭제 기능
  - "AI 재분석" 버튼 (해당 게임의 태그를 Claude API로 재생성)
- ⬜ **데이터 수집 트리거** (A-03, FR-18):
  - "데이터 수집 시작" 버튼
  - 수집 진행 상태 표시 (진행 중/완료/실패)

#### 4-2. 관리자 대시보드 - 백엔드 (복잡도: 중간)
- ⬜ **관리자 API 엔드포인트**:
  - `GET /api/admin/stats` - 대시보드 통계
  - `POST /api/admin/games` - 게임 추가
  - `PUT /api/admin/games/{id}` - 게임 수정
  - `DELETE /api/admin/games/{id}` - 게임 삭제
  - `PUT /api/admin/games/{id}/tags` - 태그 수동 수정
  - `POST /api/admin/games/{id}/retag` - AI 재분석 트리거
  - `POST /api/admin/collect` - 데이터 수집 트리거 (Phase 2에서 생성, 여기서 UI 연결)
- ⬜ **FluentValidation**: 게임 추가/수정 입력값 검증
- ⬜ **단위 테스트**: 관리자 서비스 CRUD 테스트

#### 4-3. 성능 최적화 및 안정화 (복잡도: 중간)
- ⬜ **성능 최적화**:
  - 게임 목록 페이지네이션 (서버사이드)
  - 이미지 lazy loading 확인
  - API 응답 캐싱 (TanStack Query staleTime 설정)
  - 게임 목록 로드 3초 이내 달성 확인 (NF-01)
- ⬜ **에러 처리 강화**:
  - 글로벌 에러 바운더리 (프론트엔드)
  - API 타임아웃 처리
- ⬜ **접근성 검토**: 키보드 네비게이션, aria 라벨 확인
- ⬜ **기술 부채 정리**: Phase 1~3에서 발생한 TODO/FIXME 항목 해결

### 완료 기준 (Definition of Done)
- ✅ 관리자가 게임을 추가/수정/삭제할 수 있다
- ✅ 관리자가 AI 태그를 확인하고 수정할 수 있다
- ✅ 데이터 수집을 수동으로 트리거할 수 있다
- ✅ 게임 목록 페이지 로드가 3초 이내이다 (NF-01)
- ✅ 모든 페이지에서 콘솔 에러 없음
- ✅ `dotnet test` 전체 통과, 핵심 비즈니스 로직 테스트 커버리지 80% 이상

### Playwright MCP 검증 시나리오
> `npm run dev` + 백엔드 서버 실행 후 검증

**관리자 대시보드 검증:**
1. `browser_navigate` -> `http://localhost:3000/admin` 접속
2. `browser_snapshot` -> 통계 요약 (전체 게임 수, 태깅 완료 수) 표시 확인
3. `browser_snapshot` -> 게임 목록 테이블 존재 확인

**게임 CRUD 검증:**
1. `browser_click` -> "게임 추가" 버튼 클릭
2. `browser_fill_form` -> 게임명: "테스트 게임", 설명: "테스트 설명", 카테고리: "달리기" 입력
3. `browser_click` -> "저장" 버튼 클릭
4. `browser_wait_for` -> 저장 완료 대기
5. `browser_snapshot` -> 테이블에 "테스트 게임" 행 추가 확인
6. `browser_click` -> "테스트 게임" 행의 "수정" 버튼 클릭
7. `browser_type` -> 게임명을 "수정된 게임"으로 변경
8. `browser_click` -> "저장" 버튼 클릭
9. `browser_snapshot` -> "수정된 게임"으로 변경 확인
10. `browser_click` -> "수정된 게임" 행의 "삭제" 버튼 클릭
11. `browser_click` -> 삭제 확인 다이얼로그 "확인" 클릭
12. `browser_snapshot` -> 테이블에서 해당 행 제거 확인

**AI 태그 관리 검증:**
1. `browser_click` -> 게임 행의 "태그 관리" 클릭
2. `browser_snapshot` -> 기존 AI 태그 목록 (태그명, 신뢰도, 근거) 표시 확인
3. `browser_click` -> "AI 재분석" 버튼 클릭
4. `browser_wait_for` -> 재분석 완료 대기
5. `browser_snapshot` -> 태그가 갱신되었는지 확인

**공통 검증:**
- `browser_console_messages(level: "error")` -> 콘솔 에러 없음
- `browser_network_requests` -> 모든 관리자 API 호출 2xx 응답

### 기술 고려사항
- **관리자 인증**: 해커톤 범위에서는 단순 API Key 또는 하드코딩된 인증으로 시작. 추후 JWT 기반 인증 확장
- **삭제 시 연관 데이터 처리**: Game 삭제 시 HealthTag도 CASCADE 삭제
- **Karpathy Guidelines**: 관리자 기능은 기본 CRUD에 집중. 복잡한 권한 체계나 감사 로그는 향후 백로그로

---

## 의존성 맵

```
Phase 1 (프론트엔드 UI + Mock + 백엔드 기초)
  ├── 1-1. 프로젝트 초기 설정 ─────────────────┐
  │    (Next.js, ASP.NET Core, Docker)        │
  ├── 1-2. 공통 컴포넌트 ←── 1-1              │
  ├── 1-3. 게임 홈 페이지 ←── 1-2             │
  ├── 1-4. 게임 상세 페이지 ←── 1-2           │
  └── 1-5. 백엔드 기초 API ←── 1-1            │
                                               │
Phase 2 (AI 태깅 + 데이터 수집)                │
  ├── 2-1. Claude API 연동 ←── 1-5 ───────────┘
  ├── 2-2. 데이터 수집 파이프라인 ←── 1-5
  ├── 2-3. 유사 게임 추천 ←── 2-1
  └── 2-4. 프론트엔드 API 전환 ←── 1-3, 1-4, 1-5

Phase 3 (맞춤 추천 + 검색)
  ├── 3-1. 맞춤 추천 프론트엔드 ←── 1-2
  ├── 3-2. 맞춤 추천 백엔드 ←── 2-1
  ├── 3-3. 검색 프론트엔드 ←── 1-2
  └── 3-4. 검색 백엔드 ←── 1-5

Phase 4 (관리자 + 안정화)
  ├── 4-1. 관리자 프론트엔드 ←── 1-2
  ├── 4-2. 관리자 백엔드 ←── 1-5, 2-1, 2-2
  └── 4-3. 성능 최적화 ←── Phase 1~3 전체 완료
```

### 핵심 의존 경로 (Critical Path)
1. 프로젝트 초기 설정 (1-1) -> 백엔드 기초 API (1-5) -> Claude API 연동 (2-1) -> 유사 게임 추천 (2-3)
2. 프로젝트 초기 설정 (1-1) -> 공통 컴포넌트 (1-2) -> 게임 홈/상세 페이지 (1-3, 1-4) -> API 전환 (2-4)

---

## 리스크 및 완화 전략

| ID | 리스크 | 영향도 | 발생확률 | 완화 전략 |
|----|--------|--------|----------|-----------|
| R-01 | Google Play API 접근 제한으로 실제 게임 데이터 수집 불가 | 높음 | 높음 | Mock 데이터 20개 이상 준비. RapidAPI 대안 API 조사. 최악의 경우 수동 데이터 입력 |
| R-02 | Claude API 응답 형식이 불안정하여 파싱 실패 | 중간 | 중간 | 구조화된 JSON 응답 프롬프트 설계. 파싱 실패 시 기본값 적용. 재시도 로직 (최대 2회) |
| R-03 | Claude API 비용 초과 | 중간 | 낮음 | 게임당 1회 분석 후 DB 캐싱. 일일 API 호출 횟수 제한 설정 |
| R-04 | 해커톤 시간 내 Must Have 기능 미완성 | 높음 | 중간 | Phase 1-2를 MVP로 설정. Should/Nice to Have는 시간 여유 시에만 진행 |
| R-05 | 프론트엔드-백엔드 API 스펙 불일치 | 중간 | 중간 | Phase 1에서 Mock 데이터와 동일한 구조의 API 응답 설계. DTO 먼저 정의 후 구현 |
| R-06 | SQLite에서 PostgreSQL 전환 시 호환성 이슈 | 낮음 | 낮음 | EF Core 추상화로 DB 프로바이더 교체 용이. 마이그레이션 테스트 |

---

## 마일스톤

| 마일스톤 | 예상 완료일 | Phase | 설명 | 상태 |
|----------|-------------|-------|------|------|
| M1: 프론트엔드 UI 완성 | 2026-03-14 | Phase 1 | 게임 홈 + 상세 페이지 UI, Mock 데이터 기반 동작 | ✅ |
| M2: MVP 완성 | Sprint 2 종료 | Phase 2 | AI 태깅 + 실제 API 연동, 해커톤 데모 가능 상태 | 📋 |
| M3: Should Have 완성 | Sprint 3 종료 | Phase 3 | 맞춤 추천 + 검색 기능 추가 | 📋 |
| M4: 전체 기능 완성 | Sprint 4 종료 | Phase 4 | 관리자 대시보드 + 성능 최적화 + 안정화 | 📋 |

### MVP 범위 (Phase 1 + Phase 2)
- 게임 목록 페이지 (카테고리 필터, 정렬)
- 게임 상세 페이지 (기본 정보, 스토어 링크, AI 태그, 유사 게임)
- AI 건강 효과 태깅 (Claude API 연동)
- 실제 게임 데이터 (RapidAPI 또는 Mock)

---

## 향후 계획 (Backlog)

PRD의 Nice to Have 및 추가 확장 가능한 기능들.

| ID | 기능 | 설명 | 우선순위 |
|----|------|------|----------|
| B-01 | 게임 즐겨찾기 | 사용자별 즐겨찾기 기능 (로컬스토리지 또는 계정 기반) | Nice to Have |
| B-02 | 건강 알림 | 주기적 건강 게임 추천 알림 | Nice to Have |
| B-03 | 사용자 인증 | JWT 기반 로그인/회원가입, 관리자 권한 분리 | 확장 |
| B-04 | 주기적 자동 수집 | FR-18의 배치 스케줄러 (Hangfire 또는 BackgroundService) | 확장 |
| B-05 | 사용자 리뷰/평가 | 게임에 대한 사용자 건강 효과 후기 작성 | 확장 |
| B-06 | 다국어 지원 | 영어 등 다국어 UI 지원 | 확장 |
| B-07 | 전문 검색 엔진 | Elasticsearch 또는 Meilisearch 도입 (게임 수 1000+ 시) | 확장 |
| B-08 | 분석 대시보드 | 사용자 행동 분석, 인기 태그 통계 | 확장 |
| B-09 | PWA 지원 | 모바일 앱 경험 제공 (오프라인 캐싱) | 확장 |
| B-10 | App Store 데이터 수집 | iOS App Store 게임 데이터 수집 확장 | 확장 |

---

## 기술 부채 관리

| Phase | 예상 기술 부채 | 해결 시점 |
|-------|---------------|-----------|
| Phase 1 | Mock 데이터 하드코딩, 관리자 인증 미구현 | Phase 2에서 API 전환, Phase 4에서 인증 추가 |
| Phase 2 | Claude API 프롬프트 최적화 필요, 에러 핸들링 미흡할 수 있음 | Phase 4 안정화에서 개선 |
| Phase 3 | 검색 성능 최적화 미적용 (소규모 데이터 기준) | Backlog B-07로 이관 |
| Phase 4 | TODO/FIXME 잔여 항목 | Phase 4에서 일괄 정리 |

---

## 개발 가이드라인 (Karpathy Guidelines 적용)

### 1. Think Before Coding
- 각 Phase 시작 전 writing-plans 스킬로 세부 구현 계획 수립
- 기술적 불확실성(Claude API 응답 형식, RapidAPI 제한)은 Phase 2 초반에 PoC로 검증

### 2. Simplicity First
- Clean Architecture 레이어는 유지하되, 각 레이어 내부는 최소한의 코드로 구현
- 단일 용도 코드에 불필요한 인터페이스 추가 금지 (CLAUDE.md 규칙과의 균형: 서비스는 인터페이스 먼저 정의)
- 에러 처리는 발생 가능한 시나리오만 처리. 이론적 에러에 대한 방어 코드 금지

### 3. Surgical Changes
- Phase 간 코드 수정 시 기존 동작을 보존하면서 점진적으로 확장
- Mock -> 실제 API 전환 시 변경 지점을 최소화 (queryFn만 교체)

### 4. Goal-Driven Execution
- 각 태스크는 "완료 기준"과 "Playwright MCP 검증 시나리오"로 성공 여부를 객관적으로 판단
- `dotnet test`, `npm run build`, 콘솔 에러 없음이 기본 검증 기준
