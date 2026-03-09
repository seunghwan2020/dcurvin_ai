import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../components/Card'
import ReportLayout from '../components/ReportLayout'
import DecisionPanel from '../components/DecisionPanel'
import ExecutionChecklist from '../components/ExecutionChecklist'
import { useGame } from '../context/GameContext'
import { characters, mailSummary, scheduleData, keyDecisions, secretaryDecisions, executionChecklists } from '../data/mockData'

const c = characters.haeun
const msgs = [
  { text: '대표님, 좋은 아침이에요! 비서실장 하은입니다.' },
  { text: '읽지 않은 중요 메일이 2건 있어요. OEM 생산 완료와 N배송 수수료 변경 안내입니다.' },
  { text: '오늘 회의 3건, 핵심 의사결정 2건! OEM 발주 승인은 오늘 18시 마감이에요.' },
  { text: '각 팀에서 생성된 할 일도 아래에서 통합 관리하고 있어요!' },
]

export default function SecretaryTeam() {
  const { todos, reminders, addTodo, toggleTodo, removeTodo, dismissReminder } = useGame()
  const [newTodo, setNewTodo] = useState('')
  const [filter, setFilter] = useState('all')

  const handleAddTodo = () => {
    if (!newTodo.trim()) return
    addTodo({ text: newTodo, priority: 'medium', due: '오늘', team: '비서팀' })
    setNewTodo('')
  }

  const filteredTodos = filter === 'all' ? todos : todos.filter(t => t.team === filter)
  const teams = [...new Set(todos.map(t => t.team).filter(Boolean))]
  const pendingCount = todos.filter(t => !t.done).length
  const doneCount = todos.filter(t => t.done).length

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

        {reminders.length > 0 && (
          <Card title="리마인더" icon="⏰" delay={0.12}>
            <div className="space-y-2">
              {reminders.map((r, i) => (
                <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 border border-amber-200/40">
                  <div>
                    <p className="text-[12px] font-medium text-amber-800">{r.text}</p>
                    <p className="text-[10px] text-amber-500">{r.team} · {r.due}</p>
                  </div>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => dismissReminder(r.id)}
                    className="px-2 py-1 rounded-lg text-[10px] font-medium text-amber-600 bg-amber-100/60 hover:bg-amber-200/60">확인</motion.button>
                </motion.div>
              ))}
            </div>
          </Card>
        )}

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

        <Card title={`통합 To-Do 관리 (${pendingCount}건 진행 중 · ${doneCount}건 완료)`} icon="✅" delay={0.25}>
          <div className="flex flex-wrap gap-1.5 mb-3">
            <button onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${filter === 'all' ? 'text-white shadow-sm' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
              style={filter === 'all' ? { background: '#C4A661' } : {}}>전체 ({todos.length})</button>
            {teams.map(team => {
              const count = todos.filter(t => t.team === team).length
              return <button key={team} onClick={() => setFilter(team)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${filter === team ? 'text-white shadow-sm' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                style={filter === team ? { background: '#C4A661' } : {}}>{team} ({count})</button>
            })}
          </div>
          <div className="flex gap-2 mb-3">
            <input type="text" value={newTodo} onChange={e => setNewTodo(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddTodo()}
              placeholder="새 할 일 추가..." className="flex-1 px-3 py-2 bg-gray-50/60 border border-gray-200/60 rounded-xl text-[12px] focus:outline-none focus:ring-2 focus:ring-[#C4A661]/20 focus:border-[#C4A661]/40" />
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={handleAddTodo}
              className="px-4 py-2 rounded-xl text-[12px] font-semibold text-white shadow-sm" style={{ background: '#C4A661' }}>추가</motion.button>
          </div>
          <AnimatePresence>{filteredTodos.map(todo => (
            <motion.div key={todo.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0, x: -60 }}
              className="flex items-center gap-2.5 py-2 border-b border-gray-50 last:border-0">
              <motion.button whileTap={{ scale: 0.8 }} onClick={() => toggleTodo(todo.id)}
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${todo.done ? 'bg-emerald-400 border-emerald-400' : 'border-gray-200 hover:border-[#C4A661]'}`}>
                {todo.done && <span className="text-white text-[7px]">✓</span>}
              </motion.button>
              <div className="flex-1 min-w-0">
                <span className={`text-[12px] ${todo.done ? 'line-through text-gray-300' : 'text-gray-600'}`}>{todo.text}</span>
                {todo.team && <span className="ml-1.5 text-[9px] text-gray-300 bg-gray-50 px-1.5 py-0.5 rounded">{todo.team}</span>}
              </div>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${todo.priority === 'high' ? 'bg-red-100 text-red-500' : todo.priority === 'medium' ? 'bg-amber-100 text-amber-500' : 'bg-gray-100 text-gray-400'}`}>{todo.due}</span>
              <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }} onClick={() => removeTodo(todo.id)} className="text-gray-200 hover:text-red-400 text-[11px]">✕</motion.button>
            </motion.div>
          ))}</AnimatePresence>
        </Card>

        <ExecutionChecklist items={executionChecklists.secretary} delay={0.3} />

        {secretaryDecisions.map(d => <DecisionPanel key={d.id} decision={d} characterColor={c.color}/>)}
      </div>
    </ReportLayout>
  )
}
