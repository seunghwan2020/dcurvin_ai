import { motion } from 'framer-motion'
import CountUp from './CountUp'

export default function KpiCard({ label, value, change, prefix = '', suffix = '', icon, delay = 0, decimals = 0 }) {
  const isUp = change > 0
  const isDown = change < 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white/70 backdrop-blur-2xl rounded-2xl border border-white/80 shadow-[0_2px_16px_rgba(0,0,0,0.04)] p-4"
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] text-gray-400 font-medium tracking-wide">{label}</span>
        {icon && <span className="text-base">{icon}</span>}
      </div>
      <div className="text-[22px] font-bold text-gray-900 tracking-tight">
        <CountUp end={value} prefix={prefix} suffix={suffix} decimals={decimals} />
      </div>
      {change !== undefined && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.4 }}
          className={`flex items-center gap-1 mt-1 text-[11px] font-semibold ${isUp ? 'text-emerald-500' : isDown ? 'text-red-400' : 'text-gray-300'}`}
        >
          {isUp && <motion.span animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>↑</motion.span>}
          {isDown && <motion.span animate={{ x: [-1, 1, -1] }} transition={{ repeat: Infinity, duration: 0.3 }}>↓</motion.span>}
          {change > 0 ? '+' : ''}{change}%
        </motion.div>
      )}
    </motion.div>
  )
}
