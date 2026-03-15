interface StatsCardProps {
  title: string
  value: number
  description: string
  colorClass: string
}

export default function StatsCard({ title, value, description, colorClass }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <p className="text-xs text-gray-400 mb-1">{title}</p>
      <p className={`text-3xl font-bold mb-1 ${colorClass}`}>{value.toLocaleString()}</p>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  )
}
