import React from 'react'
import { render, screen } from '@testing-library/react'
import Footer from '@/components/layout/Footer'

describe('Footer', () => {
  it('"헬스게임 큐레이터" 텍스트를 렌더링한다', () => {
    render(<Footer />)
    expect(screen.getByText('헬스게임 큐레이터')).toBeInTheDocument()
  })

  it('설명 텍스트를 렌더링한다', () => {
    render(<Footer />)
    expect(screen.getByText('AI가 분석한 건강 효과 게임을 큐레이션합니다')).toBeInTheDocument()
  })
})
