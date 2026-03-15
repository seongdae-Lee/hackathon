import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import GameTable from '@/components/admin/GameTable'
import { AdminGame } from '@/types'

// img 태그 src 없는 경우 console.error 억제
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  (console.error as jest.Mock).mockRestore()
})

const makeGame = (overrides: Partial<AdminGame> = {}): AdminGame => ({
  id: 1,
  name: '좀비런',
  description: '달리기 게임',
  developer: '개발사',
  iconUrl: '',
  rating: 4.5,
  downloadCount: 10000,
  category: '달리기',
  playStoreUrl: null,
  appStoreUrl: null,
  createdAt: '2024-01-15T00:00:00Z',
  isAiAnalyzed: false,
  healthTags: [],
  ...overrides,
})

const defaultProps = {
  games: [],
  analyzingId: null,
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onAnalyze: jest.fn(),
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('GameTable', () => {
  it('games가 빈 배열이면 "등록된 게임이 없습니다." 메시지를 표시한다', () => {
    render(<GameTable {...defaultProps} />)
    expect(screen.getByText('등록된 게임이 없습니다.')).toBeInTheDocument()
  })

  it('게임 목록이 있으면 게임 이름을 테이블에 렌더링한다', () => {
    const games = [makeGame({ id: 1, name: '좀비런' }), makeGame({ id: 2, name: '피트니스 파이터' })]
    render(<GameTable {...defaultProps} games={games} />)
    expect(screen.getByText('좀비런')).toBeInTheDocument()
    expect(screen.getByText('피트니스 파이터')).toBeInTheDocument()
  })

  it('AI 분석 완료된 게임은 ✅를 표시한다', () => {
    const games = [makeGame({ isAiAnalyzed: true })]
    render(<GameTable {...defaultProps} games={games} />)
    expect(screen.getByText('✅')).toBeInTheDocument()
  })

  it('AI 분석 미완료 게임은 ⬜를 표시한다', () => {
    const games = [makeGame({ isAiAnalyzed: false })]
    render(<GameTable {...defaultProps} games={games} />)
    expect(screen.getByText('⬜')).toBeInTheDocument()
  })

  it('수정 버튼 클릭 시 onEdit이 해당 게임과 함께 호출된다', () => {
    const onEdit = jest.fn()
    const game = makeGame()
    render(<GameTable {...defaultProps} games={[game]} onEdit={onEdit} />)
    fireEvent.click(screen.getByText('수정'))
    expect(onEdit).toHaveBeenCalledWith(game)
  })

  it('삭제 버튼 클릭 시 onDelete가 해당 게임과 함께 호출된다', () => {
    const onDelete = jest.fn()
    const game = makeGame()
    render(<GameTable {...defaultProps} games={[game]} onDelete={onDelete} />)
    fireEvent.click(screen.getByText('삭제'))
    expect(onDelete).toHaveBeenCalledWith(game)
  })

  it('AI 재분석 버튼 클릭 시 onAnalyze가 게임 id와 함께 호출된다', () => {
    const onAnalyze = jest.fn()
    const game = makeGame({ id: 7 })
    render(<GameTable {...defaultProps} games={[game]} onAnalyze={onAnalyze} />)
    fireEvent.click(screen.getByText('AI 재분석'))
    expect(onAnalyze).toHaveBeenCalledWith(7)
  })

  it('analyzingId가 게임 id와 같으면 버튼이 비활성화되고 "분석 중..."을 표시한다', () => {
    const game = makeGame({ id: 3 })
    render(<GameTable {...defaultProps} games={[game]} analyzingId={3} />)
    const analyzeBtn = screen.getByText('분석 중...')
    expect(analyzeBtn).toBeDisabled()
  })
})
