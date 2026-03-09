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
      return {
        ...state,
        quests: state.quests.map(q => q.id === action.payload ? { ...q, done: true } : q),
      }
    case 'VISIT_TEAM':
      return { ...state, visitedTeams: [...new Set([...state.visitedTeams, action.payload])] }
    default:
      return state
  }
}

const initialState = {
  level: 1, exp: 0, maxExp: 100, title: '신입 대표',
  decisions: [], leveledUp: false, quests: initialQuests, visitedTeams: [],
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  const gainExp = useCallback((amount) => dispatch({ type: 'GAIN_EXP', payload: amount }), [])
  const clearLevelUp = useCallback(() => dispatch({ type: 'CLEAR_LEVEL_UP' }), [])
  const makeDecision = useCallback((decisionId, choice) => {
    gainExp(choice.exp)
    dispatch({ type: 'ADD_DECISION', payload: { decisionId, choiceId: choice.id, text: choice.text, exp: choice.exp } })
  }, [gainExp])
  const completeQuest = useCallback((questId) => {
    const quest = initialQuests.find(q => q.id === questId)
    if (quest && !state.quests.find(q => q.id === questId)?.done) {
      dispatch({ type: 'COMPLETE_QUEST', payload: questId })
      gainExp(quest.exp)
    }
  }, [state.quests, gainExp])
  const visitTeam = useCallback((teamId) => dispatch({ type: 'VISIT_TEAM', payload: teamId }), [])

  return (
    <GameContext.Provider value={{ ...state, dispatch, gainExp, clearLevelUp, makeDecision, completeQuest, visitTeam }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be inside GameProvider')
  return ctx
}
