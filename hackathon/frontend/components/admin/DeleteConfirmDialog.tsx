'use client'

interface DeleteConfirmDialogProps {
  gameName: string
  isOpen: boolean
  isLoading: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteConfirmDialog({
  gameName, isOpen, isLoading, onClose, onConfirm
}: DeleteConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-2">게임 삭제</h2>
        <p className="text-sm text-gray-500 mb-6">
          <span className="font-medium text-gray-900">{gameName}</span>을(를) 삭제하시겠습니까?
          <br />
          <span className="text-xs text-red-400">삭제 후 복구할 수 없습니다.</span>
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '삭제 중...' : '삭제'}
          </button>
        </div>
      </div>
    </div>
  )
}
