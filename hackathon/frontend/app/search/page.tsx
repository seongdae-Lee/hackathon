'use client'

import { Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { searchGames } from '@/lib/api'
import SearchResultCard from '@/components/game/SearchResultCard'
import GameCardSkeleton from '@/components/game/GameCardSkeleton'

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') ?? ''

  const { data: results = [], isLoading, isError } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchGames(query),
    enabled: query.length >= 2,
  })

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 검색 헤더 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">
            ← 홈으로
          </Link>
        </div>
        {query ? (
          <h1 className="text-xl font-bold text-gray-900">
            <span className="text-gray-400 font-normal text-base mr-2">검색:</span>
            {query}
          </h1>
        ) : (
          <h1 className="text-xl font-bold text-gray-900">검색</h1>
        )}
      </div>

      {/* 검색어 2글자 미만 */}
      {query.length < 2 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-gray-400 text-sm">2글자 이상 입력해주세요.</p>
        </div>
      )}

      {/* 로딩 */}
      {isLoading && query.length >= 2 && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <GameCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* 에러 */}
      {isError && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">😢</p>
          <p className="text-gray-400 text-sm">검색에 실패했습니다. 잠시 후 다시 시도해주세요.</p>
        </div>
      )}

      {/* 검색 결과 */}
      {!isLoading && !isError && query.length >= 2 && (
        <>
          <p className="text-sm text-gray-400 mb-4">
            {results.length > 0
              ? `검색 결과 ${results.length}개`
              : '검색 결과가 없습니다'}
          </p>

          {results.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">🎮</p>
              <p className="text-gray-500 font-medium mb-1">검색 결과가 없습니다</p>
              <p className="text-gray-400 text-sm">다른 키워드로 검색해보세요.</p>
              <p className="text-gray-300 text-xs mt-4">
                게임명, 카테고리, 건강 효과 태그로 검색할 수 있어요.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {results.map((result) => (
                <SearchResultCard key={result.game.id} result={result} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="h-8 bg-gray-100 rounded w-32 mb-8 animate-pulse" />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
