import { motion } from 'framer-motion'
import CountUp from './CountUp'

export default function KpiCard({ label, value, change, prefix = '', suffix = '', icon, delay = 0 }) {
  const isPositive = change > 0
  const isNegative = change < 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500 font-medium">{label}</span>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <div className="text-xl font-bold text-gray-900">
        <CountUp end={value} prefix={prefix} suffix={suffix} />
      </div>
      {change !== undefined && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.5 }}
          className={`flex items-center gap-1 mt-1 text-xs font-medium ${
            isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-gray-400'
          }`}
        >
          {isPositive && (
            <motion.span animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              ↑
            </motion.span>
          )}
          {isNegative && (
            <motion.span animate={{ x: [-1, 1, -1] }} transition={{ repeat: Infinity, duration: 0.3 }}>
              ↓
            </motion.span>
          )}
          {change > 0 ? '+' : ''}{change}%
        </motion.div>
      )}
    </motion.div>
  )
}
