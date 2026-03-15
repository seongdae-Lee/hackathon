import React from 'react'
import { render, screen } from '@testing-library/react'
import SearchResultCard from '@/components/game/SearchResultCard'
import { SearchResult } from '@/types'

// next/link mock
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    className,
  }: {
    href: string
    children: React.ReactNode
    className?: string
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}))

const makeResult = (overrides: Partial<SearchResult> = {}): SearchResult => ({
  game: {
    id: 1,
    name: '좀비런',
    description: '설명',
    developer: '개발사',
    iconUrl: '',
    rating: 4.5,
    downloadCount: 1000,
    category: '달리기',
    playStoreUrl: null,
    appStoreUrl: null,
    createdAt: '2024-01-01T00:00:00Z',
    healthTags: [
      {
        id: 1,
        tag: '#심폐기능',
        confidence: 0.9,
        aiDescription: null,
        isAiAnalyzed: true,
      },
    ],
  },
  matchedFields: ['name'],
  matchedKeyword: '좀비',
  ...overrides,
})

describe('SearchResultCard', () => {
  it('게임 이름을 렌더링한다', () => {
    render(<SearchResultCard result={makeResult()} />)
    expect(screen.getByText('좀비')).toBeInTheDocument()
  })

  it('링크의 href가 /games/{id}로 올바르게 설정된다', () => {
    render(<SearchResultCard result={makeResult()} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/games/1')
  })

  it('matchedFields에 "name"이 있을 때 "게임명 매칭" 텍스트를 표시한다', () => {
    render(<SearchResultCard result={makeResult({ matchedFields: ['name'] })} />)
    expect(screen.getByText(/게임명/)).toBeInTheDocument()
    expect(screen.getByText(/매칭/)).toBeInTheDocument()
  })

  it('카테고리가 "달리기"이면 🏃 이모지를 표시한다', () => {
    render(<SearchResultCard result={makeResult()} />)
    expect(screen.getByText('🏃')).toBeInTheDocument()
  })

  it('알 수 없는 카테고리이면 🎮 이모지를 표시한다', () => {
    const result = makeResult()
    result.game.category = '알수없는카테고리'
    render(<SearchResultCard result={result} />)
    expect(screen.getByText('🎮')).toBeInTheDocument()
  })

  it('matchedFields에 "name"이 있으면 키워드에 mark 하이라이트를 적용한다', () => {
    render(<SearchResultCard result={makeResult({ matchedKeyword: '좀비' })} />)
    const mark = document.querySelector('mark')
    expect(mark).not.toBeNull()
    expect(mark?.textContent).toBe('좀비')
  })

  it('matchedFields에 "category"가 있으면 카테고리 텍스트에 하이라이트를 적용한다', () => {
    const result = makeResult({
      matchedFields: ['category'],
      matchedKeyword: '달리기',
    })
    render(<SearchResultCard result={result} />)
    const marks = document.querySelectorAll('mark')
    const texts = Array.from(marks).map((m) => m.textContent)
    expect(texts).toContain('달리기')
  })

  it('matchedFields에 "tag"가 있으면 매칭된 건강 태그를 표시한다', () => {
    const result = makeResult({
      matchedFields: ['tag'],
      matchedKeyword: '심폐',
    })
    render(<SearchResultCard result={result} />)
    expect(screen.getByText('심폐')).toBeInTheDocument()
  })

  it('matchedFields가 ["tag"]이면 "태그 매칭" 텍스트를 표시한다', () => {
    const result = makeResult({
      matchedFields: ['tag'],
      matchedKeyword: '심폐',
    })
    render(<SearchResultCard result={result} />)
    expect(screen.getByText(/태그/)).toBeInTheDocument()
    expect(screen.getByText(/매칭/)).toBeInTheDocument()
  })

  it('키워드가 텍스트에 없으면 하이라이트(mark)가 없다', () => {
    const result = makeResult({
      matchedFields: ['name'],
      matchedKeyword: '없는키워드xyz',
    })
    render(<SearchResultCard result={result} />)
    const mark = document.querySelector('mark')
    expect(mark).toBeNull()
  })
})
