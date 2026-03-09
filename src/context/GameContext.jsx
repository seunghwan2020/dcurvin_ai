import { createContext, useContext, useReducer, useCallback } from 'react'

const titles = [
  { level: 1, title: '신입 대표' },
  { level: 3, title: '성장하는 리더' },
  { level: 5, title: '성장하는 CEO' },
  { level: 8, title: '전략적 경영자' },
  { level: 10, title: '전략가' },
  { level: 15, title: '업계의 별' },
  { level: 20, title: '패션계의 전설' },
  { level: 30, title: '글로벌 패션 황제' },
]

const initialQuests = [
  { id: 'q1', text: '매출 보고 확인하기', done: false, exp: 20 },
  { id: 'q2', text: '미답변 CS 처리하기', done: false, exp: 25 },
  { id: 'q3', text: '재고 현황 점검하기', done: false, exp: 20 },
  { id: 'q4', text: '발주 계획 세우기', done: false, exp: 30 },
  { id: 'q5', text: '일정 확인하기', done: false, exp: 15 },
]

const GameContext = createContext()

function getTitle(level) {
  return [...titles].reverse().find(t => level >= t.level)?.title || '신입 대표'
}

let todoIdCounter = 100

function gameReducer(state, action) {
  switch (action.type) {
    case 'GAIN_EXP': {
      let newExp = state.exp + action.payload
      let newLevel = state.level
      let newMaxExp = state.maxExp
      let leveledUp = false
      while (newExp >= newMaxExp) {
        newExp -= newMaxExp
        newLevel++
        newMaxExp = Math.round(newMaxExp * 1.4)
        leveledUp = true
      }
      return { ...state, exp: newExp, level: newLevel, maxExp: newMaxExp, title: getTitle(newLevel), leveledUp }
    }
    case 'CLEAR_LEVEL_UP':
      return { ...state, leveledUp: false }
    case 'ADD_DECISION':
      return { ...state, decisions: [...state.decisions, { ...action.payload, timestamp: Date.now() }] }
    case 'COMPLETE_QUEST':
      return { ...state, quests: state.quests.map(q => q.id === action.payload ? { ...q, done: true } : q) }
    case 'VISIT_TEAM':
      return { ...state, visitedTeams: [...new Set([...state.visitedTeams, action.payload])] }
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, { id: todoIdCounter++, ...action.payload, done: false, createdAt: Date.now() }] }
    case 'ADD_TODOS':
      return { ...state, todos: [...state.todos, ...action.payload.map(t => ({ id: todoIdCounter++, ...t, done: false, createdAt: Date.now() }))] }
    case 'TOGGLE_TODO':
      return { ...state, todos: state.todos.map(t => t.id === action.payload ? { ...t, done: !t.done } : t) }
    case 'REMOVE_TODO':
      return { ...state, todos: state.todos.filter(t => t.id !== action.payload) }
    case 'ADD_REMINDER':
      return { ...state, reminders: [...state.reminders, { id: todoIdCounter++, ...action.payload, createdAt: Date.now() }] }
    case 'DISMISS_REMINDER':
      return { ...state, reminders: state.reminders.filter(r => r.id !== action.payload) }
    default:
      return state
  }
}

const initialState = {
  level: 1, exp: 0, maxExp: 100, title: '신입 대표',
  decisions: [], leveledUp: false, quests: initialQuests, visitedTeams: [],
  todos: [
    { id: 1, text: 'OEM 발주 최종 승인', team: '비서팀', priority: 'high', done: false, due: '오늘', createdAt: Date.now() },
    { id: 2, text: 'N배송 수수료 변경 검토', team: '비서팀', priority: 'high', done: false, due: '오늘', createdAt: Date.now() },
    { id: 3, text: 'S/S 디자인 시안 피드백', team: '비서팀', priority: 'medium', done: false, due: '내일', createdAt: Date.now() },
    { id: 4, text: '월간 경영 회의 준비', team: '비서팀', priority: 'medium', done: false, due: '3/12', createdAt: Date.now() },
    { id: 5, text: '결산 보고서 검토', team: '비서팀', priority: 'low', done: true, due: '완료', createdAt: Date.now() },
  ],
  reminders: [],
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  const gainExp = useCallback((amount) => dispatch({ type: 'GAIN_EXP', payload: amount }), [])
  const clearLevelUp = useCallback(() => dispatch({ type: 'CLEAR_LEVEL_UP' }), [])
  const makeDecision = useCallback((decisionId, choice) => {
    gainExp(choice.exp)
    dispatch({ type: 'ADD_DECISION', payload: { decisionId, choiceId: choice.id, text: choice.text, exp: choice.exp } })
    if (choice.actions && choice.actions.length > 0) {
      dispatch({ type: 'ADD_TODOS', payload: choice.actions })
    }
    if (choice.reminder) {
      dispatch({ type: 'ADD_REMINDER', payload: choice.reminder })
    }
  }, [gainExp])
  const completeQuest = useCallback((questId) => {
    const quest = initialQuests.find(q => q.id === questId)
    if (quest && !state.quests.find(q => q.id === questId)?.done) {
      dispatch({ type: 'COMPLETE_QUEST', payload: questId })
      gainExp(quest.exp)
    }
  }, [state.quests, gainExp])
  const visitTeam = useCallback((teamId) => dispatch({ type: 'VISIT_TEAM', payload: teamId }), [])
  const addTodo = useCallback((todo) => dispatch({ type: 'ADD_TODO', payload: todo }), [])
  const toggleTodo = useCallback((id) => dispatch({ type: 'TOGGLE_TODO', payload: id }), [])
  const removeTodo = useCallback((id) => dispatch({ type: 'REMOVE_TODO', payload: id }), [])
  const dismissReminder = useCallback((id) => dispatch({ type: 'DISMISS_REMINDER', payload: id }), [])

  return (
    <GameContext.Provider value={{ ...state, dispatch, gainExp, clearLevelUp, makeDecision, completeQuest, visitTeam, addTodo, toggleTodo, removeTodo, dismissReminder }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be inside GameProvider')
  return ctx
}
