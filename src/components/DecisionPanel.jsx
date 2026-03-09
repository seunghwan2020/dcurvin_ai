import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../context/GameContext'

export default function DecisionPanel({ decision, characterColor, onDecisionMade }) {
  const { makeDecision, decisions } = useGame()
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)

  const already = decisions.find(d => d.decisionId === decision.id)
  if (already) {
    const choice = decision.choices.find(c => c.id === already.choiceId)
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 p-5">
        <p className="text-[11px] text-gray-400 mb-1">결정 완료</p>
        <p className="text-[13px] text-gray-600">✅ {choice?.text} <span className="text-amber-500 font-bold">+{choice?.exp} EXP</span></p>
      </motion.div>
    )
  }

  const handleSelect = (choice) => {
    setSelected(choice)
    setShowResult(true)
    makeDecision(decision.id, choice)
    setTimeout(() => onDecisionMade?.(choice), 2500)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-2xl rounded-2xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5">
      <p className="text-[13px] font-semibold text-gray-800 mb-1">{decision.question}</p>
      <p className="text-[11px] text-gray-400 mb-4">{decision.context}</p>
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div key="choices" className="space-y-2">
            {decision.choices.map((choice, i) => (
              <motion.button key={choice.id}
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.01, boxShadow: `0 0 24px ${characterColor}20` }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(choice)}
                className="w-full text-left p-4 rounded-xl bg-white/90 border border-gray-100 hover:border-[#C4A661]/40 transition-all group">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-gray-700 group-hover:text-gray-900 font-medium">{choice.text}</span>
                  <span className="text-[11px] text-amber-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">+{choice.exp} EXP</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">{choice.effect}</p>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
            <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.4, 1] }} transition={{ type: 'spring', damping: 8 }} className="text-4xl mb-3">⚡</motion.div>
            <p className="text-[13px] font-semibold text-gray-800">{selected.text}</p>
            <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
              className="text-xl font-black mt-2" style={{ color: '#C4A661' }}>+{selected.exp} EXP!</motion.p>
            <p className="text-[11px] text-gray-400 mt-1">{selected.effect}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
