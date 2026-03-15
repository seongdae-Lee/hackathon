import { render, screen, fireEvent } from '@testing-library/react'
import ErrorFallback from '@/components/ui/ErrorFallback'

describe('ErrorFallback', () => {
  it('기본 에러 메시지를 렌더링한다', () => {
    render(<ErrorFallback />)
    expect(screen.getByText('데이터를 불러오는데 실패했습니다.')).toBeInTheDocument()
  })

  it('커스텀 메시지를 렌더링한다', () => {
    render(<ErrorFallback message="서버에 연결할 수 없습니다." />)
    expect(screen.getByText('서버에 연결할 수 없습니다.')).toBeInTheDocument()
  })

  it('hint가 제공되면 hint 텍스트를 표시한다', () => {
    render(<ErrorFallback hint="잠시 후 다시 시도해주세요." />)
    expect(screen.getByText('잠시 후 다시 시도해주세요.')).toBeInTheDocument()
  })

  it('hint가 없으면 hint 텍스트를 표시하지 않는다', () => {
    render(<ErrorFallback />)
    expect(screen.queryByText('잠시 후 다시 시도해주세요.')).not.toBeInTheDocument()
  })

  it('onRetry가 제공되면 "다시 시도" 버튼을 표시한다', () => {
    render(<ErrorFallback onRetry={() => {}} />)
    expect(screen.getByRole('button', { name: '다시 시도' })).toBeInTheDocument()
  })

  it('onRetry가 없으면 "다시 시도" 버튼을 표시하지 않는다', () => {
    render(<ErrorFallback />)
    expect(screen.queryByRole('button', { name: '다시 시도' })).not.toBeInTheDocument()
  })

  it('"다시 시도" 버튼 클릭 시 onRetry 콜백을 호출한다', () => {
    const onRetry = jest.fn()
    render(<ErrorFallback onRetry={onRetry} />)
    fireEvent.click(screen.getByRole('button', { name: '다시 시도' }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
