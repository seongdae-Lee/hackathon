interface ErrorFallbackProps {
  message?: string
  hint?: string
  onRetry?: () => void
}

/// 에러 발생 시 보여주는 Fallback UI 컴포넌트
export default function ErrorFallback({
  message = '데이터를 불러오는데 실패했습니다.',
  hint,
  onRetry,
}: ErrorFallbackProps) {
  return (
    <div className="text-center py-20">
      <p className="text-5xl mb-4">😢</p>
      <p className="text-gray-400 text-sm">{message}</p>
      {hint && <p className="text-xs text-gray-300 mt-1">{hint}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
        >
          다시 시도
        </button>
      )}
    </div>
  )
}
