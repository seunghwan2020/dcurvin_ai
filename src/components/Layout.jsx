import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'
import LevelUpOverlay from './ExpPopup'

export default function Layout() {
  const { level, exp, maxExp, title } = useGame()
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Ambient particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-300/30 rounded-full"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              repeat: Infinity,
              duration: 4 + i * 0.5,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: Brand */}
          <div className="flex items-center gap-3">
            {!isHome && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-gray-700 transition-colors text-sm"
              >
                ← 사무실
              </motion.button>
            )}
            <h1
              className="text-lg font-bold cursor-pointer"
              onClick={() => navigate('/')}
              style={{ color: '#C4A661' }}
            >
              D.CURVIN
            </h1>
            <span className="text-xs text-gray-400 hidden sm:inline">CEO RPG 경영 시뮬레이터</span>
          </div>

          {/* Right: CEO Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500">{title}</p>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-amber-100 rounded-full px-3 py-1.5 border border-amber-200">
              <span className="text-sm">👑</span>
              <span className="text-xs font-bold text-amber-700">Lv.{level}</span>
              <div className="w-16 h-1.5 bg-amber-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(exp / maxExp) * 100}%` }}
                  transition={{ type: 'spring', damping: 15 }}
                />
              </div>
              <span className="text-[10px] text-amber-500">{exp}/{maxExp}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-6">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Level up overlay */}
      <LevelUpOverlay />
    </div>
  )
}
