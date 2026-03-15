'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const AUTH_KEY = 'admin_authenticated'

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null) // null = 확인 중
  const router = useRouter()

  useEffect(() => {
    const auth = sessionStorage.getItem(AUTH_KEY)
    if (auth === 'true') {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
      router.replace('/admin/login')
    }
  }, [router])

  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY)
    router.replace('/admin/login')
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
