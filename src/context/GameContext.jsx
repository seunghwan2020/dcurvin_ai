import { createContext, useContext, useReducer, useCallback } from 'react'
import { initialCeoState } from '../data/mockData'

const GameContext = createContext()

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
        newMaxExp = Math.round(newMaxExp * 1.5)
        leveledUp = true
      }

      const newTitle = [...initialCeoState.titles]
        .reverse()
        .find(t => newLevel >= t.level)?.title || state.title

      return {
        ...state,
        exp: newExp,
        level: newLevel,
        maxExp: newMaxExp,
        title: newTitle,
        leveledUp,
      }
    }
    case 'CLEAR_LEVEL_UP':
      return { ...state, leveledUp: false }
    case 'ADD_DECISION':
      return {
        ...state,
        decisions: [...state.decisions, { ...action.payload, timestamp: Date.now() }],
      }
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...(state.todos || []), action.payload],
      }
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: (state.todos || []).map(t =>
          t.id === action.payload ? { ...t, done: !t.done } : t
        ),
      }
    case 'REMOVE_TODO':
      return {
        ...state,
        todos: (state.todos || []).filter(t => t.id !== action.payload),
      }
    default:
      return state
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, {
    ...initialCeoState,
    leveledUp: false,
    todos: [],
  })

  const gainExp = useCallback((amount) => {
    dispatch({ type: 'GAIN_EXP', payload: amount })
  }, [])

  const addDecision = useCallback((decision) => {
    dispatch({ type: 'ADD_DECISION', payload: decision })
  }, [])

  const clearLevelUp = useCallback(() => {
    dispatch({ type: 'CLEAR_LEVEL_UP' })
  }, [])

  const makeDecision = useCallback((decisionId, choice) => {
    gainExp(choice.exp)
    addDecision({ decisionId, choiceId: choice.id, text: choice.text, exp: choice.exp })
  }, [gainExp, addDecision])

  return (
    <GameContext.Provider value={{ ...state, dispatch, gainExp, addDecision, clearLevelUp, makeDecision }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be inside GameProvider')
  return ctx
}
