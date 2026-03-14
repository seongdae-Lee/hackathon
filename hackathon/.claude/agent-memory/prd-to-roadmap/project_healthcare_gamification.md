---
name: healthcare-gamification-curator
description: 헬스케어 게이미피케이션 큐레이터 프로젝트 - PRD 분석 및 ROADMAP 생성 기록
type: project
---

프로젝트 "헬스케어 게이미피케이션 큐레이터"의 ROADMAP.md를 2026-03-14에 최초 생성함.

**핵심 결정사항:**
- 4 Phase / 4 Sprint 구조로 설계 (해커톤 MVP는 Phase 1-2)
- Phase 1: 프론트엔드 UI + Mock 데이터 + 백엔드 기초 (프론트 우선 개발)
- Phase 2: Claude API AI 태깅 + 데이터 수집 + API 전환 (MVP 완성)
- Phase 3: 맞춤 추천 + 검색 (Should Have)
- Phase 4: 관리자 대시보드 + 안정화 (Nice to Have)

**기술 스택 결정:**
- PRD는 React + TailwindCSS이나, CLAUDE.md 코딩 표준에 따라 Next.js + TypeScript로 결정
- 백엔드: ASP.NET Core 8 + C# 12 + Clean Architecture
- DB: SQLite(개발) / PostgreSQL(운영)
- AI: Claude API (건강 효과 태깅, 추천 이유 생성)
- 게임 데이터: Mock 데이터 우선, RapidAPI 전환 (Google Play API 제한 때문)

**Why:** 해커톤 프로젝트이므로 빠른 프로토타이핑이 중요. Mock 데이터 우선 접근으로 프론트엔드 검토를 먼저 받는 전략.
**How to apply:** 스프린트 계획 시 항상 프론트엔드 UI를 먼저 완성하여 사용자 피드백을 받은 후 백엔드를 완성하는 순서 유지.
