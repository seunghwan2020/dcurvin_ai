import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'
import LevelUpOverlay from './LevelUpOverlay'

export default function Layout() {
  const { level, exp, maxExp, title } = useGame()
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const expPct = (exp / maxExp) * 100

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #faf8f3 0%, #f5f2ec 25%, #faf8f4 50%, #f8f5ef 75%, #faf9f5 100%)' }}>
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #C4A661, transparent 60%)' }} />
        <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent 60%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.015]"
          style={{ background: 'radial-gradient(circle, #C4A661, transparent 50%)' }} />
      </div>

      {/* Header - Game HUD Style */}
      <header className="sticky top-0 z-50 border-b" style={{
        background: 'linear-gradient(180deg, rgba(250,248,243,0.95) 0%, rgba(250,248,243,0.85) 100%)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderColor: 'rgba(196,166,97,0.12)',
        boxShadow: '0 1px 20px rgba(196,166,97,0.06)',
      }}>
        <div className="max-w-7xl mx-auto px-5 py-2 flex items-center justify-between">
          {/* Left: Logo + Back */}
          <div className="flex items-center gap-3">
            {!isHome && (
              <motion.button initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate('/')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 transition-all">
                <span className="text-[10px]">←</span> 사무실
              </motion.button>
            )}
            <h1 className="text-[17px] font-black cursor-pointer tracking-tight flex items-center gap-1.5" onClick={() => navigate('/')}>
              <span className="bg-gradient-to-r from-[#C4A661] to-[#b8953e] bg-clip-text text-transparent">D.CURVIN</span>
              <span className="text-[9px] font-bold text-gray-300 tracking-[0.2em] ml-1 hidden sm:inline">CEO RPG</span>
            </h1>
          </div>

          {/* Right: Game HUD */}
          <div className="flex items-center gap-2.5">
            {/* Title badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{
              background: 'linear-gradient(135deg, rgba(196,166,97,0.08) 0%, rgba(196,166,97,0.04) 100%)',
              border: '1px solid rgba(196,166,97,0.15)',
            }}>
              <span className="text-[10px] font-semibold text-[#a8924e]">{title}</span>
            </div>

            {/* Level + EXP bar */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl relative overflow-hidden" style={{
              background: 'linear-gradient(135deg, #2a2520 0%, #1a1815 100%)',
              border: '1px solid rgba(196,166,97,0.3)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}>
              {/* Level badge */}
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{
                  background: 'linear-gradient(135deg, #C4A661 0%, #a8863c 100%)',
                  boxShadow: '0 1px 4px rgba(196,166,97,0.4)',
                }}>
                  <span className="text-[8px] font-black text-white">👑</span>
                </div>
                <span className="text-[12px] font-black text-amber-400 tracking-tight">Lv.{level}</span>
              </div>

              {/* EXP Bar - HP bar style */}
              <div className="w-20 sm:w-28 relative">
                <div className="h-3 rounded-full overflow-hidden relative" style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(196,166,97,0.2)',
                }}>
                  <motion.div
                    className="h-full rounded-full relative"
                    style={{
                      background: 'linear-gradient(180deg, #e8c84a 0%, #C4A661 50%, #a88b3c 100%)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${expPct}%` }}
                    transition={{ type: 'spring', damping: 20 }}
                  >
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, transparent 100%)' }} />
                    </div>
                  </motion.div>
                </div>
                <p className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white/80 mix-blend-difference">{exp}/{maxExp}</p>
              </div>
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
