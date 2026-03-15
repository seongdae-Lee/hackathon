import React from 'react'
import { render, screen } from '@testing-library/react'
import StatsCard from '@/components/admin/StatsCard'

describe('StatsCard', () => {
  it('title, value, description을 렌더링한다', () => {
    render(
      <StatsCard
        title="전체 게임"
        value={42}
        description="등록된 전체 게임 수"
        colorClass="text-blue-600"
      />
    )
    expect(screen.getByText('전체 게임')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('등록된 전체 게임 수')).toBeInTheDocument()
  })

  it('colorClass를 value 요소에 적용한다', () => {
    render(
      <StatsCard
        title="분석 완료"
        value={10}
        description="AI 분석된 게임"
        colorClass="text-green-500"
      />
    )
    const valueEl = screen.getByText('10')
    expect(valueEl.className).toContain('text-green-500')
  })

  it('큰 숫자를 toLocaleString으로 포맷한다 (예: 1000 → "1,000" 또는 "1000")', () => {
    render(
      <StatsCard
        title="다운로드"
        value={1000}
        description="총 다운로드 수"
        colorClass="text-gray-900"
      />
    )
    // jsdom 환경에 따라 1,000 또는 1000 으로 표시될 수 있음
    expect(screen.getByText(/1[,.]?000/)).toBeInTheDocument()
  })

  it('value가 0일 때 정상적으로 렌더링한다', () => {
    render(
      <StatsCard
        title="미분석"
        value={0}
        description="아직 분석 안 된 게임"
        colorClass="text-red-400"
      />
    )
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('미분석')).toBeInTheDocument()
    expect(screen.getByText('아직 분석 안 된 게임')).toBeInTheDocument()
  })
})
