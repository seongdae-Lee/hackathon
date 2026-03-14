// 게임 카드 로딩 스켈레톤
export default function GameCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex-shrink-0" />
        <div className="flex-1">
          <div className="h-3.5 bg-gray-100 rounded w-3/4 mb-1.5" />
          <div className="h-3 bg-gray-100 rounded w-1/2 mb-1.5" />
          <div className="h-3 bg-gray-100 rounded w-1/3" />
        </div>
      </div>
      <div className="h-5 bg-gray-100 rounded-md w-16 mb-2.5" />
      <div className="space-y-1.5 mb-3">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-4/5" />
      </div>
      <div className="flex gap-1">
        <div className="h-5 bg-gray-100 rounded-md w-14" />
        <div className="h-5 bg-gray-100 rounded-md w-14" />
      </div>
    </div>
  )
}
