---
name: Sprint 3 계획 및 프로젝트 현황
description: Sprint 3(맞춤 추천 + 검색) 계획 수립 시 파악한 프로젝트 현황 및 설계 결정 사항
type: project
---

## Sprint 현황 (2026-03-15 기준)

- Sprint 1: 완료 (프론트엔드 UI + 백엔드 기초 API)
- Sprint 2: 완료 (AI 태깅 + 데이터 수집 파이프라인 + 유사 게임 추천)
- Sprint 3: 예정 (맞춤 추천 + 검색 기능 — FR-12~16)
- Sprint 4: 예정 (관리자 대시보드 + 안정화)

**Why:** ROADMAP.md Phase 3이 Should Have 기능으로 분류되어 있으며, Sprint 2 완료로 Must Have 11/11 달성 후 진행.

**How to apply:** 다음 스프린트 번호는 4. Sprint 4는 Phase 4(관리자 + 안정화).

---

## 기술 스택 (확정)

- 백엔드: C# 12, .NET 9, Clean Architecture, EF Core + SQLite, Serilog, xUnit + Moq
- 프론트엔드: Next.js App Router, TypeScript strict, Tailwind CSS, TanStack Query
- AI: Anthropic Claude API (HttpClient 직접 호출, API 키 없으면 Mock Graceful degradation)
- 배포: Docker Compose

---

## Sprint 3 핵심 설계 결정

- 검색: EF Core Contains로 구현 (전문 검색 엔진 불필요 — 소규모 데이터)
- 추천: HealthTagType 상수(5개) 기반 OR 조건 필터링 + Claude API 추천 이유 생성
- 캐싱: 추천 이유 텍스트는 동일 목표 조합 key로 캐싱 고려 (Sprint 3에서 최소 구현, Phase 4 개선)
- debounce: 검색 입력 300ms, 최소 2글자

---

## 기존 서비스 인터페이스 (Sprint 2 완료)

- IClaudeApiService — Claude API HttpClient 호출
- IGameRecommendationService — 유사 게임 추천 (Confidence 가중 유사도)
- IGameDataCollectorService — 게임 데이터 수집 (Mock/RapidAPI)
- HealthTagType 상수: #심폐기능, #근력강화, #스트레스해소, #인지개선, #반응훈련

---

## 테스트 현황

- Sprint 2 완료 기준: 17개 (GameServiceTests 8 + ClaudeApiServiceTests 3 + GameRecommendationServiceTests 4 + GameDataCollectorServiceTests 2)
- Sprint 3 목표: 29개 이상 (신규 12개: GameSearchServiceTests 6 + HealthGoalRecommendServiceTests 6)
