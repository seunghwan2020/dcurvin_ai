import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import CSSAvatar from '../components/CSSAvatar'
import KpiCard from '../components/KpiCard'
import DailyQuests from '../components/DailyQuests'
import { characters } from '../data/mockData'
import { useGame } from '../context/GameContext'

const teamPositions = [
  { id: 'yujin', path: '/management', x: '12%', y: '22%' },
  { id: 'taehyun', path: '/logistics', x: '72%', y: '18%' },
  { id: 'seoyeon', path: '/cs', x: '18%', y: '60%' },
  { id: 'minjun', path: '/data', x: '68%', y: '58%' },
  { id: 'haeun', path: '/secretary', x: '42%', y: '38%' },
]

function OfficeFurniture() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Floor grid (isometric feel) */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(30deg, #000 1px, transparent 1px), linear-gradient(150deg, #000 1px, transparent 1px)`,
        backgroundSize: '60px 35px',
      }} />

      {/* CEO Desk (center-bottom) */}
      <div className="absolute" style={{ bottom: '8%', left: '50%', transform: 'translateX(-50%)' }}>
        <div className="relative">
          {/* Desk surface */}
          <div className="w-28 h-12 rounded-xl shadow-lg" style={{
            background: 'linear-gradient(135deg, #8B6914 0%, #C4A661 50%, #a68b3c 100%)',
            transform: 'perspective(200px) rotateX(10deg)',
          }} />
          {/* Monitor */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2">
            <div className="w-14 h-10 bg-gray-800 rounded-t-lg border-2 border-gray-700 flex items-center justify-center">
              <div className="w-11 h-7 rounded-sm" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d3748 100%)' }}>
                <div className="w-full h-full opacity-40 flex items-center justify-center">
                  <div className="w-8 h-1 bg-green-400/50 rounded mb-1" />
                </div>
              </div>
            </div>
            <div className="w-4 h-2 bg-gray-700 mx-auto" />
            <div className="w-8 h-1 bg-gray-600 mx-auto rounded" />
          </div>
        </div>
      </div>

      {/* Plant */}
      <div className="absolute bottom-[12%] right-[8%]">
        <div className="relative">
          <div className="w-6 h-8 bg-amber-700 rounded-b-lg mx-auto" style={{ background: 'linear-gradient(180deg, #92400e, #78350f)' }} />
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
            <div className="w-3 h-8 bg-green-600 rounded-full transform -rotate-12 absolute -left-2" />
            <div className="w-3 h-9 bg-green-500 rounded-full absolute" />
            <div className="w-3 h-7 bg-green-600 rounded-full transform rotate-15 absolute left-2" />
          </div>
        </div>
      </div>

      {/* Window (top-left) */}
      <div className="absolute top-[6%] left-[4%]">
        <div className="w-20 h-28 rounded-xl border-2 border-blue-100/30 overflow-hidden" style={{
          background: 'linear-gradient(180deg, #dbeafe 0%, #bfdbfe 40%, #93c5fd 100%)',
        }}>
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/30" />
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/30" />
          {/* Curtain */}
          <div className="absolute top-0 left-0 w-4 h-full" style={{ background: 'linear-gradient(90deg, rgba(248,245,240,0.6), transparent)' }} />
          <div className="absolute top-0 right-0 w-4 h-full" style={{ background: 'linear-gradient(-90deg, rgba(248,245,240,0.6), transparent)' }} />
        </div>
      </div>

      {/* Bookshelf (top-right) */}
      <div className="absolute top-[6%] right-[6%]">
        <div className="w-16 h-24 rounded-lg" style={{
          background: 'linear-gradient(135deg, #92400e 0%, #78350f 100%)',
          boxShadow: 'inset -2px -2px 6px rgba(0,0,0,0.2)',
        }}>
          {[0, 1, 2].map(i => (
            <div key={i} className="flex gap-0.5 px-1 pt-1.5" style={{ marginTop: i > 0 ? '2px' : 0 }}>
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex-1 h-5 rounded-[1px]" style={{
                  background: ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#C4A661'][(i * 4 + j) % 6] + '80',
                }} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Light rays */}
      <div className="absolute top-0 left-[8%] w-24 h-full opacity-[0.02] pointer-events-none" style={{
        background: 'linear-gradient(135deg, #fef3c7, transparent 60%)',
      }} />
    </div>
  )
}

export default function OfficeMap() {
  const navigate = useNavigate()
  const { level, title, decisions } = useGame()
  const [hovered, setHovered] = useState(null)

  return (
    <div className="space-y-5">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h2 className="text-[22px] font-bold text-gray-800 tracking-tight">
          좋은 아침이에요, <span style={{ color: '#C4A661' }}>대표님</span>!
        </h2>
        <p className="text-[13px] text-gray-400 mt-0.5">각 팀 캐릭터를 클릭하면 보고를 받을 수 있어요.</p>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="오늘 매출" value={4280000} prefix="₩" change={8.4} icon="💰" delay={0.05} />
        <KpiCard label="총 주문" value={342} suffix="건" change={5.2} icon="📦" delay={0.1} />
        <KpiCard label="미답변 CS" value={8} suffix="건" change={-12.5} icon="💬" delay={0.15} />
        <KpiCard label="재고 부족" value={5} suffix="종" change={-20} icon="⚠️" delay={0.2} />
      </div>

      {/* Office Map */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25 }}
        className="relative bg-gradient-to-br from-[#faf8f4] via-white to-[#f5f3ef] rounded-3xl border border-white/60 shadow-[0_4px_30px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.02)] overflow-hidden"
        style={{ minHeight: '480px' }}
      >
        <OfficeFurniture />

        {/* Ambient particles */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div key={i} className="absolute w-1 h-1 rounded-full" style={{
            background: '#C4A661', left: `${20 + i * 15}%`, top: `${25 + (i % 3) * 25}%`,
          }}
            animate={{ opacity: [0, 0.4, 0], y: [-5, 5, -5] }}
            transition={{ repeat: Infinity, duration: 4 + i, delay: i * 0.7 }}
          />
        ))}

        {/* Office title */}
        <div className="relative z-10 text-center pt-4">
          <span className="text-[10px] font-semibold text-gray-300 tracking-[0.25em] uppercase">D.CURVIN OFFICE</span>
        </div>

        {/* Team characters */}
        {teamPositions.map((pos, i) => {
          const char = characters[pos.id]
          return (
            <motion.div key={pos.id}
              className="absolute z-20"
              style={{ left: pos.x, top: pos.y }}
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1, type: 'spring', damping: 14 }}
            >
              <div className="flex flex-col items-center"
                onMouseEnter={() => setHovered(pos.id)}
                onMouseLeave={() => setHovered(null)}>
                {/* Hover tooltip */}
                <AnimatePresence>
                  {hovered === pos.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl rounded-xl px-3 py-1.5 shadow-lg border border-white/50 whitespace-nowrap z-30"
                    >
                      <p className="text-[11px] text-gray-600 font-medium">"{char.team} 보고 준비 완료!"</p>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/90 rotate-45 border-r border-b border-white/50" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2.5 + i * 0.3, ease: 'easeInOut' }}>
                  <CSSAvatar characterId={pos.id} size="sm" expression="happy" onClick={() => navigate(pos.path)} />
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.1 }}
                  className="mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold text-white shadow-sm"
                  style={{ backgroundColor: char.color }}>
                  {char.team}
                </motion.div>
              </div>
            </motion.div>
          )
        })}

        {/* CEO desk label */}
        <motion.div className="absolute z-10" style={{ bottom: '3%', left: '50%', transform: 'translateX(-50%)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          <div className="text-center">
            <span className="text-[10px] font-bold tracking-wide" style={{ color: '#C4A661' }}>👑 Lv.{level} {title}</span>
          </div>
        </motion.div>

        {/* Global Logistics button */}
        <motion.div className="absolute z-20 bottom-4 right-4"
          initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2, type: 'spring' }}>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 4px 20px rgba(196,166,97,0.2)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/global-logistics')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-xl rounded-2xl border border-amber-200/50 shadow-sm text-[12px] font-semibold"
            style={{ color: '#C4A661' }}>
            🌏 글로벌 물류센터
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <DailyQuests />

        {/* Decision history */}
        {decisions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="bg-white/70 backdrop-blur-2xl rounded-2xl border border-white/60 shadow-[0_2px_20px_rgba(0,0,0,0.04)] p-5">
            <h3 className="text-[13px] font-semibold text-gray-800 mb-3">📜 최근 의사결정</h3>
            <div className="space-y-1.5">
              {decisions.slice(-5).reverse().map((d, i) => (
                <div key={i} className="flex items-center justify-between text-[12px] py-1.5 border-b border-gray-50 last:border-0">
                  <span className="text-gray-500">{d.text}</span>
                  <span className="font-bold" style={{ color: '#C4A661' }}>+{d.exp}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
