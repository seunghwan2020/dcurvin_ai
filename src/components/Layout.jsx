import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'
import LevelUpOverlay from './LevelUpOverlay'

/* SVG gold/diamond icons */
function GoldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <defs>
        <linearGradient id="gold-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0d875" />
          <stop offset="50%" stopColor="#C4A661" />
          <stop offset="100%" stopColor="#8b7535" />
        </linearGradient>
      </defs>
      <circle cx="10" cy="10" r="8.5" fill="url(#gold-g)" stroke="#8b7535" strokeWidth="1" />
      <circle cx="10" cy="10" r="6.5" stroke="#f0d875" strokeWidth="0.5" fill="none" opacity="0.5" />
      <text x="10" y="13.5" textAnchor="middle" fill="#5c4a1e" fontSize="9" fontWeight="900">G</text>
      <circle cx="7" cy="7" r="2" fill="white" opacity="0.25" />
    </svg>
  )
}

function DiamondIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <defs>
        <linearGradient id="dia-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c0e8ff" />
          <stop offset="50%" stopColor="#7cb9e8" />
          <stop offset="100%" stopColor="#5b9bd5" />
        </linearGradient>
      </defs>
      <polygon points="10,1 18,8 10,19 2,8" fill="url(#dia-g)" stroke="#5b9bd5" strokeWidth="0.8" />
      <polygon points="10,1 14,8 10,19 6,8" fill="white" opacity="0.15" />
      <line x1="2" y1="8" x2="18" y2="8" stroke="#5b9bd5" strokeWidth="0.5" />
      <polygon points="6,8 10,1 14,8" fill="white" opacity="0.12" />
    </svg>
  )
}

/* Floating particles component */
function FloatingParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i}
          className="absolute w-1 h-1 rounded-full animate-float-particle"
          style={{
            background: i % 3 === 0 ? '#C4A661' : i % 3 === 1 ? '#e8d5a0' : '#d4b96e',
            left: `${8 + (i * 7.5) % 85}%`,
            top: `${20 + (i * 13) % 60}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${5 + (i % 3) * 2}s`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  )
}

export default function Layout() {
  const { level, exp, maxExp, title } = useGame()
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const expPct = (exp / maxExp) * 100

  return (
    <div className="min-h-screen relative overflow-hidden iso-floor" style={{ background: 'linear-gradient(160deg, #faf8f3 0%, #f5f2ec 25%, #faf8f4 50%, #f8f5ef 75%, #faf9f5 100%)' }}>
      <FloatingParticles />

      {/* Ambient light orbs with parallax feel */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div animate={{ x: [0, 15, 0], y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 20, ease: 'easeInOut' }}
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #C4A661, transparent 55%)' }} />
        <motion.div animate={{ x: [0, -10, 0], y: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 25, ease: 'easeInOut' }}
          className="absolute -bottom-24 -left-24 w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent 55%)' }} />
        {/* Window light ray effect */}
        <div className="absolute top-0 left-[5%] w-[200px] h-full animate-light-ray pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(254,243,199,0.15) 0%, transparent 50%)' }} />
      </div>

      {/* Header - Premium Game HUD */}
      <header className="sticky top-0 z-50 border-b" style={{
        background: 'linear-gradient(180deg, rgba(26,24,21,0.97) 0%, rgba(36,32,28,0.95) 100%)',
        backdropFilter: 'blur(24px)',
        borderColor: 'rgba(196,166,97,0.2)',
        boxShadow: '0 2px 24px rgba(0,0,0,0.2), inset 0 -1px 0 rgba(196,166,97,0.1)',
      }}>
        <div className="max-w-7xl mx-auto px-5 py-2 flex items-center justify-between">
          {/* Left: Logo + Back */}
          <div className="flex items-center gap-3">
            {!isHome && (
              <motion.button initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate('/')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] font-medium text-gray-400 hover:text-amber-300 transition-all"
                style={{ background: 'rgba(196,166,97,0.08)', border: '1px solid rgba(196,166,97,0.1)' }}>
                <span className="text-[10px]">←</span> HQ
              </motion.button>
            )}
            <h1 className="text-[17px] font-black cursor-pointer tracking-tight flex items-center gap-2" onClick={() => navigate('/')}>
              <GoldIcon />
              <span className="bg-gradient-to-r from-[#f0d875] via-[#C4A661] to-[#a88b3c] bg-clip-text text-transparent">D.CURVIN</span>
              <span className="text-[8px] font-bold text-gray-500 tracking-[0.25em] ml-0.5 hidden sm:inline">CEO RPG</span>
            </h1>
          </div>

          {/* Right: Game HUD */}
          <div className="flex items-center gap-2">
            {/* Title badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg" style={{
              background: 'linear-gradient(135deg, rgba(196,166,97,0.12) 0%, rgba(196,166,97,0.05) 100%)',
              border: '1px solid rgba(196,166,97,0.2)',
            }}>
              <DiamondIcon />
              <span className="text-[10px] font-bold text-amber-300/80">{title}</span>
            </div>

            {/* Level + EXP bar - Metal Frame */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl relative overflow-hidden" style={{
              background: 'linear-gradient(180deg, #2a2520 0%, #1a1815 50%, #0f0e0c 100%)',
              border: '1px solid rgba(196,166,97,0.35)',
              boxShadow: '0 2px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.3)',
            }}>
              {/* Metal corner accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l rounded-tl-xl" style={{ borderColor: 'rgba(196,166,97,0.4)' }} />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r rounded-tr-xl" style={{ borderColor: 'rgba(196,166,97,0.4)' }} />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l rounded-bl-xl" style={{ borderColor: 'rgba(196,166,97,0.4)' }} />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r rounded-br-xl" style={{ borderColor: 'rgba(196,166,97,0.4)' }} />

              {/* Level badge */}
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center relative" style={{
                  background: 'linear-gradient(135deg, #f0d875 0%, #C4A661 50%, #8b7535 100%)',
                  boxShadow: '0 1px 6px rgba(196,166,97,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
                }}>
                  <span className="text-[9px] font-black text-amber-900">👑</span>
                </div>
                <span className="text-[13px] font-black bg-gradient-to-b from-amber-300 to-amber-500 bg-clip-text text-transparent">Lv.{level}</span>
              </div>

              {/* EXP Bar - Metal frame with inner glow */}
              <div className="w-20 sm:w-32 relative">
                {/* Metal frame */}
                <div className="h-4 rounded-full overflow-hidden relative" style={{
                  background: 'linear-gradient(180deg, #0a0908 0%, #1a1815 50%, #0a0908 100%)',
                  border: '1px solid rgba(196,166,97,0.25)',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)',
                }}>
                  <motion.div
                    className="h-full rounded-full relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(180deg, #f0d875 0%, #e8c84a 25%, #C4A661 50%, #a88b3c 75%, #8b7535 100%)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 0 8px rgba(196,166,97,0.4)',
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${expPct}%` }}
                    transition={{ type: 'spring', damping: 20 }}
                  >
                    {/* Shine sweep */}
                    <div className="absolute inset-0">
                      <div className="absolute top-0 left-0 right-0 h-[35%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.45) 0%, transparent 100%)' }} />
                    </div>
                    {/* Shimmer animation */}
                    <div className="absolute inset-0 animate-shimmer" style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
                      backgroundSize: '200% 100%',
                    }} />
                  </motion.div>
                </div>
                <p className="absolute inset-0 flex items-center justify-center text-[8px] font-black tracking-wider"
                  style={{ color: 'rgba(255,255,255,0.7)', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>{exp}/{maxExp}</p>
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
