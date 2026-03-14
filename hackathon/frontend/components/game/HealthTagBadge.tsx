import { HealthTag } from '@/types'

interface HealthTagBadgeProps {
  tag: HealthTag
  size?: 'sm' | 'md'
  showConfidence?: boolean
}

// 태그별 색상 매핑
const TAG_COLORS: Record<string, string> = {
  '#심폐기능': 'bg-red-50 text-red-700 border-red-200',
  '#근력강화': 'bg-orange-50 text-orange-700 border-orange-200',
  '#스트레스해소': 'bg-blue-50 text-blue-700 border-blue-200',
  '#인지개선': 'bg-purple-50 text-purple-700 border-purple-200',
  '#반응훈련': 'bg-yellow-50 text-yellow-700 border-yellow-200',
}

const DEFAULT_COLOR = 'bg-gray-50 text-gray-700 border-gray-200'

export default function HealthTagBadge({ tag, size = 'md', showConfidence = false }: HealthTagBadgeProps) {
  const colorClass = TAG_COLORS[tag.tag] ?? DEFAULT_COLOR

  if (size === 'sm') {
    return (
      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
        {tag.tag}
      </span>
    )
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${colorClass}`}>
      <span className="text-sm font-medium">{tag.tag}</span>
      {showConfidence && (
        <span className="text-xs opacity-70">{Math.round(tag.confidence * 100)}%</span>
      )}
    </div>
  )
}
