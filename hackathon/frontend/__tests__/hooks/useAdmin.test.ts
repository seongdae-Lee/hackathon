import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import {
  useAdminStats,
  useAdminGames,
  useCreateGame,
  useUpdateGame,
  useDeleteGame,
  useAnalyzeGame,
  useCollectGames,
} from '@/hooks/useAdmin'

// API 함수 전체 모킹
jest.mock('@/lib/api', () => ({
  fetchAdminStats: jest.fn(),
  fetchAdminGames: jest.fn(),
  createGame: jest.fn(),
  updateGame: jest.fn(),
  deleteGame: jest.fn(),
  analyzeGame: jest.fn(),
  collectGames: jest.fn(),
}))

import {
  fetchAdminStats,
  fetchAdminGames,
  createGame,
  updateGame,
  deleteGame,
  analyzeGame,
  collectGames,
} from '@/lib/api'

// 각 테스트마다 새 QueryClient 사용 (캐시 격리)
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('useAdminStats', () => {
  it('성공 시 통계 데이터를 반환한다', async () => {
    const mockStats = { totalGames: 30, analyzedGames: 20, unanalyzedGames: 10 };
    (fetchAdminStats as jest.Mock).mockResolvedValue(mockStats)

    const { result } = renderHook(() => useAdminStats(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockStats)
    expect(fetchAdminStats).toHaveBeenCalledTimes(1)
  })

  it('실패 시 error 상태가 된다', async () => {
    (fetchAdminStats as jest.Mock).mockRejectedValue(new Error('네트워크 오류'))

    const { result } = renderHook(() => useAdminStats(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

describe('useAdminGames', () => {
  it('성공 시 게임 목록을 반환한다', async () => {
    const mockGames = [{ id: 1, name: '좀비런' }];
    (fetchAdminGames as jest.Mock).mockResolvedValue(mockGames)

    const { result } = renderHook(() => useAdminGames(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockGames)
  })

  it('실패 시 error 상태가 된다', async () => {
    (fetchAdminGames as jest.Mock).mockRejectedValue(new Error('조회 실패'))

    const { result } = renderHook(() => useAdminGames(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

describe('useCreateGame', () => {
  const formData = {
    name: '새 게임', description: '설명', developer: '개발사',
    category: '달리기', rating: 4.0, downloadCount: 1000,
    iconUrl: 'https://example.com/icon.png', playStoreUrl: null, appStoreUrl: null,
  }

  it('mutate 호출 시 createGame API를 호출한다', async () => {
    const mockGame = { id: 99, name: '새 게임' };
    (createGame as jest.Mock).mockResolvedValue(mockGame)

    const { result } = renderHook(() => useCreateGame(), { wrapper: createWrapper() })
    result.current.mutate(formData)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(createGame).toHaveBeenCalledWith(formData)
  })

  it('실패 시 isError 상태가 된다', async () => {
    (createGame as jest.Mock).mockRejectedValue(new Error('추가 실패'))

    const { result } = renderHook(() => useCreateGame(), { wrapper: createWrapper() })
    result.current.mutate(formData)

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

describe('useUpdateGame', () => {
  const payload = {
    id: 1,
    data: {
      name: '수정된 게임', description: '설명', developer: '개발사',
      category: '달리기', rating: 4.0, downloadCount: 1000,
      iconUrl: 'https://example.com/icon.png', playStoreUrl: null, appStoreUrl: null,
    },
  }

  it('mutate 호출 시 updateGame API를 호출한다', async () => {
    const mockGame = { id: 1, name: '수정된 게임' };
    (updateGame as jest.Mock).mockResolvedValue(mockGame)

    const { result } = renderHook(() => useUpdateGame(), { wrapper: createWrapper() })
    result.current.mutate(payload)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(updateGame).toHaveBeenCalledWith(1, payload.data)
  })

  it('실패 시 isError 상태가 된다', async () => {
    (updateGame as jest.Mock).mockRejectedValue(new Error('수정 실패'))

    const { result } = renderHook(() => useUpdateGame(), { wrapper: createWrapper() })
    result.current.mutate(payload)

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

describe('useDeleteGame', () => {
  it('mutate 호출 시 deleteGame API를 호출한다', async () => {
    (deleteGame as jest.Mock).mockResolvedValue(undefined)

    const { result } = renderHook(() => useDeleteGame(), { wrapper: createWrapper() })
    result.current.mutate(1)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(deleteGame).toHaveBeenCalledWith(1)
  })

  it('실패 시 isError 상태가 된다', async () => {
    (deleteGame as jest.Mock).mockRejectedValue(new Error('삭제 실패'))

    const { result } = renderHook(() => useDeleteGame(), { wrapper: createWrapper() })
    result.current.mutate(1)

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

describe('useAnalyzeGame', () => {
  it('mutate 호출 시 analyzeGame API를 호출한다', async () => {
    (analyzeGame as jest.Mock).mockResolvedValue(undefined)

    const { result } = renderHook(() => useAnalyzeGame(), { wrapper: createWrapper() })
    result.current.mutate(5)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(analyzeGame).toHaveBeenCalledWith(5)
  })

  it('실패 시 isError 상태가 된다', async () => {
    (analyzeGame as jest.Mock).mockRejectedValue(new Error('분석 실패'))

    const { result } = renderHook(() => useAnalyzeGame(), { wrapper: createWrapper() })
    result.current.mutate(5)

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

describe('useCollectGames', () => {
  it('mutate 호출 시 collectGames API를 호출한다', async () => {
    (collectGames as jest.Mock).mockResolvedValue(undefined)

    const { result } = renderHook(() => useCollectGames(), { wrapper: createWrapper() })
    result.current.mutate(10)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(collectGames).toHaveBeenCalledWith(10)
  })

  it('인수 없이 호출 시 collectGames(undefined)를 호출한다', async () => {
    (collectGames as jest.Mock).mockResolvedValue(undefined)

    const { result } = renderHook(() => useCollectGames(), { wrapper: createWrapper() })
    result.current.mutate(undefined)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(collectGames).toHaveBeenCalledWith(undefined)
  })
})
