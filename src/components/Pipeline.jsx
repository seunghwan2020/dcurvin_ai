import { useState } from 'react'
import { motion } from 'framer-motion'

const stages = [
  { id: 'order', label: '발주', icon: '📝', color: '#6366f1' },
  { id: 'production', label: '제작', icon: '🏭', color: '#f59e0b' },
  { id: 'china', label: '중국창고', icon: '🏬', color: '#ef4444' },
  { id: 'import', label: '수입', icon: '🚢', color: '#3b82f6' },
  { id: 'domestic', label: '국내입고', icon: '📦', color: '#22c55e' },
  { id: 'sales', label: '판매', icon: '🛒', color: '#C4A661' },
]

export default function Pipeline({ data, onStageClick }) {
  const [active, setActive] = useState(null)

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        {stages.map((stage, i) => {
          const qty = data?.[stage.id] ?? 0
          return (
            <div key={stage.id} className="flex items-center flex-1">
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setActive(stage.id); onStageClick?.(stage.id) }}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-full ${
                  active === stage.id ? 'bg-gray-50 shadow-sm' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm"
                  style={{ backgroundColor: stage.color + '15', border: `1.5px solid ${stage.color}30` }}>
                  {stage.icon}
                </div>
                <span className="text-[10px] font-medium text-gray-500">{stage.label}</span>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
                  className="text-[12px] font-bold"
                  style={{ color: stage.color }}
                >
                  {qty.toLocaleString()}
                </motion.span>
              </motion.button>
              {i < stages.length - 1 && (
                <div className="flex-shrink-0 mx-0.5 relative">
                  <div className="w-4 h-[2px] bg-gray-200 rounded" />
                  <motion.div
                    initial={{ x: -8 }}
                    animate={{ x: 8 }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2, ease: 'linear' }}
                    className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: stage.color + '60' }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
