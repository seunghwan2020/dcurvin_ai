import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'
import LevelUpOverlay from './LevelUpOverlay'

export default function Layout() {
  const { level, exp, maxExp, title } = useGame()
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #fafafa 0%, #f5f3ef 30%, #fafafa 60%, #f8f6f2 100%)' }}>
      {/* Subtle warm ambient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #C4A661, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.02]"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-2xl border-b border-white/40 shadow-[0_1px_12px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!isHome && (
              <motion.button initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-gray-600 transition-colors text-[13px] font-medium">
                ← 사무실
              </motion.button>
            )}
            <h1 className="text-base font-bold cursor-pointer tracking-tight" onClick={() => navigate('/')}
              style={{ color: '#C4A661' }}>
              D.CURVIN
            </h1>
            <span className="text-[10px] text-gray-300 font-medium tracking-widest hidden sm:inline">CEO RPG</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-gray-400 font-medium">{title}</p>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50/80 to-amber-100/60 backdrop-blur-xl rounded-full px-3 py-1.5 border border-amber-200/50">
              <span className="text-xs">👑</span>
              <span className="text-[11px] font-bold text-amber-700">Lv.{level}</span>
              <div className="w-14 h-1.5 bg-amber-200/50 rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #C4A661, #d4b96e)' }}
                  initial={{ width: 0 }} animate={{ width: `${(exp / maxExp) * 100}%` }}
                  transition={{ type: 'spring', damping: 20 }} />
              </div>
              <span className="text-[9px] text-amber-400 font-medium">{exp}/{maxExp}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-5 py-6">
        <motion.div key={location.pathname}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}>
          <Outlet />
        </motion.div>
      </main>

      <LevelUpOverlay />
    </div>
  )
}
