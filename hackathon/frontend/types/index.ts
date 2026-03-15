// 건강 효과 태그 타입
export interface HealthTag {
  id: number
  tag: string
  confidence: number
  aiDescription: string | null  // AI 분석 전 null일 수 있음
  isAiAnalyzed: boolean
}

// 게임 타입
export interface Game {
  id: number
  name: string
  description: string
  developer: string
  iconUrl: string
  rating: number
  downloadCount: number
  category: string
  playStoreUrl: string | null
  appStoreUrl: string | null
  createdAt: string
  healthTags: HealthTag[]
}

// 페이지네이션 응답 타입
export interface PagedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  code?: string
}

// 검색 결과 타입
export interface SearchResult {
  game: Game
  matchedFields: string[]   // "name", "category", "tag"
  matchedKeyword: string
}

// 추천 결과 항목 타입
export interface RecommendResultItem {
  game: Game
  matchScore: number
  recommendReason: string
}

// 맞춤 추천 응답 타입
export interface RecommendResponse {
  selectedGoals: string[]
  games: RecommendResultItem[]
}

// 관리자 통계 타입
export interface AdminStats {
  totalGames: number
  analyzedGames: number
  unanalyzedGames: number
}

// 관리자 게임 DTO 타입
export interface AdminGame {
  id: number
  name: string
  description: string
  developer: string
  iconUrl: string
  rating: number
  downloadCount: number
  category: string
  playStoreUrl: string | null
  appStoreUrl: string | null
  createdAt: string
  isAiAnalyzed: boolean
  healthTags: HealthTag[]
}

// 게임 생성/수정 요청 타입
export interface GameFormData {
  name: string
  description: string
  developer: string
  category: string
  rating: number
  downloadCount: number
  iconUrl: string
  playStoreUrl: string | null
  appStoreUrl: string | null
}

// 관리자 로그인 응답 타입
export interface LoginResponse {
  token: string
  expiresAt: string  // ISO 8601 UTC 문자열
}

// 정렬 옵션
export type SortOption = 'popular' | 'rating' | 'latest'

// 카테고리 목록 (고정값 + API에서 동적으로 가져옴)
export const SORT_OPTIONS = [
  { value: 'popular' as SortOption, label: '인기순' },
  { value: 'rating' as SortOption, label: '평점순' },
  { value: 'latest' as SortOption, label: '최신순' },
] as const
