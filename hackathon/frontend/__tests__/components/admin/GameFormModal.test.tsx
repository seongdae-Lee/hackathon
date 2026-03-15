import { render, screen, fireEvent } from '@testing-library/react'
import GameFormModal from '@/components/admin/GameFormModal'
import type { AdminGame } from '@/types'

const defaultProps = {
  mode: 'create' as const,
  isOpen: true,
  isLoading: false,
  onClose: jest.fn(),
  onSubmit: jest.fn(),
  errorMessage: null,
}

const makeAdminGame = (overrides: Partial<AdminGame> = {}): AdminGame => ({
  id: 1,
  name: '좀비런',
  description: '좀비를 피해 달리는 게임',
  developer: 'Six to Start',
  iconUrl: 'https://example.com/icon.png',
  rating: 4.5,
  downloadCount: 5000000,
  category: '달리기',
  playStoreUrl: null,
  appStoreUrl: null,
  createdAt: '2024-01-01T00:00:00Z',
  isAiAnalyzed: true,
  healthTags: [],
  ...overrides,
})

// 유효한 폼 채우기 헬퍼
const fillValidForm = () => {
  fireEvent.change(screen.getByPlaceholderText('게임명을 입력하세요'), { target: { value: '테스트 게임' } })
  fireEvent.change(screen.getByPlaceholderText('게임 설명을 입력하세요'), { target: { value: '게임 설명입니다.' } })
  fireEvent.change(screen.getByPlaceholderText('개발사명을 입력하세요'), { target: { value: '테스트 개발사' } })
  fireEvent.change(screen.getByPlaceholderText('https://example.com/icon.png'), {
    target: { value: 'https://example.com/icon.png' },
  })
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('GameFormModal - 표시 여부', () => {
  it('isOpen=false이면 렌더링하지 않는다', () => {
    render(<GameFormModal {...defaultProps} isOpen={false} />)
    expect(screen.queryByText('게임 추가')).not.toBeInTheDocument()
  })

  it('isOpen=true이면 모달을 렌더링한다', () => {
    render(<GameFormModal {...defaultProps} />)
    expect(screen.getByText('게임 추가')).toBeInTheDocument()
  })

  it('mode=edit이면 "게임 수정" 제목을 표시한다', () => {
    render(<GameFormModal {...defaultProps} mode="edit" initialData={makeAdminGame()} />)
    expect(screen.getByText('게임 수정')).toBeInTheDocument()
  })
})

describe('GameFormModal - 편집 모드 초기값', () => {
  it('edit 모드에서 initialData 값이 폼에 채워진다', () => {
    render(<GameFormModal {...defaultProps} mode="edit" initialData={makeAdminGame()} />)
    expect(screen.getByDisplayValue('좀비런')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Six to Start')).toBeInTheDocument()
    expect(screen.getByDisplayValue('https://example.com/icon.png')).toBeInTheDocument()
  })
})

describe('GameFormModal - 유효성 검사', () => {
  it('게임명이 비어있으면 에러 메시지를 표시하고 onSubmit을 호출하지 않는다', () => {
    render(<GameFormModal {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: '저장' }))
    expect(screen.getByText('게임명은 필수입니다.')).toBeInTheDocument()
    expect(defaultProps.onSubmit).not.toHaveBeenCalled()
  })

  it('설명이 비어있으면 에러 메시지를 표시한다', () => {
    render(<GameFormModal {...defaultProps} />)
    fireEvent.change(screen.getByPlaceholderText('게임명을 입력하세요'), { target: { value: '테스트' } })
    fireEvent.click(screen.getByRole('button', { name: '저장' }))
    expect(screen.getByText('설명은 필수입니다.')).toBeInTheDocument()
  })

  it('아이콘 URL이 비어있으면 에러 메시지를 표시한다', () => {
    render(<GameFormModal {...defaultProps} />)
    fireEvent.change(screen.getByPlaceholderText('게임명을 입력하세요'), { target: { value: '테스트' } })
    fireEvent.change(screen.getByPlaceholderText('게임 설명을 입력하세요'), { target: { value: '설명' } })
    fireEvent.change(screen.getByPlaceholderText('개발사명을 입력하세요'), { target: { value: '개발사' } })
    fireEvent.click(screen.getByRole('button', { name: '저장' }))
    expect(screen.getByText('아이콘 URL은 필수입니다.')).toBeInTheDocument()
  })

  it('아이콘 URL이 유효하지 않은 형식이면 에러 메시지를 표시한다', () => {
    render(<GameFormModal {...defaultProps} />)
    fireEvent.change(screen.getByPlaceholderText('게임명을 입력하세요'), { target: { value: '테스트' } })
    fireEvent.change(screen.getByPlaceholderText('게임 설명을 입력하세요'), { target: { value: '설명' } })
    fireEvent.change(screen.getByPlaceholderText('개발사명을 입력하세요'), { target: { value: '개발사' } })
    fireEvent.change(screen.getByPlaceholderText('https://example.com/icon.png'), {
      target: { value: 'not-a-url' },
    })
    fireEvent.click(screen.getByRole('button', { name: '저장' }))
    expect(screen.getByText(/유효한 URL 형식/)).toBeInTheDocument()
  })

  it('개발사가 비어있으면 에러 메시지를 표시한다', () => {
    render(<GameFormModal {...defaultProps} />)
    fireEvent.change(screen.getByPlaceholderText('게임명을 입력하세요'), { target: { value: '테스트' } })
    fireEvent.change(screen.getByPlaceholderText('게임 설명을 입력하세요'), { target: { value: '설명' } })
    // developer 비워두고 submit
    fireEvent.click(screen.getByRole('button', { name: '저장' }))
    expect(screen.getByText('개발사는 필수입니다.')).toBeInTheDocument()
  })
})

describe('GameFormModal - 폼 제출', () => {
  it('유효한 폼이면 onSubmit을 올바른 데이터로 호출한다', () => {
    render(<GameFormModal {...defaultProps} />)
    fillValidForm()
    fireEvent.click(screen.getByRole('button', { name: '저장' }))
    expect(defaultProps.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: '테스트 게임',
        description: '게임 설명입니다.',
        developer: '테스트 개발사',
        iconUrl: 'https://example.com/icon.png',
      })
    )
  })
})

describe('GameFormModal - 버튼 동작', () => {
  it('취소 버튼 클릭 시 onClose를 호출한다', () => {
    render(<GameFormModal {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: '취소' }))
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('닫기(✕) 버튼 클릭 시 onClose를 호출한다', () => {
    render(<GameFormModal {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: '닫기' }))
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('isLoading=true이면 저장 버튼이 비활성화되고 "저장 중..." 텍스트를 표시한다', () => {
    render(<GameFormModal {...defaultProps} isLoading={true} />)
    const saveBtn = screen.getByRole('button', { name: '저장 중...' })
    expect(saveBtn).toBeDisabled()
  })

  it('errorMessage가 있으면 서버 에러 메시지를 표시한다', () => {
    render(<GameFormModal {...defaultProps} errorMessage="서버 오류가 발생했습니다." />)
    expect(screen.getByText('서버 오류가 발생했습니다.')).toBeInTheDocument()
  })
})

describe('GameFormModal - 입력 변경', () => {
  it('카테고리 select 변경이 반영된다', () => {
    render(<GameFormModal {...defaultProps} />)
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: '피트니스' } })
    expect(screen.getByDisplayValue('피트니스')).toBeInTheDocument()
  })

  it('다운로드 수 입력이 반영된다', () => {
    render(<GameFormModal {...defaultProps} />)
    const inputs = screen.getAllByRole('spinbutton')
    // spinbutton은 number input - downloadCount가 포함됨
    const downloadInput = inputs.find(el => (el as HTMLInputElement).min === '0' && (el as HTMLInputElement).step !== '0.1')
    if (downloadInput) {
      fireEvent.change(downloadInput, { target: { value: '100000' } })
      expect((downloadInput as HTMLInputElement).value).toBe('100000')
    }
  })
})
