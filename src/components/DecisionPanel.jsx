import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../context/GameContext'

export default function DecisionPanel({ decision, character, onDecisionMade }) {
  const { makeDecision, decisions } = useGame()
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)

  const alreadyDecided = decisions.find(d => d.decisionId === decision.id)
  if (alreadyDecided) {
    const choice = decision.choices.find(c => c.id === alreadyDecided.choiceId)
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm p-5">
        <div className="text-xs font-medium text-gray-400 mb-2">이미 결정됨</div>
        <div className="text-sm text-gray-600">
          ✅ {choice?.text} <span className="text-amber-500 font-bold">+{choice?.exp} EXP</span>
        </div>
      </div>
    )
  }

  const handleSelect = (choice) => {
    setSelected(choice)
    setShowResult(true)
    makeDecision(decision.id, choice)
    setTimeout(() => onDecisionMade?.(choice), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-5"
    >
      {/* Question */}
      <div className="flex items-start gap-2 mb-3">
        <span className="text-lg">{character.emoji}</span>
        <div>
          <p className="text-sm font-semibold text-gray-800">{decision.question}</p>
          <p className="text-xs text-gray-500 mt-1">{decision.context}</p>
        </div>
      </div>

      {/* Choices */}
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div className="space-y-2 mt-4" key="choices">
            {decision.choices.map((choice, i) => (
              <motion.button
                key={choice.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 0 20px rgba(196, 166, 97, 0.3)',
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(choice)}
                className="w-full text-left p-3 rounded-xl bg-white border border-gray-100 hover:border-[#C4A661]/50 transition-all group"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                    {choice.text}
                  </span>
                  <span className="text-xs text-amber-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    +{choice.exp} EXP
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{choice.effect}</p>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 text-center py-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ type: 'spring', damping: 10 }}
              className="text-3xl mb-2"
            >
              ⚡
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-sm font-semibold text-gray-800">{selected.text}</p>
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="text-lg font-bold text-amber-500 mt-2"
              >
                +{selected.exp} EXP!
              </motion.p>
              <p className="text-xs text-gray-500 mt-1">{selected.effect}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
