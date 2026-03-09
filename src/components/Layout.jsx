import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'
import LevelUpOverlay from './LevelUpOverlay'

function FloatingParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="absolute w-1 h-1 rounded-full animate-float-particle"
          style={{
            background: i % 2 === 0 ? '#8EBAA4' : '#C6D5CC',
            left: `${8 + (i * 11) % 85}%`, top: `${20 + (i * 13) % 60}%`,
            animationDelay: `${i * 1.1}s`, animationDuration: `${6 + (i % 3) * 2}s`, opacity: 0,
          }} />
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
    <div className="min-h-screen relative overflow-hidden sage-floor" style={{ background: '#EFF4F1' }}>
      <FloatingParticles />
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div animate={{ x: [0, 12, 0], y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 20, ease: 'easeInOut' }}
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #8EBAA4, transparent 55%)' }} />
        <motion.div animate={{ x: [0, -8, 0], y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 25, ease: 'easeInOut' }}
          className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #4A6355, transparent 55%)' }} />
        <div className="absolute top-0 left-[5%] w-[200px] h-full animate-light-ray pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(198,213,204,0.08) 0%, transparent 50%)' }} />
      </div>

      <header className="sticky top-0 z-50 border-b" style={{
        background: 'linear-gradient(180deg, #2A3B32 0%, #1f2d26 100%)',
        borderColor: 'rgba(142,186,164,0.15)',
        boxShadow: '0 1px 12px rgba(0,0,0,0.1)',
      }}>
        <div className="max-w-7xl mx-auto px-5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!isHome && (
              <motion.button initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate('/')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] font-medium transition-all"
                style={{ color: '#C6D5CC', background: 'rgba(142,186,164,0.08)', border: '1px solid rgba(142,186,164,0.12)' }}>
                <span className="text-[10px]">←</span> HQ
              </motion.button>
            )}
            <h1 className="text-[17px] font-semibold cursor-pointer tracking-[-0.02em] flex items-center gap-2" onClick={() => navigate('/')}>
              <span style={{ color: '#8EBAA4' }}>D.CURVIN</span>
              <span className="text-[9px] font-medium tracking-[0.2em] ml-0.5 hidden sm:inline" style={{ color: '#7A9B88' }}>CEO DASHBOARD</span>
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center px-3 py-1 rounded-lg"
              style={{ background: 'rgba(142,186,164,0.08)', border: '1px solid rgba(142,186,164,0.12)' }}>
              <span className="text-[11px] font-medium" style={{ color: '#C6D5CC' }}>{title}</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{
              background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(142,186,164,0.15)',
            }}>
              <span className="text-[13px] font-semibold tabular-nums" style={{ color: '#8EBAA4' }}>Lv.{level}</span>
              <div className="w-20 sm:w-28 relative">
                <div className="h-3 rounded-full overflow-hidden" style={{
                  background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(142,186,164,0.15)',
                }}>
                  <motion.div className="h-full rounded-full relative overflow-hidden"
                    style={{ background: 'linear-gradient(90deg, #8EBAA4, #4A6355)' }}
                    initial={{ width: 0 }} animate={{ width: `${expPct}%` }}
                    transition={{ type: 'spring', damping: 20 }}>
                    <div className="absolute inset-0 animate-shimmer" style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                      backgroundSize: '200% 100%',
                    }} />
                  </motion.div>
                </div>
                <p className="absolute inset-0 flex items-center justify-center text-[8px] font-medium tabular-nums"
                  style={{ color: 'rgba(255,255,255,0.55)' }}>{exp}/{maxExp}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-5 py-6">
        <motion.div key={location.pathname}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}>
          <Outlet />
        </motion.div>
      </main>
      <LevelUpOverlay />
    </div>
  )
}
