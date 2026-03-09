import { useState } from 'react'
import { motion } from 'framer-motion'
import Card from './Card'

export default function ExecutionChecklist({ items, delay = 0.4 }) {
  const [checked, setChecked] = useState({})

  const toggle = (i) => setChecked(prev => ({ ...prev, [i]: !prev[i] }))

  return (
    <Card title="실행 체크리스트" icon="📋" delay={delay}>
      <p className="text-[10px] text-gray-400 mb-3">아래 항목을 직접 실행해주세요. 완료 시 체크하면 비서팀 하은에게 전달됩니다.</p>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: delay + 0.1 + i * 0.06 }}
            className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${checked[i] ? 'bg-emerald-50/40 border-emerald-200/40' : 'bg-white/50 border-gray-100 hover:border-[#C4A661]/30'}`}
            onClick={() => toggle(i)}>
            <motion.div whileTap={{ scale: 0.8 }}
              className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${checked[i] ? 'bg-emerald-400 border-emerald-400' : 'border-gray-200'}`}>
              {checked[i] && <span className="text-white text-[9px] font-bold">✓</span>}
            </motion.div>
            <span className={`flex-1 text-[12px] transition-all ${checked[i] ? 'line-through text-gray-300' : 'text-gray-600'}`}>{item.text}</span>
            <span className="text-[9px] text-gray-300 bg-gray-50 px-2 py-0.5 rounded-full">{item.link}</span>
          </motion.div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100/50 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#C4A661]" />
        <p className="text-[10px] text-gray-400">체크된 항목은 비서팀 To-Do에 '완료'로 반영됩니다</p>
      </div>
    </Card>
  )
}
