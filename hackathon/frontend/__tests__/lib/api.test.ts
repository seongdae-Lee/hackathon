import axios from 'axios'
import {
  searchGames,
  fetchGames,
  fetchRecommendations,
  fetchGame,
  fetchSimilarGames,
  fetchCategories,
  fetchAdminStats,
  fetchAdminGames,
  createGame,
  updateGame,
  deleteGame,
  analyzeGame,
  collectGames,
  adminLogin,
  saveToken,
  getToken,
  removeToken,
} from '@/lib/api'

// axios 인스턴스 모킹
jest.mock('axios', () => {
  const mockAxios = {
    create: jest.fn(),
  }
  const mockInstance = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  }
  mockAxios.create.mockReturnValue(mockInstance)
  return { ...mockAxios, default: mockAxios }
})

// 실제 api.ts가 생성한 axios 인스턴스 가져오기
const getMockClient = () => (axios.create as jest.Mock).mock.results[0]?.value

describe('searchGames', () => {
  it('쿼리가 2글자 미만이면 API를 호출하지 않고 빈 배열을 반환한다', async () => {
    const result = await searchGames('a')
    expect(result).toEqual([])
  })

  it('빈 문자열이면 빈 배열을 반환한다', async () => {
    const result = await searchGames('')
    expect(result).toEqual([])
  })

  it('공백만 있는 경우 빈 배열을 반환한다', async () => {
    const result = await searchGames('  ')
    expect(result).toEqual([])
  })

  it('100자를 초과하는 쿼리는 100자로 잘라서 API를 호출한다', async () => {
    const client = getMockClient()
    if (!client) return
    client.get.mockResolvedValueOnce({
      data: { success: true, data: [] },
    })
    const longQuery = 'a'.repeat(150)
    await searchGames(longQuery)
    expect(client.get).toHaveBeenCalledWith('/api/games/search', {
      params: { q: 'a'.repeat(100) },
    })
  })
})

describe('fetchGames', () => {
  it('API 응답 실패 시 에러를 throw한다', async () => {
    const client = getMockClient()
    if (!client) return
    client.get.mockResolvedValueOnce({
      data: { success: false, error: '서버 오류' },
    })
    await expect(fetchGames({})).rejects.toThrow('서버 오류')
  })

  it('성공 응답 시 data를 반환한다', async () => {
    const client = getMockClient()
    if (!client) return
    const mockData = { items: [], total: 0, page: 1, pageSize: 20 }
    client.get.mockResolvedValueOnce({
      data: { success: true, data: mockData },
    })
    const result = await fetchGames({})
    expect(result).toEqual(mockData)
  })
})

describe('fetchGame', () => {
  it('성공 응답 시 게임 데이터를 반환한다', async () => {
    const client = getMockClient()
    if (!client) return
    const mockGame = { id: 1, name: '테스트', healthTags: [] }
    client.get.mockResolvedValueOnce({
      data: { success: true, data: mockGame },
    })
    const result = await fetchGame(1)
    expect(result).toEqual(mockGame)
  })

  it('API 응답 실패 시 에러를 throw한다', async () => {
    const client = getMockClient()
    if (!client) return
    client.get.mockResolvedValueOnce({
      data: { success: false, error: '게임을 찾을 수 없습니다.' },
    })
    await expect(fetchGame(999)).rejects.toThrow('게임을 찾을 수 없습니다.')
  })
})

describe('fetchRecommendations', () => {
  it('healthGoals를 body에 담아 POST 요청을 보낸다', async () => {
    const client = getMockClient()
    if (!client) return
    const mockResponse = { selectedGoals: ['심폐기능'], games: [] }
    client.post.mockResolvedValueOnce({
      data: { success: true, data: mockResponse },
    })
    const result = await fetchRecommendations(['심폐기능', '근력강화'])
    expect(client.post).toHaveBeenCalledWith('/api/recommend', {
      healthGoals: ['심폐기능', '근력강화'],
    })
    expect(result).toEqual(mockResponse)
  })

  it('API 응답 실패 시 에러를 throw한다', async () => {
    const client = getMockClient()
    if (!client) return
    client.post.mockResolvedValueOnce({
      data: { success: false, error: '추천 실패' },
    })
    await expect(fetchRecommendations(['심폐기능'])).rejects.toThrow('추천 실패')
  })
})

describe('fetchSimilarGames', () => {
  it('성공 응답 시 유사 게임 배열을 반환한다', async () => {
    const client = getMockClient()
    if (!client) return
    const mockGames = [{ id: 2, name: '유사게임' }]
    client.get.mockResolvedValueOnce({
      data: { success: true, data: mockGames },
    })
    const result = await fetchSimilarGames(1)
    expect(result).toEqual(mockGames)
    expect(client.get).toHaveBeenCalledWith('/api/games/1/similar')
  })

  it('API 응답 실패 시 에러를 throw한다', async () => {
    const client = getMockClient()
    if (!client) return
    client.get.mockResolvedValueOnce({
      data: { success: false, error: '유사 게임을 가져오는데 실패했습니다.' },
    })
    await expect(fetchSimilarGames(999)).rejects.toThrow('유사 게임을 가져오는데 실패했습니다.')
  })
})

describe('fetchCategories', () => {
  it('성공 응답 시 카테고리 배열을 반환한다', async () => {
    const client = getMockClient()
    if (!client) return
    const mockCategories = ['달리기', '피트니스', '댄스/리듬']
    client.get.mockResolvedValueOnce({
      data: { success: true, data: mockCategories },
    })
    const result = await fetchCategories()
    expect(result).toEqual(mockCategories)
    expect(client.get).toHaveBeenCalledWith('/api/categories')
  })

  it('API 응답 실패 시 에러를 throw한다', async () => {
    const client = getMockClient()
    if (!client) return
    client.get.mockResolvedValueOnce({
      data: { success: false, error: '카테고리 목록을 가져오는데 실패했습니다.' },
    })
    await expect(fetchCategories()).rejects.toThrow('카테고리 목록을 가져오는데 실패했습니다.')
  })
})

describe('fetchAdminStats', () => {
  it('성공 응답 시 통계 데이터를 반환한다', async () => {
    const client = getMockClient()
    if (!client) return
    const mockStats = { totalGames: 100, analyzedGames: 80, unanalyzedGames: 20 }
    client.get.mockResolvedValueOnce({
      data: { success: true, data: mockStats },
    })
    const result = await fetchAdminStats()
    expect(result).toEqual(mockStats)
    expect(client.get).toHaveBeenCalledWith('/api/admin/stats')
  })

  it('API 응답 실패 시 에러를 throw한다', async () => {
    const client = getMockClient()
    if (!client) return
    client.get.mockResolvedValueOnce({
      data: { success: false, error: '통계를 가져오는데 실패했습니다.' },
    })
    await expect(fetchAdminStats()).rejects.toThrow('통계를 가져오는데 실패했습니다.')
  })
})

describe('fetchAdminGames', () => {
  it('성공 응답 시 관리자 게임 배열을 반환한다', async () => {
    const client = getMockClient()
    if (!client) return
    const mockGames = [{ id: 1, name: '좀비런', isAiAnalyzed: true }]
    client.get.mockResolvedValueOnce({
      data: { success: true, data: mockGames },
    })
    const result = await fetchAdminGames()
    expect(result).toEqual(mockGames)
    expect(client.get).toHaveBeenCalledWith('/api/admin/games')
  })

  it('API 응답 실패 시 에러를 throw한다', async () => {
    const client = getMockClient()
    if (!client) return
    client.get.mockResolvedValueOnce({
      data: { success: false, error: '게임 목록을 가져오는데 실패했습니다.' },
    })
    await expect(fetchAdminGames()).rejects.toThrow('게임 목록을 가져오는데 실패했습니다.')
  })
})

describe('createGame', () => {
  const formData = {
    name: '신규게임',
    description: '설명',
    developer: '개발사',
    category: '달리기',
    rating: 4.0,
    downloadCount: 500,
    iconUrl: '',
    playStoreUrl: null,
    appStoreUrl: null,
  }

  it('성공 응답 시 생성된 게임 데이터를 반환한다', async () => {
    const client = getMockClient()
    if (!client) return
    const mockGame = { id: 10, ...formData, isAiAnalyzed: false, healthTags: [], createdAt: '2024-01-01' }
    client.post.mockResolvedValueOnce({
      data: { success: true, data: mockGame },
    })
    const result = await createGame(formData)
    expect(result).toEqual(mockGame)
    expect(client.post).toHaveBeenCalledWith('/api/admin/games', formData)
  })

  it('API 응답 실패 시 에러를 throw한다', async () => {
    const client = getMockClient()
    if (!client) return
    client.post.mockResolvedValueOnce({
      data: { success: false, error: '게임 추가에 실패했습니다.' },
    })
    await expect(createGame(formData)).rejects.toThrow('게임 추가에 실패했습니다.')
  })
})

describe('updateGame', () => {
  const formData = {
    name: '수정게임',
    description: '수정설명',
    developer: '개발사',
    category: '피트니스',
    rating: 4.2,
    downloadCount: 1000,
    iconUrl: '',
    playStoreUrl: null,
    appStoreUrl: null,
  }

  it('성공 응답 시 수정된 게임 데이터를 반환한다', async () => {
    const client = getMockClient()
    if (!client) return
    const mockGame = { id: 5, ...formData, isAiAnalyzed: false, healthTags: [], createdAt: '2024-01-01' }
    client.put.mockResolvedValueOnce({
      data: { success: true, data: mockGame },
    })
    const result = await updateGame(5, formData)
    expect(result).toEqual(mockGame)
    expect(client.put).toHaveBeenCalledWith('/api/admin/games/5', formData)
  })

  it('API 응답 실패 시 에러를 throw한다', async () => {
    const client = getMockClient()
    if (!client) return
    client.put.mockResolvedValueOnce({
      data: { success: false, error: '게임 수정에 실패했습니다.' },
    })
    await expect(updateGame(5, formData)).rejects.toThrow('게임 수정에 실패했습니다.')
  })
})

describe('deleteGame', () => {
  it('성공 응답 시 void를 반환한다', async () => {
    const client = getMockClient()
    if (!client) return
    client.delete.mockResolvedValueOnce({
      data: { success: true, data: null },
    })
    await expect(deleteGame(3)).resolves.toBeUndefined()
    expect(client.delete).toHaveBeenCalledWith('/api/admin/games/3')
  })

  it('API 응답 실패 시 에러를 throw한다', async () => {
    const client = getMockClient()
    if (!client) return
    client.delete.mockResolvedValueOnce({
      data: { success: false, error: '게임 삭제에 실패했습니다.' },
    })
    await expect(deleteGame(3)).rejects.toThrow('게임 삭제에 실패했습니다.')
  })
})

describe('analyzeGame', () => {
  it('성공 응답 시 void를 반환한다', async () => {
    const client = getMockClient()
    if (!client) return
    client.post.mockResolvedValueOnce({
      data: { success: true, data: null },
    })
    await expect(analyzeGame(7)).resolves.toBeUndefined()
    expect(client.post).toHaveBeenCalledWith('/api/admin/analyze/7')
  })

  it('API 응답 실패 시 에러를 throw한다', async () => {
    const client = getMockClient()
    if (!client) return
    client.post.mockResolvedValueOnce({
      data: { success: false, error: 'AI 분석에 실패했습니다.' },
    })
    await expect(analyzeGame(7)).rejects.toThrow('AI 분석에 실패했습니다.')
  })
})

describe('collectGames', () => {
  it('성공 응답 시 void를 반환한다', async () => {
    const client = getMockClient()
    if (!client) return
    client.post.mockResolvedValueOnce({
      data: { success: true, data: null },
    })
    await expect(collectGames(10)).resolves.toBeUndefined()
    expect(client.post).toHaveBeenCalledWith(
      '/api/admin/collect',
      {},
      { params: { maxCount: 10 } }
    )
  })

  it('API 응답 실패 시 에러를 throw한다', async () => {
    const client = getMockClient()
    if (!client) return
    client.post.mockResolvedValueOnce({
      data: { success: false, error: '데이터 수집에 실패했습니다.' },
    })
    await expect(collectGames()).rejects.toThrow('데이터 수집에 실패했습니다.')
  })
})

describe('adminLogin', () => {
  it('성공 응답 시 토큰을 localStorage에 저장한다', async () => {
    const client = getMockClient()
    if (!client) return
    const futureDate = new Date(Date.now() + 3600 * 1000).toISOString()
    client.post.mockResolvedValueOnce({
      data: {
        success: true,
        data: { token: 'test-jwt-token', expiresAt: futureDate },
      },
    })
    await adminLogin('admin', 'password')
    expect(localStorage.getItem('admin_jwt_token')).toBe('test-jwt-token')
    expect(localStorage.getItem('admin_jwt_expires')).toBe(futureDate)
  })

  it('API 응답 실패 시 에러를 throw한다', async () => {
    const client = getMockClient()
    if (!client) return
    client.post.mockResolvedValueOnce({
      data: { success: false, error: '로그인에 실패했습니다.' },
    })
    await expect(adminLogin('admin', 'wrong')).rejects.toThrow('로그인에 실패했습니다.')
  })
})

describe('saveToken / getToken / removeToken', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('saveToken은 token과 expiresAt을 localStorage에 저장한다', () => {
    const futureDate = new Date(Date.now() + 3600 * 1000).toISOString()
    saveToken({ token: 'my-token', expiresAt: futureDate })
    expect(localStorage.getItem('admin_jwt_token')).toBe('my-token')
    expect(localStorage.getItem('admin_jwt_expires')).toBe(futureDate)
  })

  it('getToken은 토큰이 없으면 null을 반환한다', () => {
    expect(getToken()).toBeNull()
  })

  it('getToken은 유효한 토큰이 있으면 토큰 문자열을 반환한다', () => {
    const futureDate = new Date(Date.now() + 3600 * 1000).toISOString()
    saveToken({ token: 'valid-token', expiresAt: futureDate })
    expect(getToken()).toBe('valid-token')
  })

  it('getToken은 만료된 토큰이면 null을 반환한다', () => {
    // 이미 지난 시각 (만료 + 1분 이내 처리)
    const pastDate = new Date(Date.now() - 1000).toISOString()
    saveToken({ token: 'expired-token', expiresAt: pastDate })
    expect(getToken()).toBeNull()
  })

  it('removeToken은 localStorage에서 토큰 관련 항목을 삭제한다', () => {
    const futureDate = new Date(Date.now() + 3600 * 1000).toISOString()
    saveToken({ token: 'token-to-remove', expiresAt: futureDate })
    removeToken()
    expect(localStorage.getItem('admin_jwt_token')).toBeNull()
    expect(localStorage.getItem('admin_jwt_expires')).toBeNull()
  })
})
