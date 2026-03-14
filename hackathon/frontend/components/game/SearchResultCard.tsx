import Link from 'next/link'
import Image from 'next/image'
import { SearchResult } from '@/types'

interface SearchResultCardProps {
  result: SearchResult
}

// 텍스트에서 키워드를 찾아 하이라이팅 처리
function HighlightText({ text, keyword }: { text: string; keyword: string }) {
  if (!keyword) return <span>{text}</span>

  const lowerText = text.toLowerCase()
  const lowerKeyword = keyword.toLowerCase()
  const index = lowerText.indexOf(lowerKeyword)

  if (index === -1) return <span>{text}</span>

  return (
    <span>
      {text.slice(0, index)}
      <mark className="bg-yellow-200 text-yellow-900 rounded px-0.5">
        {text.slice(index, index + keyword.length)}
      </mark>
      {text.slice(index + keyword.length)}
    </span>
  )
}

export default function SearchResultCard({ result }: SearchResultCardProps) {
  const { game, matchedFields, matchedKeyword } = result
  const showNameHighlight = matchedFields.includes('name')
  const showCategoryHighlight = matchedFields.includes('category')
  const showTagHighlight = matchedFields.includes('tag')

  return (
    <Link href={`/games/${game.id}`} className="block">
      <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
        {/* 게임 아이콘 */}
        <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50">
          <Image
            src={game.iconUrl || '/placeholder-game.png'}
            alt={game.name}
            fill
            className="object-cover"
          />
        </div>

        {/* 게임 정보 */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
            {showNameHighlight ? (
              <HighlightText text={game.name} keyword={matchedKeyword} />
            ) : (
              game.name
            )}
          </h3>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
              {showCategoryHighlight ? (
                <HighlightText text={game.category} keyword={matchedKeyword} />
              ) : (
                game.category
              )}
            </span>
            <span className="text-xs text-gray-400">⭐ {game.rating.toFixed(1)}</span>
          </div>

          {/* 매칭된 건강 태그 표시 */}
          {showTagHighlight && game.healthTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {game.healthTags
                .filter((t) => t.tag.toLowerCase().includes(matchedKeyword.toLowerCase()))
                .map((tag) => (
                  <span
                    key={tag.id}
                    className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600"
                  >
                    <HighlightText text={tag.tag} keyword={matchedKeyword} />
                  </span>
                ))}
            </div>
          )}

          {/* 매칭 필드 안내 */}
          {matchedFields.length > 0 && (
            <p className="text-xs text-gray-300 mt-1">
              {matchedFields.includes('name') && '게임명'}
              {matchedFields.includes('category') && matchedFields.includes('name') && ' · 카테고리'}
              {matchedFields.includes('category') && !matchedFields.includes('name') && '카테고리'}
              {matchedFields.includes('tag') && matchedFields.length > 1 && ' · 태그'}
              {matchedFields.includes('tag') && matchedFields.length === 1 && '태그'}
              {' 매칭'}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
