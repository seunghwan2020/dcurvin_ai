import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function DialogBox({ characterName, characterColor, messages, onComplete }) {
  const [idx, setIdx] = useState(0)
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(true)
  const msg = messages[idx]

  useEffect(() => {
    setText('')
    setTyping(true)
    let i = 0
    const t = msg.text
    const iv = setInterval(() => {
      i++
      setText(t.slice(0, i))
      if (i >= t.length) { clearInterval(iv); setTyping(false) }
    }, 22)
    return () => clearInterval(iv)
  }, [idx, msg.text])

  const handleClick = () => {
    if (typing) { setText(msg.text); setTyping(false); return }
    if (idx < messages.length - 1) setIdx(i => i + 1)
    else onComplete?.()
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 16 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      onClick={handleClick}
      className="relative bg-white/80 backdrop-blur-2xl rounded-2xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-5 cursor-pointer select-none"
    >
      <div className="absolute -top-2.5 left-5 px-3 py-0.5 rounded-full text-[11px] font-bold text-white shadow-md"
        style={{ backgroundColor: characterColor }}>
        {characterName}
      </div>
      <div className="mt-2 min-h-[48px]">
        <p className="text-[13px] leading-[1.7] text-gray-700">
          {text}
          {typing && <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.5 }} className="inline-block w-[2px] h-[14px] bg-gray-600 ml-0.5 align-middle" />}
        </p>
      </div>
      <div className="flex justify-between items-center mt-3">
        {messages.length > 1 && (
          <div className="flex gap-1">
            {messages.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${i === idx ? 'bg-gray-700' : i < idx ? 'bg-gray-400' : 'bg-gray-200'}`} />
            ))}
          </div>
        )}
        <AnimatePresence>
          {!typing && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] text-gray-400 ml-auto">
              {idx < messages.length - 1 ? '클릭하여 계속 ▸' : '클릭하여 닫기'}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
