import { render, screen } from '@testing-library/react'
import RecommendResultCard from '@/components/recommend/RecommendResultCard'
import type { RecommendResultItem } from '@/types'

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

const makeItem = (overrides: Partial<RecommendResultItem> = {}): RecommendResultItem => ({
  game: {
    id: 1,
    name: '테스트 게임',
    description: '설명',
    developer: '개발사',
    iconUrl: 'https://example.com/icon.png',
    rating: 4.2,
    downloadCount: 100000,
    category: '피트니스',
    playStoreUrl: null,
    appStoreUrl: null,
    createdAt: '2024-01-01T00:00:00Z',
    healthTags: [],
  },
  matchScore: 0.75,
  recommendReason: '이 게임은 심폐 기능 향상에 도움이 됩니다.',
  ...overrides,
})

describe('RecommendResultCard', () => {
  it('게임명을 렌더링한다', () => {
    render(<RecommendResultCard item={makeItem()} rank={1} />)
    expect(screen.getByText('테스트 게임')).toBeInTheDocument()
  })

  it('순위를 #N 형식으로 표시한다', () => {
    render(<RecommendResultCard item={makeItem()} rank={3} />)
    expect(screen.getByText('#3')).toBeInTheDocument()
  })

  it('매칭 점수를 퍼센트로 표시한다', () => {
    render(<RecommendResultCard item={makeItem({ matchScore: 0.75 })} rank={1} />)
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('100% 초과하는 점수는 100%로 표시된다', () => {
    render(<RecommendResultCard item={makeItem({ matchScore: 1.5 })} rank={1} />)
    // 점수 바는 100%를 초과하지 않아야 함
    expect(screen.getByText('150%')).toBeInTheDocument()
    const bar = document.querySelector('.bg-green-400') as HTMLElement
    expect(bar?.style.width).toBe('100%')
  })

  it('recommendReason이 있으면 추천 이유를 표시한다', () => {
    render(<RecommendResultCard item={makeItem()} rank={1} />)
    expect(screen.getByText(/심폐 기능 향상에 도움/)).toBeInTheDocument()
  })

  it('recommendReason이 빈 문자열이면 추천 이유 영역을 표시하지 않는다', () => {
    render(<RecommendResultCard item={makeItem({ recommendReason: '' })} rank={1} />)
    expect(screen.queryByText(/도움/)).not.toBeInTheDocument()
  })

  it('게임 상세 링크가 올바른 href를 가진다', () => {
    render(<RecommendResultCard item={makeItem()} rank={1} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/games/1')
  })
})
