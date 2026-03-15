'use client'

import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import Link from 'next/link'
import { fetchRecommendations } from '@/lib/api'
import { GoalCard, RecommendResultCard } from '@/components/recommend'

// 건강 목표 목록 정의
const HEALTH_GOALS = [
  {
    value: '심폐기능',
    label: '심폐기능 향상',
    emoji: '🫀',
    colorClass: 'bg-red-50 text-red-600 border-red-200',
  },
  {
    value: '근력강화',
    label: '근력 강화',
    emoji: '💪',
    colorClass: 'bg-orange-50 text-orange-600 border-orange-200',
  },
  {
    value: '스트레스해소',
    label: '스트레스 해소',
    emoji: '🧘',
    colorClass: 'bg-green-50 text-green-600 border-green-200',
  },
  {
    value: '인지개선',
    label: '인지능력 개선',
    emoji: '🧠',
    colorClass: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  {
    value: '반응훈련',
    label: '반응속도 훈련',
    emoji: '⚡',
    colorClass: 'bg-purple-50 text-purple-600 border-purple-200',
  },
]

export default function RecommendPage() {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])

  const { mutate, data, isPending, isError } = useMutation({
    mutationFn: (goals: string[]) => fetchRecommendations(goals),
  })

  const handleGoalToggle = (value: string) => {
    setSelectedGoals((prev) =>
      prev.includes(value) ? prev.filter((g) => g !== value) : [...prev, value]
    )
  }

  const handleRecommend = () => {
    if (selectedGoals.length > 0) {
      mutate(selectedGoals)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 헤더 */}
      <div className="mb-8">
        <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm transition-colors mb-4 block">
          ← 홈으로
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">맞춤 게임 추천</h1>
        <p className="text-gray-400 text-sm">
          건강 목표를 선택하면 AI가 맞춤 게임을 추천해드려요.
        </p>
      </div>

      {/* 건강 목표 선택 */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          건강 목표 선택 ({selectedGoals.length}개 선택됨)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {HEALTH_GOALS.map((goal) => (
            <GoalCard
              key={goal.value}
              goalLabel={goal.label}
              goalValue={goal.value}
              emoji={goal.emoji}
              colorClass={goal.colorClass}
              isSelected={selectedGoals.includes(goal.value)}
              onClick={handleGoalToggle}
            />
          ))}
        </div>
      </section>

      {/* 추천받기 버튼 */}
      <button
        onClick={handleRecommend}
        disabled={selectedGoals.length === 0 || isPending}
        className="w-full py-3 rounded-xl font-semibold text-sm transition-all
          disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed
          bg-gray-900 text-white hover:bg-gray-700 active:scale-[0.99]"
      >
        {isPending ? 'AI가 추천을 생성하고 있습니다...' : '추천받기'}
      </button>
      {selectedGoals.length === 0 && !isPending && (
        <p className="text-center text-xs text-gray-300 mt-2">최소 1개 이상의 건강 목표를 선택해주세요.</p>
      )}

      {/* 로딩 중 */}
      {isPending && (
        <div className="text-center py-10">
          <div className="text-3xl mb-3 animate-pulse">✨</div>
          <p className="text-gray-400 text-sm">AI가 추천 이유를 생성하고 있습니다...</p>
        </div>
      )}

      {/* 에러 */}
      {isError && (
        <div className="text-center py-10 mt-4">
          <p className="text-4xl mb-3">😢</p>
          <p className="text-gray-400 text-sm">추천 정보를 불러오는데 실패했습니다.</p>
        </div>
      )}

      {/* 추천 결과 */}
      {data && !isPending && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            {data.games.length > 0
              ? `추천 게임 ${data.games.length}개`
              : '추천 결과가 없습니다'}
          </h2>

          {data.games.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <p className="text-4xl mb-3">🎮</p>
              <p className="text-gray-500 font-medium mb-1">선택하신 목표에 맞는 게임을 찾지 못했습니다</p>
              <p className="text-gray-400 text-sm">다른 건강 목표를 선택해보세요.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {data.games.map((item, idx) => (
                <RecommendResultCard key={item.game.id} item={item} rank={idx + 1} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
