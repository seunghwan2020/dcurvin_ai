import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../context/GameContext'

/* Golden burst SVG star */
function GoldenStar({ size = 20, delay = 0, x = 0, y = 0, rotate = 0 }) {
  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 24 24"
      className="absolute"
      style={{ left: '50%', top: '50%' }}
      initial={{ opacity: 1, x: 0, y: 0, scale: 0, rotate: 0 }}
      animate={{ opacity: [1, 1, 0], x, y, scale: [0, 1.2, 0.3], rotate }}
      transition={{ duration: 1.8, delay, ease: 'easeOut' }}
    >
      <defs>
        <linearGradient id={`star-g-${delay}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0d875" />
          <stop offset="50%" stopColor="#C4A661" />
          <stop offset="100%" stopColor="#8b7535" />
        </linearGradient>
      </defs>
      <polygon
        points="12,0 15.1,8.5 24,9.4 17.3,15.3 19.1,24 12,19.5 4.9,24 6.7,15.3 0,9.4 8.9,8.5"
        fill={`url(#star-g-${delay})`}
      />
    </motion.svg>
  )
}

export default function LevelUpOverlay() {
  const { leveledUp, level, title, clearLevelUp } = useGame()
  useEffect(() => { if (leveledUp) { const t = setTimeout(clearLevelUp, 4000); return () => clearTimeout(t) } }, [leveledUp, clearLevelUp])

  const stars = Array.from({ length: 24 }).map((_, i) => {
    const angle = (i / 24) * Math.PI * 2
    const dist = 120 + Math.random() * 200
    return {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      size: 12 + Math.random() * 16,
      delay: Math.random() * 0.4,
      rotate: Math.random() * 720 - 360,
    }
  })

  const sparkles = Array.from({ length: 40 }).map((_, i) => {
    const angle = (i / 40) * Math.PI * 2
    const dist = 80 + Math.random() * 300
    return {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      delay: Math.random() * 0.6,
    }
  })

  return (
    <AnimatePresence>
      {leveledUp && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none">

          {/* Full screen golden flash */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(240,216,117,0.6) 0%, rgba(196,166,97,0.4) 50%, rgba(139,117,53,0.3) 100%)' }}
          />

          {/* Radial golden burst */}
          <motion.div
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: [0, 0.6, 0], scale: [0.2, 2.5, 3] }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute w-[400px] h-[400px]"
            style={{ background: 'radial-gradient(circle, rgba(240,216,117,0.8) 0%, rgba(196,166,97,0.3) 30%, transparent 70%)' }}
          />

          {/* Light rays */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div key={`ray-${i}`}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: [0, 0.4, 0], scaleY: [0, 1, 1.2] }}
              transition={{ duration: 1.5, delay: i * 0.05 }}
              className="absolute w-[3px] h-[300px] origin-bottom"
              style={{
                left: '50%',
                top: '50%',
                transform: `rotate(${i * 45}deg)`,
                background: 'linear-gradient(0deg, rgba(240,216,117,0.6) 0%, transparent 100%)',
              }}
            />
          ))}

          {/* Golden stars explosion */}
          {stars.map((s, i) => (
            <GoldenStar key={`star-${i}`} {...s} />
          ))}

          {/* Small sparkle particles */}
          {sparkles.map((s, i) => (
            <motion.div key={`sp-${i}`}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{ left: '50%', top: '50%', background: i % 2 === 0 ? '#f0d875' : '#C4A661' }}
              initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              animate={{ opacity: 0, x: s.x, y: s.y, scale: 0 }}
              transition={{ duration: 1.5, delay: s.delay, ease: 'easeOut' }}
            />
          ))}

          {/* Main card */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: [0, 1.1, 1], rotate: [0, 2, 0] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 12, delay: 0.2 }}
            className="rounded-3xl p-10 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,252,240,0.97) 0%, rgba(255,255,255,0.95) 50%, rgba(255,248,220,0.97) 100%)',
              backdropFilter: 'blur(40px)',
              boxShadow: '0 8px 60px rgba(196,166,97,0.4), 0 0 120px rgba(240,216,117,0.2), inset 0 1px 0 rgba(255,255,255,0.8)',
              border: '2px solid rgba(196,166,97,0.3)',
            }}
          >
            {/* Inner shimmer */}
            <div className="absolute inset-0 animate-shimmer rounded-3xl" style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(240,216,117,0.15) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
            }} />

            {/* Crown icon */}
            <motion.div
              initial={{ y: -30, opacity: 0, scale: 0 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', damping: 10 }}
              className="w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center relative"
              style={{
                background: 'linear-gradient(135deg, #f0d875 0%, #C4A661 50%, #8b7535 100%)',
                boxShadow: '0 4px 20px rgba(196,166,97,0.5), inset 0 1px 0 rgba(255,255,255,0.4)',
              }}
            >
              <span className="text-2xl">👑</span>
              <motion.div
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute inset-0 rounded-2xl"
                style={{ boxShadow: '0 0 20px rgba(240,216,117,0.6)' }}
              />
            </motion.div>

            <motion.p initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
              className="text-xs font-black tracking-[0.4em] relative z-10"
              style={{ color: '#C4A661', textShadow: '0 1px 2px rgba(196,166,97,0.3)' }}>
              LEVEL UP!
            </motion.p>

            <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: 'spring' }}
              className="text-6xl font-black my-4 relative z-10"
              style={{
                background: 'linear-gradient(180deg, #f0d875 0%, #C4A661 50%, #8b7535 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 2px 4px rgba(196,166,97,0.4))',
              }}>
              Lv.{level}
            </motion.p>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full relative z-10"
              style={{
                background: 'linear-gradient(135deg, rgba(196,166,97,0.15) 0%, rgba(196,166,97,0.05) 100%)',
                border: '1px solid rgba(196,166,97,0.25)',
              }}>
              <span className="text-sm font-bold" style={{ color: '#C4A661' }}>{title}</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
