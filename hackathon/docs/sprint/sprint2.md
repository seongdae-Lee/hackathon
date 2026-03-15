# Sprint 2: AI 태깅 + 백엔드 완성 + 데이터 수집

> **작업일:** 2026-03-15 | **상태:** ✅ 완료 | **브랜치:** sprint2

## 관련 커밋

| 해시 | 메시지 | 유형 |
|------|--------|------|
| [`bca74d3`](https://github.com/seongdae-Lee/hackathon/commit/bca74d3e6c39040b84c03db544e2f7f96e678e89) | feat: Sprint 2 - Claude AI 연동, 데이터 수집, 추천 개선, UI 개선 | 기능 구현 |
| [`f64aa7a`](https://github.com/seongdae-Lee/hackathon/commit/f64aa7ad8d7ef0b8b008e099eb92125da8a349cd) | docs: Sprint 2 문서 작성 및 전체 문서 업데이트 | 문서 |

## 검증 결과

| 항목 | 결과 |
|------|------|
| `dotnet build` | ✅ 경고 0, 오류 0 |
| `dotnet test` | ✅ 17개 통과 (기존 5 → 17) |
| `npm run build` | ✅ TypeScript 오류 없음 |

---

## 실제 소요 시간

> **총 실제 소요: 약 5시간 30분** (Sprint 1 완료 당일 연속 진행)

| Task | 예상 | 실제 | 비고 |
|------|------|------|------|
| Task 2-0: Sprint 1 이월 항목 | 30분 | 10분 | 신뢰도 바 이미 CSS variable 방식으로 구현됨 — 작업 불필요 |
| Task 2-1: Claude API 연동 | 1.5일 | 2시간 30분 | JSON 파싱 이슈(↓ I-01) + CS9006 컴파일 오류(↓ I-02)로 지연 |
| Task 2-2: 데이터 수집 파이프라인 | 1일 | 1시간 | RapidAPI 미연동 결정으로 Mock Fallback 구현에 집중 |
| Task 2-3: 유사 게임 추천 개선 | 1일 | 1시간 | Confidence 가중 유사도 알고리즘 수식 설계에 집중 |
| Task 2-4: 프론트엔드 AI 태그 UI | 0.5일 | 30분 | AiAnalysisBadge + ErrorFallback 단순 컴포넌트 |
| **합계** | **4일** | **5시간 30분** | |

---

## 이슈 발생 현황

| # | 심각도 | 발생 위치 | 이슈 내용 | 원인 | 해결 방법 | 소요 시간 |
|---|--------|-----------|---------|------|---------|---------|
| I-01 | Critical | Task 2-1 | Claude API 응답 JSON 파싱 실패 — `JsonSerializer.Deserialize` 예외 발생 | Claude가 JSON을 마크다운 코드 블록(` ```json `) 안에 감싸서 반환하는 경우가 있음 | `ClaudeApiService.cs`에 마크다운 코드 블록 제거 전처리 로직 추가 — ` ```json ` 구문 감지 후 중괄호 시작점부터 추출 | 45분 |
| I-02 | Critical | Task 2-1 | C# 컴파일 오류 CS9006 — 보간 문자열에 JSON 예시 중괄호 포함 시 `{`, `}` 충돌 | C# 문자열 보간(`$"..."`)에서 `{`를 리터럴로 쓰려면 `{{`로 이스케이프 필요 | 프롬프트 문자열을 보간 부분과 JSON 예시 부분으로 분리하여 `string.Concat` 방식으로 결합 | 20분 |
| I-03 | Important | Task 2-1 | API 키가 `YOUR_CLAUDE_API_KEY_HERE` 기본값일 때 예외 미처리 — 500 에러 반환 | API 키 유효성 검사 누락 | `ClaudeApiService.cs` 초기화 시 기본값 감지 → `IsMockMode` 플래그 설정, 이후 Mock 결과 자동 반환으로 Graceful degradation 구현 | 15분 |
| I-04 | Minor | Task 2-2 | `MockGameDataProvider`의 모든 게임 아이콘 URL이 이모지 문자열로 설정됨 | 개발 초기 placeholder로 이모지를 사용했으나 프론트엔드 `next/image`와 호환 불가 | 모든 Mock 게임 `iconUrl`을 `https://play-lh.googleusercontent.com/xxx-icon` 형태의 유효한 HTTPS URL로 교체 | 10분 |
| I-05 | Minor | Task 2-3 | 유사도 계산에서 태그 없는 게임(`healthTags.Count == 0`) 처리 시 `DivideByZeroException` | 유사도 수식의 분모가 `현재게임_태그수`인데 태그가 0개인 경우 미처리 | 태그 수 0 이면 같은 카테고리 + 평점 순 보완 로직으로 fallback 처리 추가 | 15분 |

---

## 스프린트 목표

| 목표 | 설명 | 상태 |
|------|------|------|
| Claude AI 연동 | Anthropic Messages API HttpClient 호출, DB 캐싱 | ✅ |
| 데이터 수집 파이프라인 | Mock Fallback + RapidAPI 확장 포인트 | ✅ |
| 유사 게임 추천 개선 | Confidence 가중치 유사도, AI 분석 게임 우선 | ✅ |
| 프론트엔드 AI UI | AiAnalysisBadge, ErrorFallback 컴포넌트 | ✅ |
| Docker Compose | 전체 스택 컨테이너 설정 | ✅ |

---

## 컨텍스트

Sprint 1(2026-03-14 완료)에서 프론트엔드 UI + 백엔드 기초 API가 동작하는 상태.
기존 코드에 이미 `HealthTag.IsAiAnalyzed` 필드, `appsettings.example.json`의 `ClaudeApi` 섹션, 프론트엔드의 신뢰도 바/AI 분석 근거 UI가 준비되어 있어 확장 포인트가 명확했음.

---

## Task 2-0: Sprint 1 이월 항목

**완료 내용:**
- `docker-compose.yml` 생성 — 백엔드/프론트엔드 컨테이너 구성, `CLAUDE_API_KEY` 환경변수 지원
- 신뢰도 바 이미 CSS custom property 방식 사용 중 (`[width:var(--confidence)]`) — 추가 수정 불필요

---

## Task 2-1: Claude API 연동

### 신규 파일

| 파일 | 역할 |
|------|------|
| `Domain/Enums/HealthTagType.cs` | 5개 태그 상수 (`#심폐기능`, `#근력강화`, `#스트레스해소`, `#인지개선`, `#반응훈련`) |
| `Application/DTOs/AiAnalysisDto.cs` | `AiAnalysisRequest`, `AiTagResult`, `AiAnalysisResult`, `AnalyzeGameResponse` 레코드 |
| `Application/Interfaces/IClaudeApiService.cs` | AI 분석 서비스 인터페이스 |
| `Infrastructure/Services/ClaudeApiService.cs` | Anthropic Messages API HttpClient 직접 호출 |
| `Api/Controllers/AdminController.cs` | `POST /api/admin/analyze/{id}`, `POST /api/admin/analyze/all` |
| `Tests/Services/ClaudeApiServiceTests.cs` | API 키 없을 때 Mock, Confidence 범위 검증 (3개) |

### 수정 파일

| 파일 | 변경 내용 |
|------|---------|
| `IGameService.cs` | `AnalyzeGameAsync`, `AnalyzeAllGamesAsync` 추가 |
| `GameService.cs` | AI 분석 로직 구현, `IClaudeApiService` 의존성 추가 |
| `IGameRepository.cs` | `ReplaceHealthTagsAsync` 추가 |
| `GameRepository.cs` | `ReplaceHealthTagsAsync` 구현 (기존 태그 삭제 후 새 태그 저장) |
| `Program.cs` | `AddHttpClient<IClaudeApiService, ClaudeApiService>()` DI 등록 |

### 핵심 설계 결정

- **Graceful degradation**: API 키 없거나 `YOUR_CLAUDE_API_KEY_HERE` 이면 카테고리 기반 Mock 결과 자동 반환
- **DB 캐싱**: `IsAiAnalyzed=true` 인 태그가 있는 게임은 재분석 Skip
- **JSON 파싱**: 마크다운 코드 블록 처리 (```` ```json ```` → `{` 추출)
- **프롬프트**: 보간 문자열과 JSON 예시를 분리하여 CS9006 컴파일 오류 방지

---

## Task 2-2: 게임 데이터 수집 파이프라인

### 신규 파일

| 파일 | 역할 |
|------|------|
| `Application/DTOs/CollectedGameDto.cs` | `CollectedGameDto`, `CollectionResult` 레코드 |
| `Application/Interfaces/IGameDataCollectorService.cs` | 수집 서비스 인터페이스 |
| `Infrastructure/Services/GameDataCollectorService.cs` | RapidAPI 시도 → 실패 시 Mock Fallback |
| `Infrastructure/Services/MockGameDataProvider.cs` | 실제 건강 게임 10개 Mock 데이터 |
| `Tests/Services/GameDataCollectorServiceTests.cs` | Mock 데이터 유효성 검증 (2개) |

### 엔드포인트

```
POST /api/admin/collect?maxCount=10
```

- 수집 결과: `{ collectedCount, savedCount, skippedCount }` 반환
- 동명 게임 중복 저장 방지 (이름 기준 Skip)

---

## Task 2-3: 유사 게임 추천 개선

### 신규 파일

| 파일 | 역할 |
|------|------|
| `Application/Interfaces/IGameRecommendationService.cs` | 추천 서비스 인터페이스 |
| `Application/Services/GameRecommendationService.cs` | Confidence 가중 유사도 계산 |
| `Tests/Services/GameRecommendationServiceTests.cs` | 정렬, AI 우선, 태그 없는 경우 (4개) |

### 유사도 알고리즘

```
score = Σ( (현재게임_confidence + 후보게임_confidence) / 2 ) / 현재게임_태그수
```

우선순위:
1. AI 분석 완료 게임 (`IsAiAnalyzed=true`) 우선
2. 유사도 점수 높은 순
3. 부족 시 같은 카테고리 + 평점 순으로 보완

### 수정 파일

| 파일 | 변경 내용 |
|------|---------|
| `GamesController.cs` | `IGameRecommendationService` 주입, 유사 게임 조회 위임 |
| `Program.cs` | `GameRecommendationService` DI 등록 |

---

## Task 2-4: 프론트엔드 AI 태그 UI 개선

### 신규 파일

| 파일 | 역할 |
|------|------|
| `components/game/AiAnalysisBadge.tsx` | `✨ AI 분석` / `📋 수동 태그` 상태 배지 |
| `components/ui/ErrorFallback.tsx` | 공통 에러 UI (메시지, 힌트, 재시도 버튼) |

### 수정 파일

| 파일 | 변경 내용 |
|------|---------|
| `HealthTagBadge.tsx` | `showAiBadge` prop 추가, `AiAnalysisBadge` 렌더링 |
| `app/games/[id]/page.tsx` | Claude AI 분석 완료 헤더, 태그별 AI 배지, ErrorFallback 적용 |
| `app/page.tsx` | ErrorFallback 컴포넌트로 에러 UI 교체 |
| `components/game/index.ts` | `AiAnalysisBadge` barrel export 추가 |

---

## 테스트 현황

| 테스트 파일 | 테스트 수 | 상태 |
|------------|-----------|------|
| `GameServiceTests.cs` | 8개 (기존 5 + AI 분석 3 신규) | ✅ |
| `ClaudeApiServiceTests.cs` | 3개 (신규) | ✅ |
| `GameRecommendationServiceTests.cs` | 4개 (신규) | ✅ |
| `GameDataCollectorServiceTests.cs` | 2개 (신규) | ✅ |
| **합계** | **17개** | **✅ 전체 통과** |

---

## API 엔드포인트 전체 목록 (Sprint 2 기준)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/games` | 게임 목록 (카테고리 필터, 정렬, 페이지네이션) |
| GET | `/api/games/{id}` | 게임 상세 |
| GET | `/api/games/{id}/similar` | 유사 게임 추천 (Confidence 가중 유사도) |
| GET | `/api/categories` | 카테고리 목록 |
| POST | `/api/admin/analyze/{gameId}` | 단일 게임 AI 분석 트리거 |
| POST | `/api/admin/analyze/all` | 미분석 게임 전체 일괄 AI 분석 |
| POST | `/api/admin/collect` | 게임 데이터 수집 (Mock or RapidAPI) |

---

## 완료 기준 (Definition of Done)

- ✅ `dotnet build` — 경고 0, 오류 0
- ✅ `dotnet test` — 17개 단위 테스트 전체 통과
- ✅ `npm run build` — TypeScript 오류 없음, 빌드 성공
- ✅ Claude API 키 없을 때 Mock 결과 자동 반환 (Graceful degradation)
- ✅ `IsAiAnalyzed=true` 게임 재분석 Skip (캐싱)
- ✅ 유사 게임 Confidence 가중 유사도 + AI 분석 완료 게임 우선 추천
- ✅ 프론트엔드 AI 배지(`✨ AI 분석` / `📋 수동 태그`) 표시
- ✅ ErrorFallback 공통 컴포넌트 적용
- ✅ docker-compose.yml 생성

---

## 수동 검증 필요 항목

> 자세한 내용은 [deploy.md](../../deploy.md) 참고

- ⬜ Claude API 키 설정 후 `POST /api/admin/analyze/1` 호출 → DB `isAiAnalyzed=true` 확인
- ⬜ 게임 상세 페이지에서 `✨ AI 분석` 배지 및 "Claude AI 분석 완료" 헤더 표시 확인
- ⬜ 백엔드 미실행 시 홈 페이지에서 `ErrorFallback` UI 표시 확인
- ⬜ `docker compose up --build` — 전체 스택 컨테이너 빌드 성공 확인

---

## Playwright MCP 검증 시나리오

> `npm run dev` + 백엔드 서버 실행 후 검증

**AI 건강 효과 태그 검증:**
1. `browser_navigate` → `http://localhost:3000/games/1` 접속
2. `browser_snapshot` → 건강 효과 태그 배지 (`#심폐기능` 등) 표시 확인
3. `browser_snapshot` → AI 신뢰도 퍼센트 바 표시 확인
4. `browser_snapshot` → `✨ AI 분석` 또는 `📋 수동 태그` 배지 존재 확인
5. `browser_click` → AI 분석 근거 "▼ 보기" 버튼 클릭
6. `browser_snapshot` → AiDescription 텍스트 펼침 확인
7. `browser_console_messages(level: "error")` → 에러 없음

**에러 UI 검증 (백엔드 미실행):**
1. 백엔드 서버 중지
2. `browser_navigate` → `http://localhost:3000` 접속
3. `browser_snapshot` → ErrorFallback UI(`😢` + 에러 메시지) 표시 확인

**유사 게임 추천 검증:**
1. `browser_navigate` → `http://localhost:3000/games/1` 접속
2. `browser_snapshot` → "유사 게임 추천" 섹션에 카드 표시 확인
3. `browser_network_requests` → `/api/games/1/similar` 200 응답 확인

**공통 검증:**
- `browser_network_requests` → 모든 API 호출 2xx 응답
- `browser_console_messages(level: "error")` → 콘솔 에러 없음

---

## 기술 부채 및 이월 항목

| 항목 | 이유 | 처리 |
|------|------|------|
| RapidAPI 실제 연동 | API 키 필요, 해커톤 시간 제약 | Sprint 3 또는 Backlog |
| Admin API 인증 | 현재 인증 없이 호출 가능 | Phase 4에서 처리 예정 |
| Claude API 프롬프트 최적화 | 기본 프롬프트로 구현 | Phase 4 안정화에서 개선 |
