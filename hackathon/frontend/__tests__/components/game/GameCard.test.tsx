import { render, screen } from '@testing-library/react'
import GameCard from '@/components/game/GameCard'
import type { Game } from '@/types'

// next/link는 단순 <a>로 모킹
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}))

const makeGame = (overrides: Partial<Game> = {}): Game => ({
  id: 1,
  name: '테스트 게임',
  description: '게임 설명입니다.',
  developer: '테스트 개발사',
  iconUrl: 'https://example.com/icon.png',
  rating: 4.5,
  downloadCount: 1000000,
  category: '피트니스',
  playStoreUrl: null,
  appStoreUrl: null,
  createdAt: '2024-01-01T00:00:00Z',
  healthTags: [],
  ...overrides,
})

describe('GameCard', () => {
  it('게임명과 개발사를 렌더링한다', () => {
    render(<GameCard game={makeGame()} />)
    expect(screen.getByText('테스트 게임')).toBeInTheDocument()
    expect(screen.getByText('테스트 개발사')).toBeInTheDocument()
  })

  it('평점을 소수점 1자리로 표시한다', () => {
    render(<GameCard game={makeGame({ rating: 4.5 })} />)
    expect(screen.getByText('★ 4.5')).toBeInTheDocument()
  })

  it('카테고리를 표시한다', () => {
    render(<GameCard game={makeGame()} />)
    expect(screen.getByText('피트니스')).toBeInTheDocument()
  })

  it('게임 상세 링크가 올바른 href를 가진다', () => {
    render(<GameCard game={makeGame({ id: 42 })} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/games/42')
  })

  describe('다운로드 수 포맷', () => {
    it('1억 이상은 "X억+"로 표시한다', () => {
      render(<GameCard game={makeGame({ downloadCount: 100000000 })} />)
      expect(screen.getByText('1억+')).toBeInTheDocument()
    })

    it('1천만 이상은 "X천만+"로 표시한다', () => {
      render(<GameCard game={makeGame({ downloadCount: 50000000 })} />)
      expect(screen.getByText('5천만+')).toBeInTheDocument()
    })

    it('1백만 이상은 "X백만+"로 표시한다', () => {
      render(<GameCard game={makeGame({ downloadCount: 1000000 })} />)
      expect(screen.getByText('1백만+')).toBeInTheDocument()
    })

    it('1만 이상은 "X만+"로 표시한다', () => {
      render(<GameCard game={makeGame({ downloadCount: 50000 })} />)
      expect(screen.getByText('5만+')).toBeInTheDocument()
    })
  })

  it('healthTags가 있으면 최대 3개까지 표시한다', () => {
    const healthTags = [
      { id: 1, tag: '#심폐기능', confidence: 0.9, aiDescription: null, isAiAnalyzed: false },
      { id: 2, tag: '#근력강화', confidence: 0.8, aiDescription: null, isAiAnalyzed: false },
      { id: 3, tag: '#스트레스해소', confidence: 0.7, aiDescription: null, isAiAnalyzed: false },
      { id: 4, tag: '#인지개선', confidence: 0.6, aiDescription: null, isAiAnalyzed: false },
    ]
    render(<GameCard game={makeGame({ healthTags })} />)
    expect(screen.getByText('#심폐기능')).toBeInTheDocument()
    expect(screen.getByText('#근력강화')).toBeInTheDocument()
    expect(screen.getByText('#스트레스해소')).toBeInTheDocument()
    // 4번째 태그는 "+1"로 표시
    expect(screen.getByText('+1')).toBeInTheDocument()
    expect(screen.queryByText('#인지개선')).not.toBeInTheDocument()
  })

  it('healthTags가 없으면 태그 영역을 렌더링하지 않는다', () => {
    render(<GameCard game={makeGame({ healthTags: [] })} />)
    expect(screen.queryByText('#심폐기능')).not.toBeInTheDocument()
  })
})
