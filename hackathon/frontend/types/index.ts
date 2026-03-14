// 건강 효과 태그 타입
export interface HealthTag {
  id: number
  tag: string
  confidence: number
  aiDescription: string
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

// 정렬 옵션
export type SortOption = 'popular' | 'rating' | 'latest'

// 카테고리 목록 (고정값 + API에서 동적으로 가져옴)
export const SORT_OPTIONS = [
  { value: 'popular' as SortOption, label: '인기순' },
  { value: 'rating' as SortOption, label: '평점순' },
  { value: 'latest' as SortOption, label: '최신순' },
] as const
