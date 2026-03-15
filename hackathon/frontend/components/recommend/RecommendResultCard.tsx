import Link from 'next/link'
import { RecommendResultItem } from '@/types'

interface RecommendResultCardProps {
  item: RecommendResultItem
  rank: number
}

// 카테고리별 이모지 반환
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

export default function RecommendResultCard({ item, rank }: RecommendResultCardProps) {
  const { game, matchScore, recommendReason } = item
  const scorePercent = Math.round(matchScore * 100)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-sm transition-all">
      <div className="p-5">
        <div className="flex gap-4">
          {/* 순위 + 아이콘 */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <span className="text-xs font-bold text-gray-300">#{rank}</span>
            <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center text-2xl">
              {getCategoryEmoji(game.category)}
            </div>
          </div>

          {/* 게임 정보 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <Link href={`/games/${game.id}`}>
                <h3 className="font-semibold text-gray-900 text-sm hover:text-blue-600 transition-colors">
                  {game.name}
                </h3>
              </Link>
              <span className="text-xs text-gray-400 flex-shrink-0">⭐ {game.rating.toFixed(1)}</span>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                {game.category}
              </span>
              {/* 매칭 점수 바 */}
              <div className="flex items-center gap-1.5 flex-1">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-400 rounded-full transition-all"
                    style={{ width: `${Math.min(scorePercent, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">{scorePercent}%</span>
              </div>
            </div>

            {/* AI 추천 이유 */}
            {recommendReason && (
              <p className="text-xs text-gray-500 leading-relaxed bg-blue-50 rounded-lg p-3">
                💡 {recommendReason}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
