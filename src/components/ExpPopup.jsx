import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../context/GameContext'

export default function LevelUpOverlay() {
  const { leveledUp, level, title, clearLevelUp } = useGame()

  useEffect(() => {
    if (leveledUp) {
      const timer = setTimeout(clearLevelUp, 3000)
      return () => clearTimeout(timer)
    }
  }, [leveledUp, clearLevelUp])

  return (
    <AnimatePresence>
      {leveledUp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
        >
          {/* Flash */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-amber-300"
          />

          {/* Particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
              }}
              animate={{
                opacity: 0,
                x: (Math.random() - 0.5) * 400,
                y: (Math.random() - 0.5) * 400,
                scale: 0,
                rotate: Math.random() * 720,
              }}
              transition={{ duration: 2, delay: Math.random() * 0.5 }}
              className="absolute text-xl"
              style={{ left: '50%', top: '50%' }}
            >
              {['✨', '⭐', '🌟', '💫'][i % 4]}
            </motion.div>
          ))}

          {/* Level up card */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: [0, 1.2, 1], rotate: [0, 5, 0] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 12 }}
            className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl p-8 shadow-2xl border-2 border-amber-300 text-center relative overflow-hidden"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              className="absolute -top-10 -right-10 text-8xl opacity-10"
            >
              👑
            </motion.div>
            <motion.p
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-amber-600 font-bold text-sm tracking-widest"
            >
              LEVEL UP!
            </motion.p>
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="text-5xl font-black text-amber-700 my-2"
            >
              Lv.{level}
            </motion.p>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-gray-600 font-medium"
            >
              {title}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
