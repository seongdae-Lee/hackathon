import { render, screen, fireEvent } from '@testing-library/react'
import CategoryFilter from '@/components/game/CategoryFilter'

const CATEGORIES = ['달리기', '피트니스', '명상/스트레스 해소']

describe('CategoryFilter', () => {
  it('"전체" 버튼을 항상 렌더링한다', () => {
    render(<CategoryFilter categories={CATEGORIES} selectedCategory={null} onCategoryChange={jest.fn()} />)
    expect(screen.getByRole('button', { name: '전체' })).toBeInTheDocument()
  })

  it('전달된 카테고리 버튼들을 렌더링한다', () => {
    render(<CategoryFilter categories={CATEGORIES} selectedCategory={null} onCategoryChange={jest.fn()} />)
    expect(screen.getByRole('button', { name: /달리기/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /피트니스/ })).toBeInTheDocument()
  })

  it('selectedCategory가 null이면 "전체" 버튼이 활성화 스타일을 가진다', () => {
    render(<CategoryFilter categories={CATEGORIES} selectedCategory={null} onCategoryChange={jest.fn()} />)
    const allButton = screen.getByRole('button', { name: '전체' })
    expect(allButton).toHaveClass('bg-gray-900')
  })

  it('카테고리 버튼 클릭 시 해당 카테고리 값으로 onCategoryChange를 호출한다', () => {
    const onCategoryChange = jest.fn()
    render(<CategoryFilter categories={CATEGORIES} selectedCategory={null} onCategoryChange={onCategoryChange} />)
    fireEvent.click(screen.getByRole('button', { name: /달리기/ }))
    expect(onCategoryChange).toHaveBeenCalledWith('달리기')
  })

  it('"전체" 버튼 클릭 시 null로 onCategoryChange를 호출한다', () => {
    const onCategoryChange = jest.fn()
    render(<CategoryFilter categories={CATEGORIES} selectedCategory="달리기" onCategoryChange={onCategoryChange} />)
    fireEvent.click(screen.getByRole('button', { name: '전체' }))
    expect(onCategoryChange).toHaveBeenCalledWith(null)
  })

  it('이미 선택된 카테고리 버튼 클릭 시 null로 onCategoryChange를 호출한다 (토글)', () => {
    const onCategoryChange = jest.fn()
    render(<CategoryFilter categories={CATEGORIES} selectedCategory="달리기" onCategoryChange={onCategoryChange} />)
    fireEvent.click(screen.getByRole('button', { name: /달리기/ }))
    expect(onCategoryChange).toHaveBeenCalledWith(null)
  })
})
