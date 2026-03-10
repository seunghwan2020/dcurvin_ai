import { motion } from 'framer-motion'

function SkeletonPulse({ className = '', style = {} }) {
  return (
    <motion.div
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
      className={`rounded-lg bg-[#C6D5CC]/30 ${className}`}
      style={style}
    />
  )
}

export default function SkeletonCard({ title, icon, height = 200, lines = 3, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl border p-5"
      style={{ borderColor: 'rgba(198,213,204,0.5)', boxShadow: '0 1px 12px rgba(42,59,50,0.04)' }}
    >
      {title && (
        <div className="flex items-center gap-2 mb-4">
          {icon && <span className="text-[14px]">{icon}</span>}
          <h3 className="text-[14px] font-semibold" style={{ color: '#2A3B32' }}>{title}</h3>
          <SkeletonPulse className="ml-auto w-16 h-4" />
        </div>
      )}
      <SkeletonPulse className="w-full mb-3" style={{ height }} />
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonPulse key={i} className="h-3" style={{ width: `${85 - i * 15}%` }} />
        ))}
      </div>
    </motion.div>
  )
}

export function SkeletonKpi({ delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl border p-4"
      style={{ borderColor: 'rgba(198,213,204,0.5)' }}
    >
      <SkeletonPulse className="w-12 h-3 mb-2" />
      <SkeletonPulse className="w-20 h-7 mb-1" />
      <SkeletonPulse className="w-14 h-3" />
    </motion.div>
  )
}

export function SkeletonTable({ rows = 5, cols = 4, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl border p-5"
      style={{ borderColor: 'rgba(198,213,204,0.5)' }}
    >
      <div className="space-y-3">
        <div className="flex gap-3">
          {Array.from({ length: cols }).map((_, i) => (
            <SkeletonPulse key={i} className="h-4 flex-1" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-3">
            {Array.from({ length: cols }).map((_, j) => (
              <SkeletonPulse key={j} className="h-3 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export function DataStatusBadge({ loading, error, fetchedAt, onRefresh }) {
  if (loading) {
    return (
      <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium"
        style={{ background: 'rgba(142,186,164,0.1)', color: '#7A9B88' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#7A9B88] animate-pulse" />
        데이터 로딩중...
      </motion.div>
    )
  }
  if (error) {
    return (
      <button onClick={onRefresh}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium hover:opacity-80 transition-opacity"
        style={{ background: 'rgba(196,92,92,0.08)', color: '#C45C5C' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#C45C5C]" />
        오프라인 모드 · 새로고침
      </button>
    )
  }
  if (fetchedAt) {
    const time = new Date(fetchedAt)
    const timeStr = `${time.getHours().toString().padStart(2,'0')}:${time.getMinutes().toString().padStart(2,'0')}`
    return (
      <button onClick={onRefresh}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium hover:opacity-80 transition-opacity"
        style={{ background: 'rgba(74,99,85,0.06)', color: '#7A9B88' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#4A6355]" />
        {timeStr} 업데이트 · ↻
      </button>
    )
  }
  return null
}
