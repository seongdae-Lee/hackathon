---
name: sprint1_context
description: Sprint 1 계획 수립 완료 - 헬스케어 게이미피케이션 큐레이터 Phase 1 정보
type: project
---

Sprint 1 계획이 `docs/sprint/sprint1.md`에 저장됨 (2026-03-14 기준).

**Why:** ROADMAP.md Phase 1 (프론트엔드 UI + Mock 데이터, 2주)을 기반으로 수립.

**How to apply:** 다음 스프린트(Sprint 2) 계획 수립 시 Sprint 1 완료 여부와 Phase 2 목표(AI 태깅 + 백엔드 완성)를 반영할 것.

## 스프린트 현황
- Sprint 1: 계획 수립 완료 (2026-03-14 ~ 2026-03-27 예정)
- Sprint 2~4: 미시작 (ROADMAP.md Phase 2~4)

## 프로젝트 핵심 정보
- 프로젝트명: 헬스케어 게이미피케이션 큐레이터
- 목표: 건강 목표 달성에 도움되는 게임을 AI 기반으로 큐레이션
- 전체 4 스프린트 (8주), 해커톤 MVP = Sprint 1~2
- 기술 스택: Next.js 14 + TypeScript / ASP.NET Core 8 C# / SQLite → PostgreSQL / Docker Compose
- 상태관리: TanStack Query(서버) + Zustand(클라이언트)
- 테스트: xUnit + Moq + FluentAssertions
- 아키텍처: Clean Architecture (API → Application → Domain → Infrastructure)

## Task 구성 (Sprint 1)
- Task 1-1: 프로젝트 초기 설정 (1.5일)
- Task 1-2: 백엔드 Domain/Application/Infrastructure 레이어 (1.5일)
- Task 1-3: 백엔드 API 컨트롤러 + 미들웨어 (0.5일)
- Task 1-4: 프론트엔드 공통 레이아웃 + 컴포넌트 (1.5일)
- Task 1-5: 게임 홈 페이지 (1일)
- Task 1-6: 게임 상세 페이지 (1일)
