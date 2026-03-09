import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import CSSAvatar from './CSSAvatar'
import DialogBox from './DialogBox'
import { useGame } from '../context/GameContext'

export default function ReportLayout({ characterId, characterName, characterColor, messages, questId, children }) {
  const [dialogDone, setDialogDone] = useState(false)
  const { completeQuest, visitTeam } = useGame()

  useEffect(() => { visitTeam(characterId) }, [characterId, visitTeam])

  const handleDialogComplete = () => {
    setDialogDone(true)
    if (questId) completeQuest(questId)
  }

  return (
    <div className="space-y-6">
      {/* Header with character */}
      <div className="flex flex-col md:flex-row gap-5">
        {/* Left: Character */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-shrink-0 flex flex-col items-center"
        >
          <CSSAvatar characterId={characterId} size="lg" expression={dialogDone ? 'happy' : 'neutral'} />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 px-3 py-1 rounded-full text-[11px] font-bold text-white"
            style={{ backgroundColor: characterColor }}
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
              className="bg-white/70 backdrop-blur-2xl rounded-2xl border border-white/60 shadow-sm p-4"
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
