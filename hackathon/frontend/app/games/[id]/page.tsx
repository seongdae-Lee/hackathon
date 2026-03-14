'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { fetchGame, fetchSimilarGames } from '@/lib/api'
import GameCard from '@/components/game/GameCard'
import GameCardSkeleton from '@/components/game/GameCardSkeleton'
import HealthTagBadge from '@/components/game/HealthTagBadge'
import { useState } from 'react'

// 다운로드 수를 읽기 쉬운 형식으로 변환
function formatDownloadCount(count: number): string {
  if (count >= 100000000) return `${(count / 100000000).toFixed(0)}억+`
  if (count >= 10000000) return `${(count / 10000000).toFixed(0)}천만+`
  if (count >= 1000000) return `${(count / 1000000).toFixed(0)}백만+`
  if (count >= 10000) return `${(count / 10000).toFixed(0)}만+`
  return count.toLocaleString()
}

// 카테고리별 이모지
function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    '달리기': '🏃',
    '명상/스트레스 해소': '🧘',
    '피트니스': '💪',
    '반응훈련': '⚡',
    '밸런스': '⚖️',
    '인지/두뇌훈련': '🧠',
    '팔 운동': '🤸',
    '댄스/리듬': '💃',
  }
  return map[category] ?? '🎮'
}

export default function GameDetailPage() {
  const params = useParams()
  const router = useRouter()
  const gameId = Number(params.id)
  const [expandedTagId, setExpandedTagId] = useState<number | null>(null)

  const { data: game, isLoading, isError } = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => fetchGame(gameId),
    enabled: !isNaN(gameId),
  })

  const { data: similarGames = [], isLoading: isSimilarLoading } = useQuery({
    queryKey: ['similar', gameId],
    queryFn: () => fetchSimilarGames(gameId),
    enabled: !isNaN(gameId),
  })

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-3">😢</p>
        <p className="text-gray-500">게임 정보를 불러오는데 실패했습니다.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
        >
          뒤로가기
        </button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-24 mb-6" />
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex gap-4 mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-2xl flex-shrink-0" />
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/5" />
          </div>
        </div>
      </div>
    )
  }

  if (!game) return null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 뒤로가기 */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 group"
      >
        <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
        뒤로가기
      </button>

      {/* 게임 기본 정보 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-start gap-4 mb-5">
          {/* 게임 아이콘 */}
          <div className="w-20 h-20 flex-shrink-0 rounded-2xl bg-gray-100 flex items-center justify-center text-4xl overflow-hidden">
            {getCategoryEmoji(game.category)}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{game.name}</h1>
            <p className="text-gray-500 text-sm mb-2">{game.developer}</p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-block px-2.5 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium">
                {game.category}
              </span>
              <span className="text-sm text-yellow-500">⭐ {game.rating.toFixed(1)}</span>
              <span className="text-sm text-gray-400">다운로드 {formatDownloadCount(game.downloadCount)}</span>
            </div>
          </div>
        </div>

        {/* 게임 설명 */}
        <p className="text-gray-700 leading-relaxed mb-5">{game.description}</p>

        {/* 스토어 바로가기 버튼 */}
        <div className="flex flex-wrap gap-3">
          {game.playStoreUrl && (
            <a
              href={game.playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              <span>▶</span>
              <span>Google Play</span>
            </a>
          )}
          {game.appStoreUrl && (
            <a
              href={game.appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <span>🍎</span>
              <span>App Store</span>
            </a>
          )}
          {!game.playStoreUrl && !game.appStoreUrl && (
            <p className="text-sm text-gray-400 italic">스토어 링크 없음 (전용 기기 필요)</p>
          )}
        </div>
      </div>

      {/* AI 건강 효과 태그 */}
      {game.healthTags.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            🤖 AI 건강 효과 분석
          </h2>
          <div className="space-y-4">
            {game.healthTags.map((tag) => (
              <div key={tag.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <HealthTagBadge tag={tag} size="md" />
                  <span className="text-sm text-gray-500">신뢰도 {Math.round(tag.confidence * 100)}%</span>
                </div>

                {/* 신뢰도 바 */}
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                  <div
                    className="bg-green-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${Math.round(tag.confidence * 100)}%` }}
                  />
                </div>

                {/* AI 설명 펼침 */}
                <button
                  onClick={() => setExpandedTagId(expandedTagId === tag.id ? null : tag.id)}
                  className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
                >
                  <span>{expandedTagId === tag.id ? '▲' : '▼'}</span>
                  <span>AI 분석 근거 {expandedTagId === tag.id ? '접기' : '보기'}</span>
                </button>
                {expandedTagId === tag.id && (
                  <p className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3 leading-relaxed">
                    {tag.aiDescription}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 유사 게임 추천 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          🎮 유사 게임 추천
        </h2>
        {isSimilarLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <GameCardSkeleton key={i} />
            ))}
          </div>
        ) : similarGames.length === 0 ? (
          <p className="text-gray-400 text-sm">유사한 게임이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {similarGames.map((similarGame) => (
              <GameCard key={similarGame.id} game={similarGame} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
