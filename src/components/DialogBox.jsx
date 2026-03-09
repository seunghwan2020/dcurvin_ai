import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function DialogBox({ characterName, characterColor, messages, onComplete }) {
  const [idx, setIdx] = useState(0)
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(true)
  const msg = messages[idx]

  useEffect(() => {
    setText(''); setTyping(true)
    let i = 0; const t = msg.text
    const iv = setInterval(() => { i++; setText(t.slice(0, i)); if (i >= t.length) { clearInterval(iv); setTyping(false) } }, 22)
    return () => clearInterval(iv)
  }, [idx, msg.text])

  const handleClick = () => {
    if (typing) { setText(msg.text); setTyping(false); return }
    if (idx < messages.length - 1) setIdx(i => i + 1)
    else onComplete?.()
  }

  return (
    <motion.div initial={{ scale: 0.95, opacity: 0, y: 12 }} animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      onClick={handleClick}
      className="relative bg-white/85 backdrop-blur-xl rounded-2xl border p-5 cursor-pointer select-none"
      style={{ borderColor: 'rgba(198,213,204,0.5)', boxShadow: '0 2px 16px rgba(42,59,50,0.05)' }}>
      <div className="absolute -top-2.5 left-5 px-3 py-0.5 rounded-full text-[11px] font-semibold text-white shadow-sm"
        style={{ backgroundColor: characterColor }}>{characterName}</div>
      <div className="mt-2 min-h-[48px]">
        <p className="text-[15px] leading-[1.8]" style={{ color: '#2A3B32' }}>
          {text}
          {typing && <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.5 }}
            className="inline-block w-[2px] h-[15px] ml-0.5 align-middle" style={{ background: '#4A6355' }} />}
        </p>
      </div>
      <div className="flex justify-between items-center mt-3">
        {messages.length > 1 && (
          <div className="flex gap-1">
            {messages.map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
                style={{ background: i === idx ? '#2A3B32' : i < idx ? '#7A9B88' : '#C6D5CC' }} />
            ))}
          </div>
        )}
        <AnimatePresence>
          {!typing && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] ml-auto" style={{ color: '#7A9B88' }}>
              {idx < messages.length - 1 ? '클릭하여 계속 ▸' : '클릭하여 닫기'}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
