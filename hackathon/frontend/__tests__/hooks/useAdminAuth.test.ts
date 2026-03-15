import { renderHook, act } from '@testing-library/react'
import { useAdminAuth } from '@/hooks/useAdminAuth'

const mockReplace = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}))

jest.mock('@/lib/api', () => ({
  getToken: jest.fn(),
  removeToken: jest.fn(),
}))

// 각 테스트 후 mock 초기화
beforeEach(() => {
  jest.clearAllMocks()
})

describe('useAdminAuth', () => {
  it('getToken이 토큰을 반환하면 isAuthenticated=true를 반환한다', () => {
    const { getToken } = require('@/lib/api')
    ;(getToken as jest.Mock).mockReturnValue('valid-token')

    const { result } = renderHook(() => useAdminAuth())
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('getToken이 null을 반환하면 isAuthenticated=false를 반환한다', () => {
    const { getToken } = require('@/lib/api')
    ;(getToken as jest.Mock).mockReturnValue(null)

    const { result } = renderHook(() => useAdminAuth())
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('isAuthenticated=false이면 router.replace("/admin/login")을 호출한다', () => {
    const { getToken } = require('@/lib/api')
    ;(getToken as jest.Mock).mockReturnValue(null)

    renderHook(() => useAdminAuth())
    expect(mockReplace).toHaveBeenCalledWith('/admin/login')
  })

  it('logout() 호출 시 removeToken을 호출한다', () => {
    const { getToken, removeToken } = require('@/lib/api')
    ;(getToken as jest.Mock).mockReturnValue('valid-token')

    const { result } = renderHook(() => useAdminAuth())
    act(() => {
      result.current.logout()
    })
    expect(removeToken).toHaveBeenCalledTimes(1)
  })

  it('logout() 호출 후 isAuthenticated가 false로 변경된다', () => {
    const { getToken } = require('@/lib/api')
    ;(getToken as jest.Mock).mockReturnValue('valid-token')

    const { result } = renderHook(() => useAdminAuth())
    expect(result.current.isAuthenticated).toBe(true)
    act(() => {
      result.current.logout()
    })
    expect(result.current.isAuthenticated).toBe(false)
  })
})
