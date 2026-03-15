import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog'

const defaultProps = {
  gameName: '좀비런',
  isOpen: true,
  isLoading: false,
  onClose: jest.fn(),
  onConfirm: jest.fn(),
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('DeleteConfirmDialog', () => {
  it('isOpen=false이면 아무것도 렌더링하지 않는다', () => {
    const { container } = render(
      <DeleteConfirmDialog {...defaultProps} isOpen={false} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('isOpen=true이면 게임 이름을 포함한 다이얼로그를 렌더링한다', () => {
    render(<DeleteConfirmDialog {...defaultProps} />)
    expect(screen.getByText('좀비런')).toBeInTheDocument()
    expect(screen.getByText('게임 삭제')).toBeInTheDocument()
  })

  it('취소 버튼 클릭 시 onClose가 호출된다', () => {
    const onClose = jest.fn()
    render(<DeleteConfirmDialog {...defaultProps} onClose={onClose} />)
    fireEvent.click(screen.getByText('취소'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('삭제 버튼 클릭 시 onConfirm이 호출된다', () => {
    const onConfirm = jest.fn()
    render(<DeleteConfirmDialog {...defaultProps} onConfirm={onConfirm} />)
    fireEvent.click(screen.getByText('삭제'))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('isLoading=true이면 버튼이 비활성화되고 삭제 버튼에 "삭제 중..."이 표시된다', () => {
    render(<DeleteConfirmDialog {...defaultProps} isLoading={true} />)
    expect(screen.getByText('삭제 중...')).toBeInTheDocument()
    const buttons = screen.getAllByRole('button')
    buttons.forEach((btn) => {
      expect(btn).toBeDisabled()
    })
  })

  it('isLoading=false이면 삭제 버튼에 "삭제"가 표시된다', () => {
    render(<DeleteConfirmDialog {...defaultProps} isLoading={false} />)
    expect(screen.getByText('삭제')).toBeInTheDocument()
    expect(screen.queryByText('삭제 중...')).not.toBeInTheDocument()
  })
})
