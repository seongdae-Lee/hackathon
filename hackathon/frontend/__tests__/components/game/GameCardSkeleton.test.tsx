import React from 'react'
import { render } from '@testing-library/react'
import GameCardSkeleton from '@/components/game/GameCardSkeleton'

describe('GameCardSkeleton', () => {
  it('오류 없이 렌더링된다', () => {
    const { container } = render(<GameCardSkeleton />)
    expect(container.firstChild).not.toBeNull()
  })

  it('animate-pulse 클래스를 가진 요소를 렌더링한다', () => {
    const { container } = render(<GameCardSkeleton />)
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('animate-pulse')
  })
})
