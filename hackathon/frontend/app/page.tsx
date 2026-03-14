'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { fetchGames, fetchCategories } from '@/lib/api'
import { SortOption } from '@/types'
import GameCard from '@/components/game/GameCard'
import GameCardSkeleton from '@/components/game/GameCardSkeleton'
import CategoryFilter from '@/components/game/CategoryFilter'
import SortDropdown from '@/components/game/SortDropdown'
import ErrorFallback from '@/components/ui/ErrorFallback'

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sort, setSort] = useState<SortOption>('popular')
  const [page, setPage] = useState(1)

  // 카테고리 목록 조회
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })

  // 게임 목록 조회
  const { data, isLoading, isError } = useQuery({
    queryKey: ['games', { category: selectedCategory, sort, page }],
    queryFn: () => fetchGames({ category: selectedCategory ?? undefined, sort, page }),
  })

  const games = data?.items ?? []
  const total = data?.total ?? 0
  const isDefaultView = !selectedCategory && sort === 'popular' && page === 1

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category)
    setPage(1)
  }

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort)
    setPage(1)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 히어로 섹션 */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
          건강에 좋은 게임을 찾아드려요
        </h1>
        <p className="text-gray-400 text-base max-w-xl mx-auto">
          AI가 분석한 건강 효과 태그를 기반으로 당신에게 맞는 게임을 추천해드립니다
        </p>
      </div>

      {/* 인기 게임 하이라이트 (기본 뷰에서 상위 5개) */}
      {isDefaultView && !isLoading && games.length > 0 && (
        <section className="mb-12">
          <h2 className="text-base font-semibold text-gray-500 uppercase tracking-wider mb-4">🔥 인기 게임 TOP 5</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {games.slice(0, 5).map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}

      {/* 필터 & 정렬 */}
      <div className="border border-gray-100 rounded-2xl p-5 mb-6 bg-white shadow-xs">
        <div className="flex flex-col gap-4">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
          <div className="flex items-center justify-between pt-1 border-t border-gray-50">
            <p className="text-sm text-gray-400">
              {total > 0 ? `총 ${total}개 게임` : ''}
            </p>
            <SortDropdown value={sort} onChange={handleSortChange} />
          </div>
        </div>
      </div>

      {/* 게임 목록 */}
      {isError ? (
        <ErrorFallback
          message="게임 목록을 불러오는데 실패했습니다."
          hint="백엔드 서버가 실행 중인지 확인해주세요."
        />
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <GameCardSkeleton key={i} />
          ))}
        </div>
      ) : games.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🎮</p>
          <p className="text-gray-400 text-sm">해당 카테고리에 게임이 없습니다.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {(isDefaultView ? games.slice(5) : games).map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>

          {/* 페이지네이션 - pageSize를 data에서 동적으로 참조 */}
          {data && total > data.pageSize && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed hover:border-gray-300 transition-colors"
              >
                이전
              </button>
              <span className="px-4 py-2 text-sm text-gray-400">
                {page} / {Math.ceil(total / data.pageSize)}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(total / data.pageSize)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed hover:border-gray-300 transition-colors"
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
