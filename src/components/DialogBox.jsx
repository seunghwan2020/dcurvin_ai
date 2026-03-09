import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function DialogBox({ character, messages, onComplete }) {
  const [currentMsg, setCurrentMsg] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  const msg = messages[currentMsg]

  useEffect(() => {
    setDisplayText('')
    setIsTyping(true)
    let i = 0
    const text = msg.text
    const timer = setInterval(() => {
      i++
      setDisplayText(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(timer)
        setIsTyping(false)
      }
    }, 25)
    return () => clearInterval(timer)
  }, [currentMsg, msg.text])

  const handleClick = () => {
    if (isTyping) {
      setDisplayText(msg.text)
      setIsTyping(false)
      return
    }
    if (currentMsg < messages.length - 1) {
      setCurrentMsg(prev => prev + 1)
    } else {
      onComplete?.()
    }
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 15 }}
      className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-5 cursor-pointer select-none"
      onClick={handleClick}
    >
      {/* Character name tag */}
      <div
        className="absolute -top-3 left-4 px-3 py-0.5 rounded-full text-white text-xs font-bold shadow-md"
        style={{ backgroundColor: character.color }}
      >
        {character.emoji} {character.name}
      </div>

      {/* Message text */}
      <div className="mt-2 min-h-[60px]">
        <p className="text-sm leading-relaxed text-gray-800">
          {displayText}
          {isTyping && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="inline-block w-0.5 h-4 bg-gray-800 ml-0.5 align-middle"
            />
          )}
        </p>
      </div>

      {/* Continue indicator */}
      <div className="flex justify-end mt-2">
        <AnimatePresence>
          {!isTyping && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-gray-400"
            >
              {currentMsg < messages.length - 1 ? '클릭하여 계속 ▶' : '클릭하여 닫기 ✕'}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      {messages.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-2">
          {messages.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === currentMsg ? 'bg-gray-800' : i < currentMsg ? 'bg-gray-400' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}
