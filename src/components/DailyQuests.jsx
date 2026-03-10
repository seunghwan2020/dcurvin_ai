import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../context/GameContext'

const questIcons = {
  q1: '📊',
  q2: '💬',
  q3: '📦',
  q4: '🚢',
  q5: '📋',
}

export default function DailyQuests() {
  const { quests } = useGame()
  const done = quests.filter(q => q.done).length
  const total = quests.length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
      {/* Header + Progress */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[15px] font-semibold flex items-center gap-2" style={{ color: '#2A3B32' }}>
          📋 오늘의 퀘스트
        </h3>
        <span className="text-[12px] font-bold tabular-nums px-2.5 py-0.5 rounded-full"
          style={{ background: pct === 100 ? 'rgba(142,186,164,0.15)' : 'rgba(198,213,204,0.2)', color: pct === 100 ? '#4A6355' : '#7A9B88' }}>
          {done}/{total} 완료
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full overflow-hidden mb-4" style={{ background: 'rgba(198,213,204,0.25)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: pct === 100 ? 'linear-gradient(90deg, #8EBAA4, #4A6355)' : 'linear-gradient(90deg, #C6D5CC, #8EBAA4)' }}
        />
      </div>

      {/* Quest Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {quests.map((q, i) => {
          const icon = questIcons[q.id] || '⭐'
          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.06, type: 'spring', damping: 20 }}
              className="relative rounded-xl border p-3.5 transition-all duration-300 overflow-hidden"
              style={{
                background: q.done
                  ? 'rgba(142,186,164,0.08)'
                  : 'rgba(239,244,241,0.5)',
                borderColor: q.done
                  ? 'rgba(142,186,164,0.3)'
                  : 'rgba(198,213,204,0.4)',
                backdropFilter: 'blur(8px)',
                boxShadow: q.done
                  ? '0 1px 8px rgba(74,99,85,0.06)'
                  : '0 1px 6px rgba(42,59,50,0.03)',
              }}
            >
              {/* Completion check */}
              <AnimatePresence>
                {q.done && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute top-2 right-2"
                  >
                    <div className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: '#8EBAA4' }}>
                      <span className="text-white text-[10px] font-bold">✓</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-start gap-2.5">
                <span className="text-[18px] mt-0.5 flex-shrink-0">{icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-[12px] leading-snug ${q.done ? 'line-through' : 'font-medium'}`}
                    style={{ color: q.done ? '#C6D5CC' : '#2A3B32' }}>
                    {q.text}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <AnimatePresence>
                      {q.done ? (
                        <motion.span
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ background: 'rgba(142,186,164,0.15)', color: '#4A6355' }}>
                          +{q.exp} EXP
                        </motion.span>
                      ) : (
                        <span className="text-[10px] font-semibold tabular-nums px-1.5 py-0.5 rounded-full"
                          style={{ background: 'rgba(198,213,204,0.2)', color: '#7A9B88' }}>
                          +{q.exp} EXP
                        </span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
