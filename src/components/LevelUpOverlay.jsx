import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../context/GameContext'

export default function LevelUpOverlay() {
  const { leveledUp, level, title, clearLevelUp } = useGame()
  useEffect(() => { if (leveledUp) { const t = setTimeout(clearLevelUp, 3500); return () => clearTimeout(t) } }, [leveledUp, clearLevelUp])

  return (
    <AnimatePresence>
      {leveledUp && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 0.5, 0] }} transition={{ duration: 0.6 }}
            className="absolute inset-0" style={{ background: 'radial-gradient(circle, rgba(196,166,97,0.4) 0%, transparent 70%)' }} />
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div key={i}
              initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              animate={{ opacity: 0, x: (Math.random() - 0.5) * 500, y: (Math.random() - 0.5) * 500, scale: 0, rotate: Math.random() * 720 }}
              transition={{ duration: 2, delay: Math.random() * 0.5 }}
              className="absolute text-sm"
              style={{ left: '50%', top: '50%', color: '#C4A661' }}>
              {['✦', '★', '◆', '●'][i % 4]}
            </motion.div>
          ))}
          <motion.div initial={{ scale: 0, rotate: -10 }} animate={{ scale: [0, 1.15, 1], rotate: [0, 3, 0] }}
            exit={{ scale: 0 }} transition={{ type: 'spring', damping: 14 }}
            className="bg-gradient-to-br from-amber-50/95 to-white/95 backdrop-blur-3xl rounded-3xl p-10 shadow-[0_8px_60px_rgba(196,166,97,0.3)] border border-amber-200 text-center">
            <motion.p initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
              className="text-amber-600 font-bold text-xs tracking-[0.3em]">LEVEL UP!</motion.p>
            <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}
              className="text-5xl font-black my-3" style={{ color: '#C4A661' }}>Lv.{level}</motion.p>
            <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}
              className="text-gray-500 font-medium text-sm">{title}</motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
