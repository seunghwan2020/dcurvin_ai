import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'

export default function DailyQuests() {
  const { quests } = useGame()
  const done = quests.filter(q => q.done).length
  const total = quests.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white/70 backdrop-blur-2xl rounded-2xl border border-white/60 shadow-[0_2px_20px_rgba(0,0,0,0.04)] p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13px] font-semibold text-gray-800">📋 일일 퀘스트</h3>
        <span className="text-[11px] font-bold" style={{ color: '#C4A661' }}>{done}/{total}</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(done / total) * 100}%` }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #C4A661, #d4b96e)' }}
        />
      </div>
      <div className="space-y-1.5">
        {quests.map((q, i) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.06 }}
            className="flex items-center gap-2.5 py-1"
          >
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
              q.done ? 'bg-emerald-400 border-emerald-400' : 'border-gray-200'
            }`}>
              {q.done && <span className="text-white text-[8px]">✓</span>}
            </div>
            <span className={`text-[12px] flex-1 ${q.done ? 'line-through text-gray-300' : 'text-gray-600'}`}>{q.text}</span>
            <span className={`text-[10px] font-bold ${q.done ? 'text-gray-300' : 'text-amber-400'}`}>+{q.exp}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
