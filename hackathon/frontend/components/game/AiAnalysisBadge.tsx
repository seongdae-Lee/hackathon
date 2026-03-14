interface AiAnalysisBadgeProps {
  isAiAnalyzed: boolean
  className?: string
}

/// AI 분석 상태 배지 - 태그가 AI에 의해 분석된 경우 표시
export default function AiAnalysisBadge({ isAiAnalyzed, className = '' }: AiAnalysisBadgeProps) {
  if (!isAiAnalyzed) {
    return (
      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-gray-50 text-gray-400 border border-gray-100 ${className}`}>
        <span className="text-[10px]">📋</span>
        수동 태그
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-violet-50 text-violet-500 border border-violet-100 ${className}`}>
      <span className="text-[10px]">✨</span>
      AI 분석
    </span>
  )
}
