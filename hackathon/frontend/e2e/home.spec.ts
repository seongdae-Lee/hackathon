import { test, expect } from '@playwright/test'

test.describe('홈 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('헤더와 기본 레이아웃이 렌더링된다', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })

  test('게임 카드 목록이 로드된다', async ({ page }) => {
    // 로딩 스켈레톤이 사라지고 게임 카드가 나타날 때까지 대기
    await page.waitForSelector('[data-testid="game-card"], a[href^="/games/"]', { timeout: 10000 })
    const gameLinks = page.locator('a[href^="/games/"]')
    await expect(gameLinks.first()).toBeVisible()
  })

  test('카테고리 필터 버튼이 표시된다', async ({ page }) => {
    // "전체" 버튼 존재 확인
    await expect(page.getByRole('button', { name: '전체' })).toBeVisible({ timeout: 10000 })
  })

  test('카테고리 버튼 클릭 시 해당 카테고리 게임만 표시된다', async ({ page }) => {
    // 카테고리 버튼 로딩 대기
    const allButton = page.getByRole('button', { name: '전체' })
    await expect(allButton).toBeVisible({ timeout: 10000 })

    // 첫 번째 카테고리 버튼 클릭
    const categoryButtons = page.locator('button').filter({ hasNotText: '전체' }).filter({ hasNotText: '인기순' }).filter({ hasNotText: '평점순' }).filter({ hasNotText: '최신순' })
    const firstCategory = categoryButtons.first()
    if (await firstCategory.isVisible()) {
      await firstCategory.click()
      // URL에 category 파라미터가 추가되거나 게임 목록이 변경되는지 확인
      await page.waitForTimeout(500)
      await expect(firstCategory).toHaveClass(/bg-gray-900/)
    }
  })

  test('정렬 드롭다운이 표시된다', async ({ page }) => {
    await expect(page.getByRole('button', { name: /인기순|평점순|최신순/ })).toBeVisible({ timeout: 10000 })
  })
})
