'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { fetchGame, fetchSimilarGames } from '@/lib/api'
import GameCard from '@/components/game/GameCard'
import GameCardSkeleton from '@/components/game/GameCardSkeleton'
import HealthTagBadge from '@/components/game/HealthTagBadge'
import AiAnalysisBadge from '@/components/game/AiAnalysisBadge'
import ErrorFallback from '@/components/ui/ErrorFallback'
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
  // params.id가 배열일 경우(catch-all 라우트) 대비 명시적 파싱
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id
  const gameId = parseInt(rawId as string, 10)
  const isValidId = !isNaN(gameId) && gameId > 0
  const [expandedTagId, setExpandedTagId] = useState<number | null>(null)

  const { data: game, isLoading, isError } = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => fetchGame(gameId),
    enabled: isValidId,
    staleTime: 10 * 60 * 1000, // 10분 캐싱 (AI 재분석 후 invalidate 필요 시 갱신됨)
  })

  const { data: similarGames = [], isLoading: isSimilarLoading } = useQuery({
    queryKey: ['similar', gameId],
    queryFn: () => fetchSimilarGames(gameId),
    enabled: isValidId,
    staleTime: 5 * 60 * 1000, // 5분 캐싱
  })

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <ErrorFallback
          message="게임 정보를 불러오는데 실패했습니다."
          hint="백엔드 서버가 실행 중인지 확인해주세요."
          onRetry={() => router.back()}
        />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="h-5 bg-gray-100 rounded w-20 mb-6" />
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex gap-4 mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex-shrink-0" />
            <div className="flex-1">
              <div className="h-5 bg-gray-100 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/4" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-5/6" />
            <div className="h-3 bg-gray-100 rounded w-4/5" />
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
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-6 group transition-colors"
      >
        <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
        뒤로가기
      </button>

      {/* 게임 기본 정보 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
        <div className="flex items-start gap-4 mb-5">
          {/* 게임 아이콘 */}
          <div className="w-16 h-16 flex-shrink-0 rounded-xl bg-gray-50 flex items-center justify-center text-3xl">
            {getCategoryEmoji(game.category)}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold text-gray-900 mb-1 tracking-tight">{game.name}</h1>
            <p className="text-gray-400 text-sm mb-2">{game.developer}</p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-block px-2 py-0.5 bg-gray-50 text-gray-500 text-xs rounded-md border border-gray-100 font-medium">
                {game.category}
              </span>
              <span className="text-sm text-amber-500">★ {game.rating.toFixed(1)}</span>
              <span className="text-sm text-gray-300">·</span>
              <span className="text-sm text-gray-400">{formatDownloadCount(game.downloadCount)}</span>
            </div>
          </div>
        </div>

        {/* 게임 설명 */}
        <p className="text-gray-500 leading-relaxed text-sm mb-5">{game.description}</p>

        {/* 스토어 바로가기 버튼 */}
        <div className="flex flex-wrap gap-2">
          {game.playStoreUrl && (
            <a
              href={game.playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-gray-700 transition-colors"
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
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-gray-700 transition-colors"
            >
              <span>🍎</span>
              <span>App Store</span>
            </a>
          )}
          {!game.playStoreUrl && !game.appStoreUrl && (
            <p className="text-xs text-gray-300 italic">스토어 링크 없음 (전용 기기 필요)</p>
          )}
        </div>
      </div>

      {/* AI 건강 효과 태그 */}
      {game.healthTags.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700">AI 건강 효과 분석</h2>
            {/* 전체 분석 출처 표시 */}
            {game.healthTags.some(t => t.isAiAnalyzed) ? (
              <span className="text-xs text-violet-400 flex items-center gap-1">
                <span>✨</span> Claude AI 분석 완료
              </span>
            ) : (
              <span className="text-xs text-gray-300">수동 태그</span>
            )}
          </div>
          <div className="space-y-3">
            {game.healthTags.map((tag) => (
              <div key={tag.id} className="border border-gray-50 rounded-xl p-4 bg-gray-50/50">
                <div className="flex items-center justify-between mb-2">
                  <HealthTagBadge tag={tag} size="md" />
                  <div className="flex items-center gap-2">
                    <AiAnalysisBadge isAiAnalyzed={tag.isAiAnalyzed} />
                    <span className="text-xs text-gray-400">신뢰도 {Math.round(tag.confidence * 100)}%</span>
                  </div>
                </div>

                {/* 신뢰도 바 - CSS custom property로 동적 너비 설정 */}
                <div className="w-full bg-gray-200 rounded-full h-1 mb-3">
                  <div
                    className="bg-gray-400 h-1 rounded-full transition-all [width:var(--confidence)]"
                    style={{ '--confidence': `${Math.round(tag.confidence * 100)}%` } as React.CSSProperties}
                  />
                </div>

                {/* AI 설명 펼침 */}
                {tag.aiDescription && (
                  <>
                    <button
                      onClick={() => setExpandedTagId(expandedTagId === tag.id ? null : tag.id)}
                      className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
                    >
                      <span>{expandedTagId === tag.id ? '▲' : '▼'}</span>
                      <span>{tag.isAiAnalyzed ? 'AI 분석 근거' : '설명'} {expandedTagId === tag.id ? '접기' : '보기'}</span>
                    </button>
                    {expandedTagId === tag.id && (
                      <p className="mt-2 text-xs text-gray-500 bg-white rounded-lg p-3 leading-relaxed border border-gray-100">
                        {tag.aiDescription}
                      </p>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 유사 게임 추천 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">유사 게임 추천</h2>
        {isSimilarLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <GameCardSkeleton key={i} />
            ))}
          </div>
        ) : similarGames.length === 0 ? (
          <p className="text-gray-300 text-sm">유사한 게임이 없습니다.</p>
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
