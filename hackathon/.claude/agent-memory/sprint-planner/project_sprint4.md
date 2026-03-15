---
name: Sprint 4 계획 및 프로젝트 현황
description: Sprint 4(관리자 대시보드 + 성능 최적화 + 안정화) 계획 수립 시 파악한 프로젝트 현황 및 설계 결정 사항
type: project
---

## Sprint 현황 (2026-03-15 기준)

- Sprint 1: 완료 (프론트엔드 UI + 백엔드 기초 API)
- Sprint 2: 완료 (AI 태깅 + 데이터 수집 파이프라인 + 유사 게임 추천)
- Sprint 3: 완료 (맞춤 추천 + 검색 기능 — FR-12~16, 테스트 29개)
- Sprint 4: 예정 (관리자 대시보드 + 성능 최적화 + 안정화)

**Why:** ROADMAP.md Phase 4가 Nice to Have 관리자 대시보드 + 안정화. Must Have 11/11, Should Have 6/6 전체 달성.

**How to apply:** Sprint 4가 현재 진행 중. 다음 스프린트는 없음 (M4: 전체 기능 완성 마일스톤).

---

## 기술 스택 (확정)

- 백엔드: C# 12, .NET 9, Clean Architecture, EF Core + SQLite, Serilog, xUnit + Moq, FluentValidation
- 프론트엔드: Next.js App Router, TypeScript strict, Tailwind CSS, TanStack Query
- AI: Anthropic Claude API (HttpClient 직접 호출, API 키 없으면 Mock Graceful degradation)
- 배포: Docker Compose

---

## Sprint 4 핵심 설계 결정

- 관리자 인증: 해커톤 범위에서 미구현 (Backlog B-03으로 이관)
- FluentValidation: 게임 추가/수정 — 필수 필드, 최대 200/2000자, 평점 0~5 범위
- 모달 구현: 별도 라이브러리 없이 Tailwind CSS + useState (GameFormModal mode: 'create'|'edit')
- CASCADE 삭제: EF Core 설정으로 Game 삭제 시 HealthTag 자동 삭제
- TanStack Query staleTime: 게임 목록 5분, 상세 10분
- 에러 바운더리: Next.js App Router app/error.tsx 파일 생성 방식

---

## 기존 서비스 인터페이스 (Sprint 3 완료)

- IClaudeApiService, IGameRecommendationService, IGameDataCollectorService
- IGameSearchService (Sprint 3 신규)
- IHealthGoalRecommendService (Sprint 3 신규)
- 기존 AdminController: POST /api/admin/analyze/{id}, POST /api/admin/analyze/all, POST /api/admin/collect
- HealthTagType 상수: #심폐기능, #근력강화, #스트레스해소, #인지개선, #반응훈련

---

## 테스트 현황

- Sprint 3 완료 기준: 29개
- Sprint 4 목표: 37개 이상 (신규 8개: AdminServiceTests)

---

## Sprint 4 신규 파일 목록 (계획)

### 백엔드
- Application/DTOs/AdminDto.cs
- Application/Interfaces/IAdminService.cs
- Application/Services/AdminService.cs
- Application/Validators/CreateGameRequestValidator.cs
- Application/Validators/UpdateGameRequestValidator.cs
- Tests/Services/AdminServiceTests.cs

### 프론트엔드
- app/admin/page.tsx
- app/error.tsx (글로벌 에러 바운더리)
- components/admin/StatsCard.tsx
- components/admin/GameTable.tsx
- components/admin/GameFormModal.tsx
- components/admin/DeleteConfirmDialog.tsx
- components/admin/AiTagPanel.tsx
- components/admin/index.ts
- hooks/useAdmin.ts
