import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Header from '@/components/layout/Header'

const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    className,
    onClick,
  }: {
    href: string
    children: React.ReactNode
    className?: string
    onClick?: () => void
  }) => (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  ),
}))

beforeEach(() => {
  mockPush.mockClear()
})

describe('Header', () => {
  it('"/" 경로의 로고 링크를 렌더링한다', () => {
    render(<Header />)
    // 로고 링크는 "/" href를 가진 첫 번째 링크
    const links = screen.getAllByRole('link')
    const logoLink = links.find((l) => l.getAttribute('href') === '/')
    expect(logoLink).toBeTruthy()
  })

  it('검색 입력(input)을 렌더링한다', () => {
    render(<Header />)
    // placeholder로 검색 input 찾기
    const inputs = screen.getAllByPlaceholderText('게임명, 태그, 카테고리 검색...')
    expect(inputs.length).toBeGreaterThan(0)
  })

  it('2글자 미만 검색어로 submit 시 router.push를 호출하지 않는다', () => {
    render(<Header />)
    const inputs = screen.getAllByPlaceholderText('게임명, 태그, 카테고리 검색...')
    const input = inputs[0]
    fireEvent.change(input, { target: { value: '가' } })
    const form = input.closest('form')!
    fireEvent.submit(form)
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('2글자 이상 검색어로 submit 시 올바른 경로로 router.push를 호출한다', () => {
    render(<Header />)
    const inputs = screen.getAllByPlaceholderText('게임명, 태그, 카테고리 검색...')
    const input = inputs[0]
    fireEvent.change(input, { target: { value: '좀비런' } })
    const form = input.closest('form')!
    fireEvent.submit(form)
    expect(mockPush).toHaveBeenCalledWith('/search?q=%EC%A2%80%EB%B9%84%EB%9F%B0')
  })

  it('햄버거 버튼 클릭 시 모바일 메뉴가 표시된다', () => {
    render(<Header />)
    // 초기에는 모바일 전용 "md:hidden" 컨테이너가 없어야 함
    // - 데스크톱 nav에 맞춤 추천이 1개 있음
    expect(screen.getAllByText('맞춤 추천')).toHaveLength(1)
    const menuBtn = screen.getByLabelText('메뉴 열기')
    fireEvent.click(menuBtn)
    // 모바일 메뉴 열리면 맞춤 추천 링크가 2개가 됨 (데스크톱 + 모바일)
    expect(screen.getAllByText('맞춤 추천')).toHaveLength(2)
  })

  it('모바일 메뉴에서 맞춤 추천 링크 클릭 시 메뉴가 닫힌다', () => {
    render(<Header />)
    const menuBtn = screen.getByLabelText('메뉴 열기')
    fireEvent.click(menuBtn)
    // 모바일 메뉴가 열려있을 때 링크 2개 존재
    const recommendLinks = screen.getAllByText('맞춤 추천')
    expect(recommendLinks).toHaveLength(2)
    // 모바일 메뉴의 링크 (두 번째 - "block" 클래스를 가진 링크) 클릭
    const mobileLink = recommendLinks.find((el) => el.className.includes('block'))!
    fireEvent.click(mobileLink)
    // 메뉴가 닫히면 다시 1개만 남음
    expect(screen.getAllByText('맞춤 추천')).toHaveLength(1)
  })

  it('빈 검색어로 submit 시 router.push를 호출하지 않는다', () => {
    render(<Header />)
    const inputs = screen.getAllByPlaceholderText('게임명, 태그, 카테고리 검색...')
    const input = inputs[0]
    fireEvent.change(input, { target: { value: '' } })
    const form = input.closest('form')!
    fireEvent.submit(form)
    expect(mockPush).not.toHaveBeenCalled()
  })
})
