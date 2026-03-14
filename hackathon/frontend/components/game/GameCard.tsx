import Link from 'next/link'
import { Game } from '@/types'
import HealthTagBadge from './HealthTagBadge'

interface GameCardProps {
  game: Game
}

// 다운로드 수를 읽기 쉬운 형식으로 변환
function formatDownloadCount(count: number): string {
  if (count >= 100000000) return `${(count / 100000000).toFixed(0)}억+`
  if (count >= 10000000) return `${(count / 10000000).toFixed(0)}천만+`
  if (count >= 1000000) return `${(count / 1000000).toFixed(0)}백만+`
  if (count >= 10000) return `${(count / 10000).toFixed(0)}만+`
  return count.toLocaleString()
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

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/games/${game.id}`} className="block group">
      <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-gray-200 hover:shadow-sm transition-all duration-200 h-full">
        {/* 게임 아이콘 및 기본 정보 */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-gray-50 flex items-center justify-center text-2xl">
            {getCategoryEmoji(game.category)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 text-sm leading-snug group-hover:text-gray-600 transition-colors line-clamp-2">
              {game.name}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{game.developer}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs text-amber-500">★ {game.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-300">·</span>
              <span className="text-xs text-gray-400">{formatDownloadCount(game.downloadCount)}</span>
            </div>
          </div>
        </div>

        {/* 카테고리 */}
        <div className="mb-2.5">
          <span className="inline-block px-2 py-0.5 bg-gray-50 text-gray-500 text-xs rounded-md font-medium border border-gray-100">
            {game.category}
          </span>
        </div>

        {/* 설명 */}
        <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed">
          {game.description}
        </p>

        {/* 건강 효과 태그 */}
        {game.healthTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {game.healthTags.slice(0, 3).map((tag) => (
              <HealthTagBadge key={tag.id} tag={tag} size="sm" />
            ))}
            {game.healthTags.length > 3 && (
              <span className="text-xs text-gray-300 self-center">+{game.healthTags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
