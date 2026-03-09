import { motion } from 'framer-motion'
import CountUp from './CountUp'

export default function KpiCard({ label, value, change, prefix = '', suffix = '', icon, delay = 0, decimals = 0 }) {
  const isUp = change > 0
  const isDown = change < 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(42,59,50,0.06)' }}
      className="rounded-2xl border p-4 transition-all duration-300 sage-border-glow"
      style={{
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(16px)',
        borderColor: 'rgba(198,213,204,0.5)',
        boxShadow: '0 1px 8px rgba(42,59,50,0.03)',
      }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[12px] font-medium" style={{ color: '#7A9B88' }}>{label}</span>
        {icon && <span className="text-base">{icon}</span>}
      </div>
      <div className="text-[22px] font-semibold tracking-tight tabular-nums" style={{ color: '#2A3B32' }}>
        <CountUp end={value} prefix={prefix} suffix={suffix} decimals={decimals} />
      </div>
      {change !== undefined && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: delay + 0.4 }}
          className="flex items-center gap-1 mt-1 text-[11px] font-semibold"
          style={{ color: isUp ? '#4A6355' : isDown ? '#C45C5C' : '#7A9B88' }}>
          {isUp && <span>↑</span>}{isDown && <span>↓</span>}
          {change > 0 ? '+' : ''}{change}%
        </motion.div>
      )}
    </motion.div>
  )
}
