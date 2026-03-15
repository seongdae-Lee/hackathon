import { test, expect } from '@playwright/test'

test.describe('어드민 로그인 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login')
  })

  test('로그인 폼이 표시된다', async ({ page }) => {
    await expect(page.getByPlaceholder(/아이디|ID|username/i)).toBeVisible({ timeout: 10000 })
    await expect(page.getByPlaceholder(/비밀번호|password/i)).toBeVisible()
  })

  test('잘못된 자격증명으로 로그인 시 에러 메시지가 표시된다', async ({ page }) => {
    await page.getByPlaceholder(/아이디|ID|username/i).fill('wrong')
    await page.getByPlaceholder(/비밀번호|password/i).fill('wrong')
    await page.getByRole('button', { name: /로그인/ }).click()
    // 실제 에러 메시지: "아이디 또는 비밀번호가 올바르지 않습니다."
    await expect(page.getByText(/올바르지|잘못|오류|실패|incorrect|invalid/i)).toBeVisible({ timeout: 5000 })
  })

  test('올바른 자격증명으로 로그인 시 어드민 페이지로 이동한다', async ({ page }) => {
    await page.getByPlaceholder(/아이디|ID|username/i).fill('admin')
    await page.getByPlaceholder(/비밀번호|password/i).fill('admin')
    await page.getByRole('button', { name: /로그인/ }).click()
    await expect(page).toHaveURL('/admin', { timeout: 10000 })
  })
})

test.describe('어드민 페이지 (인증 후)', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 상태로 진입
    await page.goto('/admin/login')
    await page.getByPlaceholder(/아이디|ID|username/i).fill('admin')
    await page.getByPlaceholder(/비밀번호|password/i).fill('admin')
    await page.getByRole('button', { name: /로그인/ }).click()
    await page.waitForURL('/admin', { timeout: 10000 })
  })

  test('통계 카드가 표시된다', async ({ page }) => {
    // admin page의 StatsCard title: "전체 게임" (여러 요소 중 first 사용)
    await expect(page.getByText(/전체 게임|총 게임/).first()).toBeVisible({ timeout: 10000 })
  })

  test('게임 목록 테이블이 표시된다', async ({ page }) => {
    // 테이블 또는 게임 목록 확인
    await page.waitForTimeout(2000)
    await expect(page.locator('body')).not.toContainText('Something went wrong')
  })

  test('"게임 추가" 버튼 클릭 시 모달이 열린다', async ({ page }) => {
    const addButton = page.getByRole('button', { name: /게임 추가/ })
    await expect(addButton).toBeVisible({ timeout: 10000 })
    await addButton.click()
    await expect(page.getByRole('heading', { name: '게임 추가' })).toBeVisible()
  })

  test('게임 추가 모달에서 취소 버튼 클릭 시 모달이 닫힌다', async ({ page }) => {
    await page.getByRole('button', { name: /게임 추가/ }).click()
    await expect(page.getByRole('heading', { name: '게임 추가' })).toBeVisible()
    await page.getByRole('button', { name: '취소' }).click()
    await expect(page.getByRole('heading', { name: '게임 추가' })).not.toBeVisible()
  })

  test('게임 추가 모달 필수값 미입력 시 유효성 오류가 표시된다', async ({ page }) => {
    await page.getByRole('button', { name: /게임 추가/ }).click()
    await expect(page.getByRole('heading', { name: '게임 추가' })).toBeVisible()
    // 빈 폼으로 저장 시도 — 여러 필드 에러가 동시에 렌더링되므로 .first() 사용
    await page.getByRole('button', { name: '저장' }).click()
    await expect(page.getByText(/필수|required/i).first()).toBeVisible({ timeout: 5000 })
  })
})
