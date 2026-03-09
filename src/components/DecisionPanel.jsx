import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'

export default function DecisionPanel({ decision, characterColor, onDecisionMade }) {
  const navigate = useNavigate()
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
        <p className="text-[13px] text-gray-600 mb-3">✅ {choice?.text} <span className="text-amber-500 font-bold">+{choice?.exp} EXP</span></p>
        {choice?.actions && choice.actions.length > 0 && (
          <div className="mt-2 pt-3 border-t border-gray-100/60">
            <p className="text-[10px] font-semibold text-[#C4A661] mb-2">📋 생성된 할 일 ({choice.actions.length}건 → 비서팀 하은 관리)</p>
            <div className="space-y-1">
              {choice.actions.map((a, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] text-gray-500">
                  <span className="text-emerald-400">✓</span>
                  <span>{a.text}</span>
                  <span className={`ml-auto px-1.5 py-0.5 rounded text-[9px] font-medium ${a.priority === 'high' ? 'bg-red-50 text-red-400' : a.priority === 'medium' ? 'bg-amber-50 text-amber-400' : 'bg-gray-50 text-gray-300'}`}>{a.due}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {choice?.reminder && (
          <div className="mt-2 pt-2 border-t border-gray-100/60">
            <p className="text-[10px] text-amber-500">⏰ 리마인더: {choice.reminder.text} ({choice.reminder.due})</p>
          </div>
        )}
      </motion.div>
    )
  }

  const handleSelect = (choice) => {
    setSelected(choice)
    setShowResult(true)
    makeDecision(decision.id, choice)
    if (choice.navigateTo) {
      setTimeout(() => navigate(`/${choice.navigateTo}`), 3000)
    }
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
                {choice.actions && (
                  <p className="text-[9px] text-[#C4A661] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">→ {choice.actions.length}건의 할 일이 자동 생성됩니다</p>
                )}
                {choice.reminder && (
                  <p className="text-[9px] text-amber-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">→ 리마인더가 설정됩니다</p>
                )}
                {choice.navigateTo && (
                  <p className="text-[9px] text-indigo-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">→ 관련 데이터 상세 뷰로 이동</p>
                )}
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-4">
            <div className="text-center mb-4">
              <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.4, 1] }} transition={{ type: 'spring', damping: 8 }} className="text-4xl mb-3">⚡</motion.div>
              <p className="text-[13px] font-semibold text-gray-800">{selected.text}</p>
              <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
                className="text-xl font-black mt-2" style={{ color: '#C4A661' }}>+{selected.exp} EXP!</motion.p>
              <p className="text-[11px] text-gray-400 mt-1">{selected.effect}</p>
            </div>
            {selected.actions && selected.actions.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="mt-3 p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/40">
                <p className="text-[11px] font-semibold text-emerald-700 mb-2">📋 할 일 목록에 추가됨</p>
                {selected.actions.map((a, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.08 }}
                    className="flex items-center gap-2 py-1 text-[11px] text-emerald-800">
                    <span className="w-4 h-4 rounded-full bg-emerald-200 flex items-center justify-center text-[8px] text-emerald-600 flex-shrink-0">✓</span>
                    <span>{a.text}</span>
                  </motion.div>
                ))}
                <p className="text-[9px] text-emerald-500 mt-2">→ 비서팀 하은이 관리합니다</p>
              </motion.div>
            )}
            {selected.reminder && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                className="mt-3 p-3 bg-amber-50/60 rounded-xl border border-amber-200/40">
                <p className="text-[11px] font-semibold text-amber-700">⏰ 리마인더 설정됨</p>
                <p className="text-[11px] text-amber-600 mt-1">{selected.reminder.text} — {selected.reminder.due}</p>
              </motion.div>
            )}
            {selected.navigateTo && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                className="text-[10px] text-indigo-500 text-center mt-3">🔍 관련 데이터 페이지로 이동합니다...</motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
