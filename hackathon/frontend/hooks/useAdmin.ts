import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  analyzeGame,
  collectGames,
  createGame,
  deleteGame,
  fetchAdminGames,
  fetchAdminStats,
  updateGame,
} from '@/lib/api'
import { GameFormData } from '@/types'

// 관리자 통계 조회
export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: fetchAdminStats,
    staleTime: 60 * 1000, // 1분
  })
}

// 관리자 게임 목록 조회
export function useAdminGames() {
  return useQuery({
    queryKey: ['admin', 'games'],
    queryFn: fetchAdminGames,
    staleTime: 30 * 1000, // 30초
  })
}

// 게임 추가 mutation
export function useCreateGame() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: GameFormData) => createGame(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] })
    },
    onError: (error: Error) => {
      console.error('게임 추가 실패:', error.message)
    },
    retry: 0, // 중복 요청 방지 - 실패 시 자동 재시도 비활성화
  })
}

// 게임 수정 mutation
export function useUpdateGame() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: GameFormData }) => updateGame(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] })
    },
    onError: (error: Error) => {
      console.error('게임 수정 실패:', error.message)
    },
    retry: 0,
  })
}

// 게임 삭제 mutation
export function useDeleteGame() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteGame(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] })
    },
    onError: (error: Error) => {
      console.error('게임 삭제 실패:', error.message)
    },
    retry: 0,
  })
}

// AI 재분석 mutation
export function useAnalyzeGame() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => analyzeGame(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] })
    },
    onError: (error: Error) => {
      console.error('AI 재분석 실패:', error.message)
    },
    retry: 0,
  })
}

// 데이터 수집 mutation
export function useCollectGames() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (maxCount?: number) => collectGames(maxCount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] })
    },
    onError: (error: Error) => {
      console.error('데이터 수집 실패:', error.message)
    },
    retry: 0,
  })
}
