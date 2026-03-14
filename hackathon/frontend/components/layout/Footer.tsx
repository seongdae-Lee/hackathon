export default function Footer() {
  return (
    <footer className="border-t border-gray-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎮</span>
            <span className="text-sm font-medium text-gray-700">헬스게임 큐레이터</span>
          </div>
          <p className="text-xs text-gray-400">
            AI가 분석한 건강 효과 게임을 큐레이션합니다
          </p>
        </div>
      </div>
    </footer>
  )
}
