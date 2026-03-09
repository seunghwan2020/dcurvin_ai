const colorMap = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  green: 'bg-green-50 text-green-700 border-green-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
}

export default function KpiCard({ title, value, sub, color = 'blue', icon }) {
  return (
    <div className={`rounded-xl border p-4 ${colorMap[color]} shadow-sm`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium opacity-70">{title}</span>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {sub && <p className="text-xs mt-1 opacity-60">{sub}</p>}
    </div>
  )
}
