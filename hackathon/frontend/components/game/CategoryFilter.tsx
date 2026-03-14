'use client'

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
}

const CATEGORY_EMOJIS: Record<string, string> = {
  '달리기': '🏃',
  '명상/스트레스 해소': '🧘',
  '피트니스': '💪',
  '반응훈련': '⚡',
  '밸런스': '⚖️',
  '인지/두뇌훈련': '🧠',
  '팔 운동': '🤸',
  '댄스/리듬': '💃',
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {/* 전체 버튼 */}
      <button
        onClick={() => onCategoryChange(null)}
        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
          selectedCategory === null
            ? 'bg-gray-900 text-white'
            : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700'
        }`}
      >
        전체
      </button>

      {/* 카테고리 버튼들 */}
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category === selectedCategory ? null : category)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
            selectedCategory === category
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700'
          }`}
        >
          <span>{CATEGORY_EMOJIS[category] ?? '🎮'}</span>
          <span>{category}</span>
        </button>
      ))}
    </div>
  )
}
