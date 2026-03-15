import axios from 'axios'
import { AdminGame, AdminStats, ApiResponse, Game, GameFormData, LoginResponse, PagedResult, RecommendResponse, SearchResult, SortOption } from '@/types'

// 백엔드 API 베이스 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'

// JWT 토큰 localStorage 키
const JWT_TOKEN_KEY = 'admin_jwt_token'
const JWT_EXPIRES_KEY = 'admin_jwt_expires'

/** JWT 토큰 저장 */
export function saveToken(response: LoginResponse): void {
  localStorage.setItem(JWT_TOKEN_KEY, response.token)
  localStorage.setItem(JWT_EXPIRES_KEY, response.expiresAt)
}

/** JWT 토큰 삭제 */
export function removeToken(): void {
  localStorage.removeItem(JWT_TOKEN_KEY)
  localStorage.removeItem(JWT_EXPIRES_KEY)
}

/** 저장된 JWT 토큰 반환 (만료 시 null) */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  const token = localStorage.getItem(JWT_TOKEN_KEY)
  const expiresAt = localStorage.getItem(JWT_EXPIRES_KEY)
  if (!token || !expiresAt) return null
  // 만료 1분 전부터 만료로 처리 (클록 오차 보정)
  if (new Date(expiresAt).getTime() - Date.now() < 60_000) {
    removeToken()
    return null
  }
  return token
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10초 타임아웃 - 무한 대기 방지
})

// 요청 인터셉터 - JWT 토큰이 있으면 Authorization 헤더 자동 첨부
apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 응답 인터셉터 - 401 Unauthorized 시 로그인 페이지로 리다이렉트
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // 토큰 삭제 후 로그인 페이지로 이동
      removeToken()
      window.location.replace('/admin/login')
    }
    return Promise.reject(error)
  }
)

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

// 관리자 로그인 - JWT 토큰 발급 및 저장
export async function adminLogin(username: string, password: string): Promise<void> {
  const { data } = await apiClient.post<ApiResponse<LoginResponse>>('/api/admin/login', {
    username,
    password,
  })
  if (!data.success || !data.data) {
    throw new Error(data.error ?? '로그인에 실패했습니다.')
  }
  saveToken(data.data)
}
