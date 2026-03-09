import { useState } from 'react'
import { motion } from 'framer-motion'
import Card from './Card'

export default function ExecutionChecklist({ items, delay = 0.4 }) {
  const [checked, setChecked] = useState({})
  const toggle = (i) => setChecked(prev => ({ ...prev, [i]: !prev[i] }))

  return (
    <Card title="실행 체크리스트" icon="📋" delay={delay}>
      <p className="text-[12px] mb-3" style={{ color: '#7A9B88' }}>아래 항목을 직접 실행해주세요. 완료 시 체크하면 비서팀에 전달됩니다.</p>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: delay + 0.1 + i * 0.06 }}
            className="flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer"
            style={{
              background: checked[i] ? 'rgba(142,186,164,0.08)' : 'rgba(255,255,255,0.5)',
              borderColor: checked[i] ? 'rgba(142,186,164,0.3)' : 'rgba(198,213,204,0.3)',
            }}
            onClick={() => toggle(i)}>
            <motion.div whileTap={{ scale: 0.8 }}
              className="w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all"
              style={{
                background: checked[i] ? '#8EBAA4' : 'transparent',
                borderColor: checked[i] ? '#8EBAA4' : '#C6D5CC',
              }}>
              {checked[i] && <span className="text-white text-[9px] font-semibold">✓</span>}
            </motion.div>
            <span className="flex-1 text-[13px] transition-all"
              style={{ color: checked[i] ? '#C6D5CC' : '#4A6355', textDecoration: checked[i] ? 'line-through' : 'none' }}>
              {item.text}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#EFF4F1', color: '#7A9B88' }}>{item.link}</span>
          </motion.div>
        ))}
      </div>
      <div className="mt-3 pt-3 flex items-center gap-2" style={{ borderTop: '1px solid rgba(198,213,204,0.3)' }}>
        <div className="w-2 h-2 rounded-full" style={{ background: '#8EBAA4' }} />
        <p className="text-[11px]" style={{ color: '#7A9B88' }}>체크된 항목은 비서팀 To-Do에 '완료'로 반영됩니다</p>
      </div>
    </Card>
  )
}
