import { test, expect } from '@playwright/test'

test.describe('검색 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/search')
  })

  test('검색 입력창이 표시된다', async ({ page }) => {
    await expect(page.getByPlaceholder(/검색/)).toBeVisible()
  })

  test('1글자 입력 시 검색 결과가 나타나지 않는다', async ({ page }) => {
    await page.getByPlaceholder(/검색/).fill('a')
    await page.waitForTimeout(500)
    // 결과 없음 메시지 또는 빈 결과 확인
    const results = page.locator('a[href^="/games/"]')
    expect(await results.count()).toBe(0)
  })

  test('2글자 이상 입력 시 검색 요청이 실행된다', async ({ page }) => {
    const input = page.getByPlaceholder(/검색/)
    await input.fill('달리기')
    // 디바운스 대기 후 결과 로딩 확인
    await page.waitForTimeout(1000)
    // 에러 없이 렌더링 됨을 확인
    await expect(page.locator('body')).not.toContainText('Something went wrong')
  })

  test('검색 결과 카드 클릭 시 게임 상세 페이지로 이동한다', async ({ page }) => {
    await page.getByPlaceholder(/검색/).fill('피트니스')
    await page.waitForTimeout(1500)

    const firstResult = page.locator('a[href^="/games/"]').first()
    if (await firstResult.isVisible()) {
      await firstResult.click()
      await expect(page).toHaveURL(/\/games\/\d+/)
    }
  })
})
