import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'

export default function DailyQuests() {
  const { quests } = useGame()
  const done = quests.filter(q => q.done).length
  const total = quests.length

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl border p-5"
      style={{ borderColor: 'rgba(198,213,204,0.5)', boxShadow: '0 1px 12px rgba(42,59,50,0.04)' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[14px] font-semibold" style={{ color: '#2A3B32' }}>📋 일일 퀘스트</h3>
        <span className="text-[12px] font-semibold tabular-nums" style={{ color: '#8EBAA4' }}>{done}/{total}</span>
      </div>
      <div className="w-full h-1.5 rounded-full overflow-hidden mb-3" style={{ background: '#C6D5CC40' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${(done / total) * 100}%` }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #8EBAA4, #4A6355)' }} />
      </div>
      <div className="space-y-1.5">
        {quests.map((q, i) => (
          <motion.div key={q.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.06 }} className="flex items-center gap-2.5 py-1">
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${q.done ? 'border-[#8EBAA4]' : 'border-[#C6D5CC]'}`}
              style={q.done ? { background: '#8EBAA4' } : {}}>
              {q.done && <span className="text-white text-[8px]">✓</span>}
            </div>
            <span className={`text-[13px] flex-1 ${q.done ? 'line-through' : ''}`}
              style={{ color: q.done ? '#C6D5CC' : '#4A6355' }}>{q.text}</span>
            <span className="text-[11px] font-semibold tabular-nums"
              style={{ color: q.done ? '#C6D5CC' : '#8EBAA4' }}>+{q.exp}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
