'use client'

import { useState } from 'react'
import { AdminGame } from '@/types'

interface GameTableProps {
  games: AdminGame[]
  analyzingId: number | null
  onEdit: (game: AdminGame) => void
  onDelete: (game: AdminGame) => void
  onAnalyze: (id: number) => void
}

export default function GameTable({ games, analyzingId, onEdit, onDelete, onAnalyze }: GameTableProps) {
  // 이미지 로드 실패한 URL 추적 - 무한 onError 루프 방지
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set())

  if (games.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 text-sm">
        등록된 게임이 없습니다.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-xs text-gray-400">
            <th className="text-left py-3 px-4 font-medium">게임명</th>
            <th className="text-left py-3 px-4 font-medium">카테고리</th>
            <th className="text-center py-3 px-4 font-medium">AI 태깅</th>
            <th className="text-left py-3 px-4 font-medium">등록일</th>
            <th className="text-center py-3 px-4 font-medium">액션</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr key={game.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={failedImages.has(game.id) ? undefined : (game.iconUrl || undefined)}
                    alt={game.name}
                    className="w-8 h-8 rounded-lg object-cover flex-shrink-0 bg-gray-100"
                    onError={() => setFailedImages((prev) => new Set(prev).add(game.id))}
                  />
                  <span className="font-medium text-gray-900 line-clamp-1">{game.name}</span>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                  {game.category}
                </span>
              </td>
              <td className="py-3 px-4 text-center">
                {game.isAiAnalyzed ? (
                  <span className="text-green-500 text-base">✅</span>
                ) : (
                  <span className="text-gray-300 text-base">⬜</span>
                )}
              </td>
              <td className="py-3 px-4 text-gray-400 text-xs">
                {new Date(game.createdAt).toLocaleDateString('ko-KR')}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onAnalyze(game.id)}
                    disabled={analyzingId === game.id}
                    className="px-2 py-1 text-xs rounded bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {analyzingId === game.id ? '분석 중...' : 'AI 재분석'}
                  </button>
                  <button
                    onClick={() => onEdit(game)}
                    className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDelete(game)}
                    className="px-2 py-1 text-xs rounded bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
