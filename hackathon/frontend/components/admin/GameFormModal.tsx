'use client'

import { useState, useEffect } from 'react'
import { AdminGame, GameFormData } from '@/types'

const ALLOWED_CATEGORIES = [
  '달리기', '명상/스트레스 해소', '팔 운동', '반응훈련', '밸런스', '피트니스',
  '근력강화', '댄스', '스트레칭', '호흡', '자전거', '수영', '격투기', '기타',
]

interface GameFormModalProps {
  mode: 'create' | 'edit'
  initialData?: AdminGame
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: GameFormData) => void
  isLoading: boolean
  errorMessage?: string | null
}

const defaultForm: GameFormData = {
  name: '',
  description: '',
  developer: '',
  category: '달리기',
  rating: 0,
  downloadCount: 0,
  iconUrl: '',
  playStoreUrl: null,
  appStoreUrl: null,
}

export default function GameFormModal({
  mode, initialData, isOpen, onClose, onSubmit, isLoading, errorMessage
}: GameFormModalProps) {
  const [form, setForm] = useState<GameFormData>(defaultForm)
  const [errors, setErrors] = useState<Partial<Record<keyof GameFormData, string>>>({})

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setForm({
        name: initialData.name,
        description: initialData.description,
        developer: initialData.developer,
        category: initialData.category,
        rating: initialData.rating,
        downloadCount: initialData.downloadCount,
        iconUrl: initialData.iconUrl,
        playStoreUrl: initialData.playStoreUrl,
        appStoreUrl: initialData.appStoreUrl,
      })
    } else if (mode === 'create') {
      setForm(defaultForm)
    }
    setErrors({})
  // initialData?.id 사용으로 객체 참조 비교 대신 ID 비교 → 불필요한 리렌더링 방지
  }, [mode, initialData?.id, isOpen])

  const isValidUrl = (url: string): boolean => {
    try { new URL(url); return true } catch { return false }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof GameFormData, string>> = {}
    if (!form.name.trim()) newErrors.name = '게임명은 필수입니다.'
    if (!form.description.trim()) newErrors.description = '설명은 필수입니다.'
    if (!form.developer.trim()) newErrors.developer = '개발사는 필수입니다.'
    if (!form.iconUrl.trim()) {
      newErrors.iconUrl = '아이콘 URL은 필수입니다.'
    } else if (!isValidUrl(form.iconUrl)) {
      newErrors.iconUrl = '유효한 URL 형식이어야 합니다. (예: https://...)'
    }
    if (form.rating < 0 || form.rating > 5) newErrors.rating = '평점은 0.0~5.0 사이여야 합니다.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(form)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-900">
              {mode === 'create' ? '게임 추가' : '게임 수정'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-lg"
              aria-label="닫기"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* 게임명 */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">게임명 *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="게임명을 입력하세요"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* 설명 */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">설명 *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none"
                placeholder="게임 설명을 입력하세요"
              />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>

            {/* 개발사 */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">개발사 *</label>
              <input
                type="text"
                value={form.developer}
                onChange={(e) => setForm({ ...form, developer: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="개발사명을 입력하세요"
              />
              {errors.developer && <p className="text-xs text-red-500 mt-1">{errors.developer}</p>}
            </div>

            {/* 카테고리 + 평점 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">카테고리 *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  {ALLOWED_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">평점 (0~5) *</label>
                <input
                  type="number"
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) || 0 })}
                  min={0}
                  max={5}
                  step={0.1}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
                {errors.rating && <p className="text-xs text-red-500 mt-1">{errors.rating}</p>}
              </div>
            </div>

            {/* 다운로드 수 */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">다운로드 수</label>
              <input
                type="number"
                value={form.downloadCount}
                onChange={(e) => setForm({ ...form, downloadCount: parseInt(e.target.value) || 0 })}
                min={0}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {/* 아이콘 URL */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">아이콘 URL *</label>
              <input
                type="text"
                value={form.iconUrl}
                onChange={(e) => setForm({ ...form, iconUrl: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="https://example.com/icon.png"
              />
              {errors.iconUrl && <p className="text-xs text-red-500 mt-1">{errors.iconUrl}</p>}
            </div>

            {/* Play Store URL */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Play Store URL (선택)</label>
              <input
                type="url"
                value={form.playStoreUrl ?? ''}
                onChange={(e) => setForm({ ...form, playStoreUrl: e.target.value || null })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="https://play.google.com/..."
              />
            </div>

            {/* App Store URL */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">App Store URL (선택)</label>
              <input
                type="url"
                value={form.appStoreUrl ?? ''}
                onChange={(e) => setForm({ ...form, appStoreUrl: e.target.value || null })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="https://apps.apple.com/..."
              />
            </div>

            {/* 서버 에러 메시지 */}
            {errorMessage && (
              <p className="text-xs text-red-500 px-1">{errorMessage}</p>
            )}

            {/* 버튼 */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? '저장 중...' : '저장'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
