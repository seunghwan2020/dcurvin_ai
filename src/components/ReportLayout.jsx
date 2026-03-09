import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SVGAvatar from './SVGAvatar'
import DialogBox from './DialogBox'
import { useGame } from '../context/GameContext'

export default function ReportLayout({ characterId, characterName, characterColor, messages, questId, children }) {
  const [dialogDone, setDialogDone] = useState(false)
  const [entryDone, setEntryDone] = useState(false)
  const { completeQuest, visitTeam } = useGame()

  useEffect(() => { visitTeam(characterId) }, [characterId, visitTeam])
  useEffect(() => { const t = setTimeout(() => setEntryDone(true), 1800); return () => clearTimeout(t) }, [])

  const handleDialogComplete = () => {
    setDialogDone(true)
    if (questId) completeQuest(questId)
  }

  return (
    <div className="space-y-6">
      {/* Team entry loading screen */}
      <AnimatePresence>
        {!entryDone && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
            style={{ background: 'linear-gradient(180deg, #1a1815 0%, #0f0e0c 100%)' }}
          >
            {/* Radial glow behind character */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute w-[300px] h-[300px] rounded-full"
              style={{ background: `radial-gradient(circle, ${characterColor}30 0%, transparent 70%)` }}
            />

            {/* Character zoom-in */}
            <motion.div
              initial={{ scale: 0.3, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 12, delay: 0.2 }}
            >
              <SVGAvatar characterId={characterId} size={180} expression="happy" />
            </motion.div>

            {/* Name title animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-4 text-center"
            >
              <motion.p
                initial={{ letterSpacing: '0.5em', opacity: 0 }}
                animate={{ letterSpacing: '0.2em', opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="text-[10px] font-bold tracking-[0.2em] uppercase"
                style={{ color: characterColor }}
              >
                REPORT
              </motion.p>
              <motion.p
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1, type: 'spring' }}
                className="text-xl font-black mt-1 text-white"
              >
                {characterName}
              </motion.p>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              className="w-40 h-1 rounded-full mt-6 overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.4, delay: 0.3, ease: 'easeInOut' }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${characterColor}, #f0d875)` }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with character */}
      <div className="flex flex-col md:flex-row gap-5">
        {/* Left: Character */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: entryDone ? 0 : 1.8 }}
          className="flex-shrink-0 flex flex-col items-center"
        >
          <SVGAvatar characterId={characterId} size={140} expression={dialogDone ? 'happy' : 'neutral'} />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-1 px-4 py-1.5 rounded-full text-[11px] font-bold text-white shadow-sm"
            style={{
              background: `linear-gradient(135deg, ${characterColor}, ${characterColor}cc)`,
              boxShadow: `0 2px 12px ${characterColor}40`,
            }}
          >
            {characterName}
          </motion.div>
        </motion.div>

        {/* Right: Dialog */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex-1 min-w-0"
        >
          {!dialogDone ? (
            <DialogBox
              characterName={characterName}
              characterColor={characterColor}
              messages={messages}
              onComplete={handleDialogComplete}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border p-4"
              style={{
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(24px)',
                borderColor: `${characterColor}20`,
              }}
            >
              <p className="text-[13px] text-gray-500">
                <span className="font-semibold text-gray-700">{characterName}</span>: 아래 데이터를 자유롭게 확인해주세요, 대표님!
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Dashboard content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: dialogDone ? 1 : 0.3 }}
        transition={{ duration: 0.5 }}
        className={dialogDone ? '' : 'pointer-events-none'}
      >
        {children}
      </motion.div>
    </div>
  )
}
