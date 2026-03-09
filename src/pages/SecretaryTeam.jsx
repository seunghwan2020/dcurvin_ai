import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../components/Card'
import DialogBox from '../components/DialogBox'
import CharacterSprite from '../components/CharacterSprite'
import DecisionPanel from '../components/DecisionPanel'
import {
  characters, mailSummary, todoList as initialTodos,
  scheduleData, keyDecisions, secretaryDecisions,
} from '../data/mockData'

const char = characters.haeun

const dialogMessages = [
  { text: '대표님, 좋은 아침이에요! 오늘의 주요 일정과 할 일을 정리해왔어요.' },
  { text: '읽지 않은 중요 메일이 2건 있어요. OEM 공장 생산 완료 통보와 N배송 수수료 변경 안내입니다.' },
  { text: '오늘 회의가 3건, 핵심 의사결정 2건이 있습니다. 특히 OEM 발주 승인은 오늘 18시 마감이에요!' },
  { text: '아래에서 상세 내용을 확인하시고, 우선순위를 정해주세요!' },
]

export default function SecretaryTeam() {
  const [dialogDone, setDialogDone] = useState(false)
  const [todos, setTodos] = useState(initialTodos)
  const [newTodo, setNewTodo] = useState('')

  const toggleTodo = (id) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const addTodo = () => {
    if (!newTodo.trim()) return
    setTodos(prev => [...prev, {
      id: Date.now(),
      text: newTodo,
      priority: 'medium',
      done: false,
      dueDate: '오늘',
    }])
    setNewTodo('')
  }

  const removeTodo = (id) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  const typeIcon = { meeting: '🤝', lunch: '🍽️', review: '🎨', report: '📋' }

  return (
    <div className="space-y-5">
      {/* Character + Dialog */}
      <div className="flex items-start gap-4">
        <CharacterSprite characterId="haeun" size="md" showName={false} />
        <div className="flex-1">
          {!dialogDone ? (
            <DialogBox character={char} messages={dialogMessages} onComplete={() => setDialogDone(true)} />
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm p-4">
              <p className="text-sm text-gray-600">{char.emoji} <span className="font-semibold">{char.name}</span>: 오늘의 스케줄과 할 일을 확인해주세요!</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Key Decisions */}
      <Card title="⚡ 오늘의 핵심 의사결정 사항" delay={0.1}>
        <div className="space-y-2">
          {keyDecisions.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className={`flex items-center justify-between p-3 rounded-xl border ${
                d.urgency === 'high' ? 'bg-red-50 border-red-200' :
                d.urgency === 'medium' ? 'bg-amber-50 border-amber-200' :
                'bg-gray-50 border-gray-100'
              }`}
            >
              <div>
                <p className="text-sm font-medium text-gray-800">{d.title}</p>
                <p className="text-xs text-gray-500">마감: {d.deadline}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                d.status === '미결정' ? 'bg-red-100 text-red-600' :
                d.status === '검토중' ? 'bg-amber-100 text-amber-600' :
                'bg-blue-100 text-blue-600'
              }`}>{d.status}</span>
            </motion.div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Mail Summary */}
        <Card title="📧 메일/알림 요약" delay={0.15}>
          <div className="space-y-2">
            {mailSummary.map((mail, i) => (
              <motion.div
                key={mail.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className={`flex items-start gap-3 p-2.5 rounded-xl ${
                  !mail.read ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {!mail.read ? (
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-transparent" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{mail.from}</span>
                    {mail.important && <span className="text-[10px] text-red-500">⭐</span>}
                    <span className="text-[10px] text-gray-400 ml-auto">{mail.time}</span>
                  </div>
                  <p className={`text-sm truncate ${!mail.read ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                    {mail.subject}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Schedule */}
        <Card title="📅 오늘의 일정" delay={0.2}>
          <div className="space-y-1">
            {scheduleData.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50"
              >
                <span className="text-sm font-mono text-gray-400 w-12">{s.time}</span>
                <span className="text-lg">{typeIcon[s.type] || '📌'}</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 font-medium">{s.event}</p>
                  <p className="text-xs text-gray-400">{s.team}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* To-Do List */}
      <Card title="✅ To-Do 리스트" delay={0.25}>
        {/* Add new todo */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTodo}
            onChange={e => setNewTodo(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTodo()}
            placeholder="새 할 일 추가..."
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A661]/30 focus:border-[#C4A661]"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addTodo}
            className="px-4 py-2 bg-[#C4A661] text-white rounded-xl text-sm font-medium shadow-sm"
          >
            추가
          </motion.button>
        </div>

        {/* Todo items */}
        <AnimatePresence>
          {todos.map((todo, i) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0, x: -100 }}
              className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
            >
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={() => toggleTodo(todo.id)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  todo.done ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-[#C4A661]'
                }`}
              >
                {todo.done && <span className="text-white text-xs">✓</span>}
              </motion.button>
              <span className={`flex-1 text-sm ${todo.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                {todo.text}
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                todo.priority === 'high' ? 'bg-red-100 text-red-600' :
                todo.priority === 'medium' ? 'bg-amber-100 text-amber-600' :
                'bg-gray-100 text-gray-500'
              }`}>{todo.dueDate}</span>
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => removeTodo(todo.id)}
                className="text-gray-300 hover:text-red-400 text-sm"
              >
                ✕
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </Card>

      {/* Decisions */}
      {secretaryDecisions.map(d => (
        <DecisionPanel key={d.id} decision={d} character={char} />
      ))}
    </div>
  )
}
