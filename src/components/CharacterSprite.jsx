import { motion } from 'framer-motion'

const spriteStyles = {
  yujin: { bg: 'from-indigo-100 to-indigo-200', accent: '#6366f1', icon: '📊' },
  taehyun: { bg: 'from-amber-100 to-amber-200', accent: '#f59e0b', icon: '📦' },
  seoyeon: { bg: 'from-pink-100 to-pink-200', accent: '#ec4899', icon: '💬' },
  minjun: { bg: 'from-violet-100 to-violet-200', accent: '#8b5cf6', icon: '🔮' },
  haeun: { bg: 'from-teal-100 to-teal-200', accent: '#14b8a6', icon: '📋' },
}

export default function CharacterSprite({ characterId, size = 'md', onClick, showName = true, name }) {
  const style = spriteStyles[characterId] || spriteStyles.yujin
  const sizeMap = { sm: 'w-16 h-16 text-2xl', md: 'w-24 h-24 text-4xl', lg: 'w-32 h-32 text-5xl' }

  return (
    <motion.div
      className="flex flex-col items-center gap-2 cursor-pointer"
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Floating idle animation */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
      >
        <div
          className={`${sizeMap[size]} bg-gradient-to-br ${style.bg} rounded-2xl flex items-center justify-center shadow-lg border-2 relative overflow-hidden`}
          style={{ borderColor: style.accent + '40' }}
        >
          {/* Sparkle effect */}
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ repeat: Infinity, duration: 3, delay: Math.random() * 2 }}
          >
            <div className="absolute top-1 right-2 text-xs">✨</div>
            <div className="absolute bottom-2 left-1 text-xs">✨</div>
          </motion.div>
          <span className="relative z-10">{style.icon}</span>
        </div>
      </motion.div>

      {showName && name && (
        <motion.span
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-medium text-gray-600 text-center whitespace-nowrap"
        >
          {name}
        </motion.span>
      )}
    </motion.div>
  )
}
