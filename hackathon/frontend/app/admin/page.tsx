'use client'

import { useState } from 'react'
import { AdminGame, GameFormData } from '@/types'
import { StatsCard, GameTable, GameFormModal, DeleteConfirmDialog } from '@/components/admin'
import {
  useAdminStats,
  useAdminGames,
  useCreateGame,
  useUpdateGame,
  useDeleteGame,
  useAnalyzeGame,
  useCollectGames,
} from '@/hooks/useAdmin'

export default function AdminPage() {
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<AdminGame | undefined>(undefined)
  const [deleteTarget, setDeleteTarget] = useState<AdminGame | null>(null)
  const [analyzingId, setAnalyzingId] = useState<number | null>(null)
  const [collectStatus, setCollectStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const { data: stats, isLoading: statsLoading } = useAdminStats()
  const { data: games = [], isLoading: gamesLoading } = useAdminGames()

  const createMutation = useCreateGame()
  const updateMutation = useUpdateGame()
  const deleteMutation = useDeleteGame()
  const analyzeMutation = useAnalyzeGame()
  const collectMutation = useCollectGames()

  // 게임 추가 모달 열기
  const handleOpenCreate = () => {
    setModalMode('create')
    setEditTarget(undefined)
    setModalOpen(true)
  }

  // 게임 수정 모달 열기
  const handleOpenEdit = (game: AdminGame) => {
    setModalMode('edit')
    setEditTarget(game)
    setModalOpen(true)
  }

  // 폼 제출
  const handleFormSubmit = async (data: GameFormData) => {
    if (modalMode === 'create') {
      await createMutation.mutateAsync(data)
    } else if (editTarget) {
      await updateMutation.mutateAsync({ id: editTarget.id, data })
    }
    setModalOpen(false)
  }

  // 게임 삭제 확인
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    await deleteMutation.mutateAsync(deleteTarget.id)
    setDeleteTarget(null)
  }

  // AI 재분석
  const handleAnalyze = async (id: number) => {
    setAnalyzingId(id)
    try {
      await analyzeMutation.mutateAsync(id)
    } finally {
      setAnalyzingId(null)
    }
  }

  // 데이터 수집
  const handleCollect = async () => {
    setCollectStatus('loading')
    try {
      await collectMutation.mutateAsync(10)
      setCollectStatus('success')
      setTimeout(() => setCollectStatus('idle'), 3000)
    } catch {
      setCollectStatus('error')
      setTimeout(() => setCollectStatus('idle'), 3000)
    }
  }

  const isFormLoading = createMutation.isPending || updateMutation.isPending

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-sm text-gray-400 mt-1">게임 데이터 관리 및 AI 분석 현황</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {statsLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
              <div className="h-3 bg-gray-100 rounded w-16 mb-2" />
              <div className="h-8 bg-gray-100 rounded w-12 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-20" />
            </div>
          ))
        ) : stats ? (
          <>
            <StatsCard
              title="전체 게임"
              value={stats.totalGames}
              description="등록된 전체 게임 수"
              colorClass="text-gray-900"
            />
            <StatsCard
              title="AI 분석 완료"
              value={stats.analyzedGames}
              description="건강 효과 태깅 완료"
              colorClass="text-green-600"
            />
            <StatsCard
              title="미분석"
              value={stats.unanalyzedGames}
              description="AI 분석 대기 중"
              colorClass="text-orange-500"
            />
          </>
        ) : null}
      </div>

      {/* 액션 버튼 */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
        >
          + 게임 추가
        </button>
        <button
          onClick={handleCollect}
          disabled={collectStatus === 'loading'}
          className="px-4 py-2 border border-gray-200 text-sm rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {collectStatus === 'loading' ? '수집 중...' :
           collectStatus === 'success' ? '✅ 수집 완료' :
           collectStatus === 'error' ? '❌ 수집 실패' :
           '데이터 수집 시작'}
        </button>
      </div>

      {/* 게임 목록 테이블 */}
      <div className="bg-white rounded-xl border border-gray-100">
        {gamesLoading ? (
          <div className="p-8 text-center text-gray-400 text-sm">불러오는 중...</div>
        ) : (
          <GameTable
            games={games}
            analyzingId={analyzingId}
            onEdit={handleOpenEdit}
            onDelete={setDeleteTarget}
            onAnalyze={handleAnalyze}
          />
        )}
      </div>

      {/* 게임 추가/수정 모달 */}
      <GameFormModal
        mode={modalMode}
        initialData={editTarget}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={isFormLoading}
      />

      {/* 삭제 확인 다이얼로그 */}
      <DeleteConfirmDialog
        gameName={deleteTarget?.name ?? ''}
        isOpen={!!deleteTarget}
        isLoading={deleteMutation.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
