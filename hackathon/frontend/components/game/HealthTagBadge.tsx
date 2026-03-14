import { HealthTag } from '@/types'
import AiAnalysisBadge from './AiAnalysisBadge'

interface HealthTagBadgeProps {
  tag: HealthTag
  size?: 'sm' | 'md'
  showConfidence?: boolean
  showAiBadge?: boolean
}

// 태그별 색상 매핑 - 화이트 테마에 어울리는 파스텔
const TAG_COLORS: Record<string, string> = {
  '#심폐기능': 'bg-red-50 text-red-500 border-red-100',
  '#근력강화': 'bg-orange-50 text-orange-500 border-orange-100',
  '#스트레스해소': 'bg-sky-50 text-sky-500 border-sky-100',
  '#인지개선': 'bg-violet-50 text-violet-500 border-violet-100',
  '#반응훈련': 'bg-amber-50 text-amber-500 border-amber-100',
}

const DEFAULT_COLOR = 'bg-gray-50 text-gray-500 border-gray-100'

export default function HealthTagBadge({
  tag,
  size = 'md',
  showConfidence = false,
  showAiBadge = false,
}: HealthTagBadgeProps) {
  const colorClass = TAG_COLORS[tag.tag] ?? DEFAULT_COLOR

  if (size === 'sm') {
    return (
      <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium border ${colorClass}`}>
        {tag.tag}
      </span>
    )
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${colorClass}`}>
      <span className="text-sm font-medium">{tag.tag}</span>
      {showConfidence && (
        <span className="text-xs opacity-60">{Math.round(tag.confidence * 100)}%</span>
      )}
      {showAiBadge && (
        <AiAnalysisBadge isAiAnalyzed={tag.isAiAnalyzed} />
      )}
    </div>
  )
}
