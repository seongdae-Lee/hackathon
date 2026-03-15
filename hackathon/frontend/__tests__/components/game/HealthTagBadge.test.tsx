import { render, screen } from '@testing-library/react'
import HealthTagBadge from '@/components/game/HealthTagBadge'
import type { HealthTag } from '@/types'

const mockTag: HealthTag = {
  id: 1,
  tag: '#심폐기능',
  confidence: 0.85,
  aiDescription: 'AI 분석 결과',
  isAiAnalyzed: true,
}

const manualTag: HealthTag = {
  id: 2,
  tag: '#근력강화',
  confidence: 0.7,
  aiDescription: null,
  isAiAnalyzed: false,
}

describe('HealthTagBadge', () => {
  it('태그명을 렌더링한다', () => {
    render(<HealthTagBadge tag={mockTag} />)
    expect(screen.getByText('#심폐기능')).toBeInTheDocument()
  })

  it('size="sm"이면 span 요소로 렌더링된다', () => {
    render(<HealthTagBadge tag={mockTag} size="sm" />)
    const el = screen.getByText('#심폐기능')
    expect(el.tagName).toBe('SPAN')
  })

  it('size="md"(기본값)이면 신뢰도를 표시하지 않는다 (showConfidence 기본값 false)', () => {
    render(<HealthTagBadge tag={mockTag} />)
    expect(screen.queryByText('85%')).not.toBeInTheDocument()
  })

  it('showConfidence=true이면 신뢰도 퍼센트를 표시한다', () => {
    render(<HealthTagBadge tag={mockTag} showConfidence />)
    expect(screen.getByText('85%')).toBeInTheDocument()
  })

  it('showAiBadge=true이고 isAiAnalyzed=true이면 "AI 분석" 배지를 표시한다', () => {
    render(<HealthTagBadge tag={mockTag} showAiBadge />)
    expect(screen.getByText('AI 분석')).toBeInTheDocument()
  })

  it('showAiBadge=true이고 isAiAnalyzed=false이면 "수동 태그" 배지를 표시한다', () => {
    render(<HealthTagBadge tag={manualTag} showAiBadge />)
    expect(screen.getByText('수동 태그')).toBeInTheDocument()
  })

  it('showAiBadge=false(기본값)이면 배지를 표시하지 않는다', () => {
    render(<HealthTagBadge tag={mockTag} />)
    expect(screen.queryByText('AI 분석')).not.toBeInTheDocument()
    expect(screen.queryByText('수동 태그')).not.toBeInTheDocument()
  })
})
