'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getToken, removeToken } from '@/lib/api'

/**
 * 관리자 JWT 인증 훅
 * - localStorage에 저장된 JWT 토큰의 유효성을 확인
 * - 토큰 없거나 만료 시 로그인 페이지로 리다이렉트
 */
export function useAdminAuth() {
  const router = useRouter()

  // SSR 안전 처리: 서버에서는 null, 클라이언트에서 토큰 상태 확인
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(() => {
    if (typeof window === 'undefined') return null
    return getToken() !== null
  })

  // 미인증 상태 확정 시 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace('/admin/login')
    }
  }, [isAuthenticated, router])

  const logout = () => {
    removeToken()
    setIsAuthenticated(false)
  }

  return { isAuthenticated, logout }
}
