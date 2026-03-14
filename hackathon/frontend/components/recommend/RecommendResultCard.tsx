import Link from 'next/link'
import Image from 'next/image'
import { RecommendResultItem } from '@/types'

interface RecommendResultCardProps {
  item: RecommendResultItem
  rank: number
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
            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50">
              <Image
                src={game.iconUrl || '/placeholder-game.png'}
                alt={game.name}
                fill
                className="object-cover"
              />
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
