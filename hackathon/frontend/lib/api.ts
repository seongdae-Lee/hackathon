import axios from 'axios'
import { ApiResponse, Game, PagedResult, SortOption } from '@/types'

// 백엔드 API 베이스 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
