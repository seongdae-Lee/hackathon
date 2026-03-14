export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎮</span>
            <span className="font-semibold text-gray-700">헬스게임 큐레이터</span>
          </div>
          <p className="text-sm text-gray-500">
            AI가 분석한 건강 효과 게임을 큐레이션합니다
          </p>
        </div>
      </div>
    </footer>
  )
}
