import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../components/Card'
import ReportLayout from '../components/ReportLayout'
import DecisionPanel from '../components/DecisionPanel'
import { characters, mailSummary, initialTodos, scheduleData, keyDecisions, secretaryDecisions } from '../data/mockData'

const c = characters.haeun
const msgs = [
  { text: '대표님, 좋은 아침이에요! 비서실장 하은입니다.' },
  { text: '읽지 않은 중요 메일이 2건 있어요. OEM 생산 완료와 N배송 수수료 변경 안내입니다.' },
  { text: '오늘 회의 3건, 핵심 의사결정 2건! OEM 발주 승인은 오늘 18시 마감이에요.' },
  { text: '아래에서 상세 내용 확인하시고, 우선순위를 정해주세요!' },
]

export default function SecretaryTeam() {
  const [todos, setTodos] = useState(initialTodos)
  const [newTodo, setNewTodo] = useState('')

  const toggleTodo = id => setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  const removeTodo = id => setTodos(prev => prev.filter(t => t.id !== id))
  const addTodo = () => { if (!newTodo.trim()) return; setTodos(prev => [...prev, { id: Date.now(), text: newTodo, priority: 'medium', done: false, due: '오늘' }]); setNewTodo('') }

  return (
    <ReportLayout characterId="haeun" characterName={c.name} characterColor={c.color} messages={msgs} questId="q5">
      <div className="space-y-5">
        <Card title="오늘의 핵심 의사결정" icon="⚡" delay={0.1}>
          <div className="space-y-2">{keyDecisions.map((d, i) => (
            <motion.div key={d.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.07 }}
              className={`flex items-center justify-between p-3 rounded-xl border ${d.urgency === 'high' ? 'bg-red-50/50 border-red-200/50' : d.urgency === 'medium' ? 'bg-amber-50/50 border-amber-200/50' : 'bg-gray-50/50 border-gray-100'}`}>
              <div><p className="text-[13px] font-medium text-gray-800">{d.title}</p><p className="text-[10px] text-gray-400">마감: {d.deadline}</p></div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${d.status === '미결정' ? 'bg-red-100 text-red-600' : d.status === '검토중' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>{d.status}</span>
            </motion.div>
          ))}</div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card title="메일/알림 요약" icon="📧" delay={0.15}>
            <div className="space-y-1.5">{mailSummary.map((m, i) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.04 }}
                className={`flex items-start gap-2.5 p-2 rounded-xl ${!m.read ? 'bg-blue-50/50 border border-blue-100/50' : 'hover:bg-gray-50/30'}`}>
                <div className="mt-1.5">{!m.read ? <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> : <div className="w-1.5 h-1.5" />}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5"><span className="text-[10px] text-gray-400">{m.from}</span>{m.important && <span className="text-[8px] text-red-400">⭐</span>}<span className="text-[9px] text-gray-300 ml-auto">{m.time}</span></div>
                  <p className={`text-[12px] truncate ${!m.read ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>{m.subject}</p>
                </div>
              </motion.div>
            ))}</div>
          </Card>

          <Card title="오늘의 일정" icon="📅" delay={0.2}>
            <div className="space-y-0.5">{scheduleData.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50/30">
                <span className="text-[11px] font-mono text-gray-300 w-10">{s.time}</span>
                <span className="text-sm">{s.icon}</span>
                <div className="flex-1"><p className="text-[12px] text-gray-700 font-medium">{s.event}</p><p className="text-[10px] text-gray-300">{s.team}</p></div>
              </motion.div>
            ))}</div>
          </Card>
        </div>

        <Card title="To-Do 리스트" icon="✅" delay={0.25}>
          <div className="flex gap-2 mb-3">
            <input type="text" value={newTodo} onChange={e => setNewTodo(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTodo()}
              placeholder="새 할 일 추가..." className="flex-1 px-3 py-2 bg-gray-50/60 border border-gray-200/60 rounded-xl text-[12px] focus:outline-none focus:ring-2 focus:ring-[#C4A661]/20 focus:border-[#C4A661]/40" />
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={addTodo}
              className="px-4 py-2 rounded-xl text-[12px] font-semibold text-white shadow-sm" style={{ background: '#C4A661' }}>추가</motion.button>
          </div>
          <AnimatePresence>{todos.map(todo => (
            <motion.div key={todo.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0, x: -60 }}
              className="flex items-center gap-2.5 py-2 border-b border-gray-50 last:border-0">
              <motion.button whileTap={{ scale: 0.8 }} onClick={() => toggleTodo(todo.id)}
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${todo.done ? 'bg-emerald-400 border-emerald-400' : 'border-gray-200 hover:border-[#C4A661]'}`}>
                {todo.done && <span className="text-white text-[7px]">✓</span>}
              </motion.button>
              <span className={`flex-1 text-[12px] ${todo.done ? 'line-through text-gray-300' : 'text-gray-600'}`}>{todo.text}</span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${todo.priority === 'high' ? 'bg-red-100 text-red-500' : todo.priority === 'medium' ? 'bg-amber-100 text-amber-500' : 'bg-gray-100 text-gray-400'}`}>{todo.due}</span>
              <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }} onClick={() => removeTodo(todo.id)} className="text-gray-200 hover:text-red-400 text-[11px]">✕</motion.button>
            </motion.div>
          ))}</AnimatePresence>
        </Card>

        {secretaryDecisions.map(d => <DecisionPanel key={d.id} decision={d} characterColor={c.color}/>)}
      </div>
    </ReportLayout>
  )
}
