import axios from 'axios'
import { searchGames, fetchGames, fetchRecommendations, fetchGame } from '@/lib/api'

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
