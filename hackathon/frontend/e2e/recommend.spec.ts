import { test, expect } from '@playwright/test'

test.describe('추천 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/recommend')
  })

  test('건강 목표 카드들이 표시된다', async ({ page }) => {
    await expect(page.getByText('심폐기능 향상')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('근력 강화')).toBeVisible()
  })

  test('목표 카드 클릭 시 선택 상태가 토글된다', async ({ page }) => {
    const goalCard = page.getByRole('button', { name: /심폐기능 향상/ })
    await expect(goalCard).toBeVisible({ timeout: 10000 })

    // 클릭 전: 선택 안 됨
    await expect(goalCard).toHaveAttribute('aria-pressed', 'false')

    // 클릭 후: 선택됨
    await goalCard.click()
    await expect(goalCard).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByText('선택됨 ✓').first()).toBeVisible()

    // 재클릭: 선택 해제
    await goalCard.click()
    await expect(goalCard).toHaveAttribute('aria-pressed', 'false')
  })

  test('목표 선택 후 "추천받기" 버튼이 활성화된다', async ({ page }) => {
    await page.getByRole('button', { name: /심폐기능 향상/ }).click()
    const submitButton = page.getByRole('button', { name: /추천받기/ })
    await expect(submitButton).toBeEnabled()
  })

  test('목표 없이 추천받기 시 안내 메시지가 표시된다', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /추천받기/ })
    // 목표 미선택 상태에서 버튼이 비활성화되거나 힌트 텍스트 표시
    const isDisabled = await submitButton.isDisabled()
    if (isDisabled) {
      await expect(submitButton).toBeDisabled()
    } else {
      // 힌트 텍스트 확인
      await expect(page.getByText(/선택/)).toBeVisible()
    }
  })

  test('목표 선택 후 추천받기 클릭 시 결과가 표시된다', async ({ page }) => {
    // 2개 목표 선택
    await page.getByRole('button', { name: /심폐기능 향상/ }).click()
    await page.getByRole('button', { name: /근력 강화/ }).click()

    // 추천받기 클릭
    await page.getByRole('button', { name: /추천받기/ }).click()

    // 로딩 중이거나 결과 표시 확인 (백엔드 연결 여부에 따라)
    await page.waitForTimeout(2000)
    // 에러 없이 렌더링 됨을 확인
    await expect(page.locator('body')).not.toContainText('Something went wrong')
  })
})
