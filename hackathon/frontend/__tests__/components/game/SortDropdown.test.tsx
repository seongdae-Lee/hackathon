import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import SortDropdown from '@/components/game/SortDropdown'
import { SortOption } from '@/types'

describe('SortDropdown', () => {
  it('3개의 정렬 옵션(인기순, 평점순, 최신순)을 렌더링한다', () => {
    render(<SortDropdown value="popular" onChange={jest.fn()} />)
    expect(screen.getByText('인기순')).toBeInTheDocument()
    expect(screen.getByText('평점순')).toBeInTheDocument()
    expect(screen.getByText('최신순')).toBeInTheDocument()
  })

  it('현재 value가 선택된 옵션으로 표시된다', () => {
    render(<SortDropdown value="rating" onChange={jest.fn()} />)
    const select = screen.getByRole('combobox') as HTMLSelectElement
    expect(select.value).toBe('rating')
  })

  it('선택 변경 시 onChange가 새 value와 함께 호출된다', () => {
    const onChange = jest.fn()
    render(<SortDropdown value="popular" onChange={onChange} />)
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'latest' } })
    expect(onChange).toHaveBeenCalledWith('latest' as SortOption)
  })

  it('popular 값이 선택된 상태로 렌더링된다', () => {
    render(<SortDropdown value="popular" onChange={jest.fn()} />)
    const select = screen.getByRole('combobox') as HTMLSelectElement
    expect(select.value).toBe('popular')
  })

  it('latest 값이 선택된 상태로 렌더링된다', () => {
    render(<SortDropdown value="latest" onChange={jest.fn()} />)
    const select = screen.getByRole('combobox') as HTMLSelectElement
    expect(select.value).toBe('latest')
  })
})
