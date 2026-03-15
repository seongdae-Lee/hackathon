'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const AUTH_KEY = 'admin_authenticated'

export function useAdminAuth() {
  const router = useRouter()

  // sessionStorage는 브라우저 전용 API → SSR 안전 처리 후 lazy 초기화
  // setState를 effect 내부에서 직접 호출하지 않아 cascading render 방지
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(() => {
    if (typeof window === 'undefined') return null
    return sessionStorage.getItem(AUTH_KEY) === 'true'
  })

  // 미인증 상태 확정 시 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace('/admin/login')
    }
  }, [isAuthenticated, router])

  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY)
    setIsAuthenticated(false)
  }

  return { isAuthenticated, logout }
}

export function login(id: string, password: string): boolean {
  if (id === 'admin' && password === 'admin') {
    sessionStorage.setItem(AUTH_KEY, 'true')
    return true
  }
  return false
}
