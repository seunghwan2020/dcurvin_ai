import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../context/GameContext'

export default function LevelUpOverlay() {
  const { leveledUp, level, title, clearLevelUp } = useGame()
  useEffect(() => { if (leveledUp) { const t = setTimeout(clearLevelUp, 4000); return () => clearTimeout(t) } }, [leveledUp, clearLevelUp])

  const sparkles = Array.from({ length: 24 }).map((_, i) => {
    const angle = (i / 24) * Math.PI * 2
    const dist = 80 + Math.random() * 200
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, delay: Math.random() * 0.5 }
  })

  return (
    <AnimatePresence>
      {leveledUp && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none">
          {/* Flash */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 0.5, 0] }} transition={{ duration: 0.5 }}
            className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(142,186,164,0.4) 0%, rgba(74,99,85,0.3) 100%)' }} />
          {/* Burst */}
          <motion.div initial={{ opacity: 0, scale: 0.2 }} animate={{ opacity: [0, 0.4, 0], scale: [0.2, 2.5, 3] }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute w-[400px] h-[400px]"
            style={{ background: 'radial-gradient(circle, rgba(142,186,164,0.6) 0%, transparent 70%)' }} />
          {/* Sparkles */}
          {sparkles.map((s, i) => (
            <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full"
              style={{ left: '50%', top: '50%', background: i % 2 === 0 ? '#8EBAA4' : '#C6D5CC' }}
              initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              animate={{ opacity: 0, x: s.x, y: s.y, scale: 0 }}
              transition={{ duration: 1.5, delay: s.delay, ease: 'easeOut' }} />
          ))}
          {/* Card */}
          <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.05, 1] }} exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 12, delay: 0.2 }}
            className="rounded-3xl p-10 text-center relative overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.95)',
              boxShadow: '0 8px 60px rgba(42,59,50,0.2)',
              border: '1px solid rgba(198,213,204,0.5)',
            }}>
            <motion.p initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
              className="text-[11px] font-semibold tracking-[0.3em]" style={{ color: '#8EBAA4' }}>LEVEL UP!</motion.p>
            <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: 'spring' }}
              className="text-6xl font-semibold my-4 tabular-nums" style={{ color: '#2A3B32' }}>Lv.{level}</motion.p>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full"
              style={{ background: 'rgba(142,186,164,0.1)', border: '1px solid rgba(142,186,164,0.2)' }}>
              <span className="text-[14px] font-semibold" style={{ color: '#4A6355' }}>{title}</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
