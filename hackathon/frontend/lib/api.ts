import axios from 'axios'
import { AdminGame, AdminStats, ApiResponse, Game, GameFormData, PagedResult, RecommendResponse, SearchResult, SortOption } from '@/types'

// 백엔드 API 베이스 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10초 타임아웃 - 무한 대기 방지
})

// 게임 목록 조회
export async function fetchGames(params: {
  category?: string
  sort?: SortOption
  page?: number
  pageSize?: number
}): Promise<PagedResult<Game>> {
  const { data } = await apiClient.get<ApiResponse<PagedResult<Game>>>('/api/games', {
    params: {
      category: params.category || undefined,
      sort: params.sort ?? 'popular',
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 20,
    },
  })

  if (!data.success || !data.data) {
    throw new Error(data.error ?? '게임 목록을 가져오는데 실패했습니다.')
  }
  return data.data
}

// 게임 상세 조회
export async function fetchGame(id: number): Promise<Game> {
  const { data } = await apiClient.get<ApiResponse<Game>>(`/api/games/${id}`)
  if (!data.success || !data.data) {
    throw new Error(data.error ?? '게임 정보를 가져오는데 실패했습니다.')
  }
  return data.data
}

// 유사 게임 조회
export async function fetchSimilarGames(id: number): Promise<Game[]> {
  const { data } = await apiClient.get<ApiResponse<Game[]>>(`/api/games/${id}/similar`)
  if (!data.success || !data.data) {
    throw new Error(data.error ?? '유사 게임을 가져오는데 실패했습니다.')
  }
  return data.data
}

// 카테고리 목록 조회
export async function fetchCategories(): Promise<string[]> {
  const { data } = await apiClient.get<ApiResponse<string[]>>('/api/categories')
  if (!data.success || !data.data) {
    throw new Error(data.error ?? '카테고리 목록을 가져오는데 실패했습니다.')
  }
  return data.data
}

// 게임 키워드 검색 (2글자 미만은 빈 배열 반환, 최대 100자 제한)
export async function searchGames(query: string): Promise<SearchResult[]> {
  const trimmed = query.trim().slice(0, 100)
  if (trimmed.length < 2) return []

  const { data } = await apiClient.get<ApiResponse<SearchResult[]>>('/api/games/search', {
    params: { q: trimmed },
  })
  if (!data.success || !data.data) {
    throw new Error(data.error ?? '검색에 실패했습니다.')
  }
  return data.data
}

// 건강 목표 기반 맞춤 추천
export async function fetchRecommendations(healthGoals: string[]): Promise<RecommendResponse> {
  const { data } = await apiClient.post<ApiResponse<RecommendResponse>>('/api/recommend', {
    healthGoals,
  })
  if (!data.success || !data.data) {
    throw new Error(data.error ?? '추천 정보를 가져오는데 실패했습니다.')
  }
  return data.data
}

// 관리자 통계 조회
export async function fetchAdminStats(): Promise<AdminStats> {
  const { data } = await apiClient.get<ApiResponse<AdminStats>>('/api/admin/stats')
  if (!data.success || !data.data) {
    throw new Error(data.error ?? '통계를 가져오는데 실패했습니다.')
  }
  return data.data
}

// 관리자 전체 게임 목록 조회
export async function fetchAdminGames(): Promise<AdminGame[]> {
  const { data } = await apiClient.get<ApiResponse<AdminGame[]>>('/api/admin/games')
  if (!data.success || !data.data) {
    throw new Error(data.error ?? '게임 목록을 가져오는데 실패했습니다.')
  }
  return data.data
}

// 게임 추가
export async function createGame(formData: GameFormData): Promise<AdminGame> {
  const { data } = await apiClient.post<ApiResponse<AdminGame>>('/api/admin/games', formData)
  if (!data.success || !data.data) {
    throw new Error(data.error ?? '게임 추가에 실패했습니다.')
  }
  return data.data
}

// 게임 수정
export async function updateGame(id: number, formData: GameFormData): Promise<AdminGame> {
  const { data } = await apiClient.put<ApiResponse<AdminGame>>(`/api/admin/games/${id}`, formData)
  if (!data.success || !data.data) {
    throw new Error(data.error ?? '게임 수정에 실패했습니다.')
  }
  return data.data
}

// 게임 삭제
export async function deleteGame(id: number): Promise<void> {
  const { data } = await apiClient.delete<ApiResponse<null>>(`/api/admin/games/${id}`)
  if (!data.success) {
    throw new Error(data.error ?? '게임 삭제에 실패했습니다.')
  }
}

// AI 분석 트리거 (단일 게임)
export async function analyzeGame(gameId: number): Promise<void> {
  const { data } = await apiClient.post<ApiResponse<unknown>>(`/api/admin/analyze/${gameId}`)
  if (!data.success) {
    throw new Error(data.error ?? 'AI 분석에 실패했습니다.')
  }
}

// 데이터 수집 트리거
export async function collectGames(maxCount = 10): Promise<void> {
  const { data } = await apiClient.post<ApiResponse<unknown>>('/api/admin/collect', {}, {
    params: { maxCount },
  })
  if (!data.success) {
    throw new Error(data.error ?? '데이터 수집에 실패했습니다.')
  }
}
