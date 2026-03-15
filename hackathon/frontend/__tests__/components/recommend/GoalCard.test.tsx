import { render, screen, fireEvent } from '@testing-library/react'
import GoalCard from '@/components/recommend/GoalCard'

const defaultProps = {
  goalLabel: '심폐기능 향상',
  goalValue: '심폐기능',
  emoji: '❤️',
  colorClass: 'bg-red-50 text-red-500',
  isSelected: false,
  onClick: jest.fn(),
}

describe('GoalCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('goalLabel과 emoji를 렌더링한다', () => {
    render(<GoalCard {...defaultProps} />)
    expect(screen.getByText('심폐기능 향상')).toBeInTheDocument()
    expect(screen.getByText('❤️')).toBeInTheDocument()
  })

  it('클릭 시 goalValue를 인자로 onClick을 호출한다', () => {
    render(<GoalCard {...defaultProps} />)
    fireEvent.click(screen.getByRole('button'))
    expect(defaultProps.onClick).toHaveBeenCalledWith('심폐기능')
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1)
  })

  it('isSelected=true이면 "선택됨 ✓" 텍스트를 표시한다', () => {
    render(<GoalCard {...defaultProps} isSelected={true} />)
    expect(screen.getByText('선택됨 ✓')).toBeInTheDocument()
  })

  it('isSelected=false이면 "선택됨 ✓" 텍스트를 표시하지 않는다', () => {
    render(<GoalCard {...defaultProps} isSelected={false} />)
    expect(screen.queryByText('선택됨 ✓')).not.toBeInTheDocument()
  })

  it('aria-pressed 속성이 isSelected 값을 반영한다', () => {
    const { rerender } = render(<GoalCard {...defaultProps} isSelected={false} />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')

    rerender(<GoalCard {...defaultProps} isSelected={true} />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('isSelected=true이면 colorClass가 적용된다', () => {
    render(<GoalCard {...defaultProps} isSelected={true} />)
    expect(screen.getByRole('button')).toHaveClass('bg-red-50')
  })
})
