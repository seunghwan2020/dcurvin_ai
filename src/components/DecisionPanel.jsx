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
        className="bg-white/70 backdrop-blur-xl rounded-2xl border p-5"
        style={{ borderColor: 'rgba(198,213,204,0.5)' }}>
        <p className="text-[12px] mb-1" style={{ color: '#7A9B88' }}>결정 완료</p>
        <p className="text-[13px] mb-3" style={{ color: '#4A6355' }}>✅ {choice?.text} <span className="font-semibold tabular-nums" style={{ color: '#8EBAA4' }}>+{choice?.exp} EXP</span></p>
        {choice?.actions && choice.actions.length > 0 && (
          <div className="mt-2 pt-3" style={{ borderTop: '1px solid rgba(198,213,204,0.3)' }}>
            <p className="text-[11px] font-semibold mb-2" style={{ color: '#8EBAA4' }}>📋 생성된 할 일 ({choice.actions.length}건)</p>
            <div className="space-y-1">
              {choice.actions.map((a, i) => (
                <div key={i} className="flex items-center gap-2 text-[12px]" style={{ color: '#4A6355' }}>
                  <span style={{ color: '#8EBAA4' }}>✓</span>
                  <span>{a.text}</span>
                  <span className={`ml-auto px-1.5 py-0.5 rounded text-[10px] font-medium ${a.priority === 'high' ? 'text-[#C45C5C]' : 'text-[#7A9B88]'}`}
                    style={{ background: a.priority === 'high' ? 'rgba(196,92,92,0.08)' : 'rgba(142,186,164,0.08)' }}>{a.due}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {choice?.reminder && (
          <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(198,213,204,0.3)' }}>
            <p className="text-[11px]" style={{ color: '#7A9B88' }}>⏰ 리마인더: {choice.reminder.text} ({choice.reminder.due})</p>
          </div>
        )}
      </motion.div>
    )
  }

  const handleSelect = (choice) => {
    setSelected(choice); setShowResult(true)
    makeDecision(decision.id, choice)
    if (choice.navigateTo) setTimeout(() => navigate(`/${choice.navigateTo}`), 3000)
    setTimeout(() => onDecisionMade?.(choice), 2500)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl border p-5"
      style={{ borderColor: 'rgba(198,213,204,0.5)', boxShadow: '0 2px 16px rgba(42,59,50,0.04)' }}>
      <p className="text-[14px] font-semibold mb-1" style={{ color: '#2A3B32' }}>{decision.question}</p>
      <p className="text-[12px] mb-4" style={{ color: '#7A9B88' }}>{decision.context}</p>
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div key="choices" className="space-y-2">
            {decision.choices.map((choice, i) => (
              <motion.button key={choice.id}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(choice)}
                className="w-full text-left p-4 rounded-xl border transition-all group"
                style={{ background: 'rgba(255,255,255,0.7)', borderColor: 'rgba(198,213,204,0.4)' }}>
                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-medium" style={{ color: '#2A3B32' }}>{choice.text}</span>
                  <span className="text-[11px] font-semibold tabular-nums opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#8EBAA4' }}>+{choice.exp} EXP</span>
                </div>
                <p className="text-[12px] mt-0.5" style={{ color: '#7A9B88' }}>{choice.effect}</p>
                {choice.actions && <p className="text-[10px] mt-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#8EBAA4' }}>→ {choice.actions.length}건의 할 일이 자동 생성됩니다</p>}
                {choice.reminder && <p className="text-[10px] mt-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#7A9B88' }}>→ 리마인더가 설정됩니다</p>}
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-4 relative overflow-hidden">
            <motion.div initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: [0, 0.3, 0], scale: [0.3, 2, 2.5] }}
              transition={{ duration: 1 }} className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(circle, ${characterColor}20 0%, transparent 60%)` }} />
            <div className="text-center mb-4 relative z-10">
              <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ type: 'spring', damping: 8 }}
                className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(142,186,164,0.15)' }}>
                <span className="text-xl">⚡</span>
              </motion.div>
              <p className="text-[14px] font-semibold" style={{ color: '#2A3B32' }}>{selected.text}</p>
              <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
                className="text-xl font-semibold mt-2 tabular-nums" style={{ color: '#8EBAA4' }}>+{selected.exp} EXP!</motion.p>
              <p className="text-[12px] mt-1" style={{ color: '#7A9B88' }}>{selected.effect}</p>
            </div>
            {selected.actions && selected.actions.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="mt-3 p-3 rounded-xl border" style={{ background: 'rgba(142,186,164,0.06)', borderColor: 'rgba(142,186,164,0.2)' }}>
                <p className="text-[11px] font-semibold mb-2" style={{ color: '#4A6355' }}>📋 할 일 목록에 추가됨</p>
                {selected.actions.map((a, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.08 }}
                    className="flex items-center gap-2 py-1 text-[12px]" style={{ color: '#4A6355' }}>
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white flex-shrink-0" style={{ background: '#8EBAA4' }}>✓</span>
                    <span>{a.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
            {selected.reminder && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                className="mt-3 p-3 rounded-xl border" style={{ background: 'rgba(122,155,136,0.06)', borderColor: 'rgba(122,155,136,0.2)' }}>
                <p className="text-[11px] font-semibold" style={{ color: '#4A6355' }}>⏰ 리마인더 설정됨</p>
                <p className="text-[12px] mt-1" style={{ color: '#7A9B88' }}>{selected.reminder.text} — {selected.reminder.due}</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
