interface GoalCardProps {
  goalLabel: string   // 표시 레이블 (예: "심폐기능 향상")
  goalValue: string   // API 요청값 (예: "심폐기능")
  emoji: string
  colorClass: string  // Tailwind 색상 클래스
  isSelected: boolean
  onClick: (value: string) => void
}

export default function GoalCard({
  goalLabel,
  goalValue,
  emoji,
  colorClass,
  isSelected,
  onClick,
}: GoalCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(goalValue)}
      className={`
        flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all cursor-pointer
        ${isSelected
          ? `${colorClass} border-current shadow-sm scale-[1.02]`
          : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
        }
      `}
      aria-pressed={isSelected}
    >
      <span className="text-3xl">{emoji}</span>
      <span className={`text-sm font-medium ${isSelected ? '' : 'text-gray-600'}`}>
        {goalLabel}
      </span>
      {isSelected && (
        <span className="text-xs opacity-70">선택됨 ✓</span>
      )}
    </button>
  )
}
