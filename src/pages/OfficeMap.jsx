import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { characters, kpiSummary } from '../data/mockData'
import { useGame } from '../context/GameContext'
import CharacterSprite from '../components/CharacterSprite'
import KpiCard from '../components/KpiCard'

const teams = [
  { id: 'yujin', path: '/management', position: { top: '18%', left: '15%' } },
  { id: 'taehyun', path: '/logistics', position: { top: '18%', right: '15%' } },
  { id: 'seoyeon', path: '/cs', position: { top: '55%', left: '15%' } },
  { id: 'minjun', path: '/data', position: { top: '55%', right: '15%' } },
  { id: 'haeun', path: '/secretary', position: { top: '36%', left: '50%', transform: 'translateX(-50%)' } },
]

export default function OfficeMap() {
  const navigate = useNavigate()
  const { level, title, decisions } = useGame()

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-gray-800">
          좋은 아침이에요, <span style={{ color: '#C4A661' }}>대표님</span>! 👋
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          오늘도 현명한 의사결정을 내려주세요. 각 팀을 클릭하면 보고를 받을 수 있어요.
        </p>
      </motion.div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="오늘 매출" value={4280000} prefix="₩" change={8.4} icon="💰" delay={0.1} />
        <KpiCard label="총 주문" value={342} suffix="건" change={5.2} icon="📦" delay={0.15} />
        <KpiCard label="미답변 CS" value={8} suffix="건" change={-12.5} icon="💬" delay={0.2} />
        <KpiCard label="재고 부족" value={5} suffix="종" change={-20} icon="⚠️" delay={0.25} />
      </div>

      {/* Office Map */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="relative bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-xl rounded-3xl border border-white/60 shadow-lg overflow-hidden"
        style={{ minHeight: '420px' }}
      >
        {/* Grid lines for office feel */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Title */}
        <div className="relative z-10 text-center pt-4">
          <span className="text-xs font-medium text-gray-400 tracking-widest uppercase">D.CURVIN Office</span>
        </div>

        {/* Decorative particles */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              background: 'rgba(196, 166, 97, 0.3)',
              left: `${15 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{ repeat: Infinity, duration: 3 + i, delay: i * 0.5 }}
          />
        ))}

        {/* Team characters */}
        {teams.map((team, i) => {
          const char = characters[team.id]
          return (
            <motion.div
              key={team.id}
              className="absolute z-10"
              style={team.position}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1, type: 'spring', damping: 12 }}
            >
              <div className="flex flex-col items-center">
                <CharacterSprite
                  characterId={team.id}
                  size="md"
                  name={char.name}
                  onClick={() => navigate(team.path)}
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-white shadow-sm"
                  style={{ backgroundColor: char.color }}
                >
                  {char.team}
                </motion.div>
              </div>
            </motion.div>
          )
        })}

        {/* Center CEO desk */}
        <motion.div
          className="absolute z-10"
          style={{ bottom: '8%', left: '50%', transform: 'translateX(-50%)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center shadow-lg border-2 border-amber-300/50"
            >
              <span className="text-2xl">👑</span>
            </motion.div>
            <span className="text-xs font-bold text-amber-700 mt-1">Lv.{level} {title}</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Decision history */}
      {decisions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm p-5"
        >
          <h3 className="text-sm font-semibold text-gray-800 mb-3">오늘의 의사결정 기록</h3>
          <div className="space-y-2">
            {decisions.slice(-5).reverse().map((d, i) => (
              <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
                <span className="text-gray-600">{d.text}</span>
                <span className="text-amber-500 font-bold text-xs">+{d.exp} EXP</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
