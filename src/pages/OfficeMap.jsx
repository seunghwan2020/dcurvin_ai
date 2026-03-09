import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import SVGAvatar from '../components/SVGAvatar'
import KpiCard from '../components/KpiCard'
import DailyQuests from '../components/DailyQuests'
import { characters } from '../data/mockData'
import { useGame } from '../context/GameContext'

const teamCards = [
  { id: 'yujin', path: '/management', preview: '이번 달 매출 1.18억 · 전월비 +12.8%' },
  { id: 'taehyun', path: '/logistics', preview: '긴급 입고 2건 · OEM 발주 대기' },
  { id: 'seoyeon', path: '/cs', preview: '미답변 8건 · 만족도 4.5점' },
  { id: 'minjun', path: '/data', preview: 'ConnectBag 성장률 22.8% · 번들 제안' },
  { id: 'haeun', path: '/secretary', preview: '핵심 의사결정 2건 · 미확인 메일 2건' },
]

export default function OfficeMap() {
  const navigate = useNavigate()
  const { level, title, decisions } = useGame()

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-2">
        <h2 className="text-[24px] font-extrabold text-gray-800 tracking-tight">
          좋은 아침이에요, <span className="bg-gradient-to-r from-[#C4A661] to-[#d4b96e] bg-clip-text text-transparent">대표님</span>!
        </h2>
        <p className="text-[13px] text-gray-400 mt-1">각 팀 카드를 클릭하면 보고를 받을 수 있어요.</p>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="오늘 매출" value={4280000} prefix="₩" change={8.4} icon="💰" delay={0.05} />
        <KpiCard label="총 주문" value={342} suffix="건" change={5.2} icon="📦" delay={0.1} />
        <KpiCard label="미답변 CS" value={8} suffix="건" change={-12.5} icon="💬" delay={0.15} />
        <KpiCard label="재고 부족" value={5} suffix="종" change={-20} icon="⚠️" delay={0.2} />
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamCards.map((tc, i) => {
          const char = characters[tc.id]
          return (
            <motion.div key={tc.id}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.25 + i * 0.08, type: 'spring', damping: 18 }}
            >
              <motion.button
                onClick={() => navigate(tc.path)}
                whileHover={{ y: -6, boxShadow: `0 12px 40px ${char.color}18, 0 0 0 1px ${char.color}30` }}
                whileTap={{ scale: 0.97 }}
                className="w-full text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group"
                style={{
                  background: 'rgba(255,255,255,0.75)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  borderColor: `${char.color}20`,
                  boxShadow: `0 2px 16px rgba(0,0,0,0.03), 0 0 0 1px ${char.color}10`,
                }}
              >
                {/* Gold accent line top */}
                <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(90deg, transparent, ${char.color}, transparent)` }} />

                {/* Content */}
                <div className="flex items-center gap-4">
                  <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 3 + i * 0.4, ease: 'easeInOut' }}>
                    <SVGAvatar characterId={tc.id} size={80} expression="happy" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold tracking-wider uppercase opacity-60" style={{ color: char.color }}>{char.team}</p>
                    <p className="text-[14px] font-bold text-gray-800 mt-0.5">{char.name}</p>
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{tc.preview}</p>
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0 translate-x-[-4px]">
                  <span className="text-[16px]" style={{ color: char.color }}>→</span>
                </div>

                {/* Subtle bg gradient on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none"
                  style={{ background: `radial-gradient(circle at 20% 50%, ${char.color}06 0%, transparent 60%)` }} />
              </motion.button>
            </motion.div>
          )
        })}

        {/* Global Logistics Card */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.65, type: 'spring', damping: 18 }}
        >
          <motion.button
            onClick={() => navigate('/global-logistics')}
            whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(196,166,97,0.15), 0 0 0 1px rgba(196,166,97,0.3)' }}
            whileTap={{ scale: 0.97 }}
            className="w-full text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, rgba(196,166,97,0.08) 0%, rgba(255,255,255,0.8) 100%)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderColor: 'rgba(196,166,97,0.25)',
              boxShadow: '0 2px 16px rgba(0,0,0,0.03)',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(90deg, transparent, #C4A661, transparent)' }} />
            <div className="flex items-center gap-4">
              <div className="w-[80px] h-[80px] rounded-2xl flex items-center justify-center text-3xl" style={{ background: 'linear-gradient(135deg, #C4A661 0%, #d4b96e 100%)' }}>
                🌏
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold tracking-wider uppercase text-[#C4A661]">GLOBAL</p>
                <p className="text-[14px] font-bold text-gray-800 mt-0.5">글로벌 물류센터</p>
                <p className="text-[11px] text-gray-400 mt-1">발주/수입 현황 · 파이프라인 관리</p>
              </div>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0 translate-x-[-4px]">
              <span className="text-[16px] text-[#C4A661]">→</span>
            </div>
          </motion.button>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <DailyQuests />

        {/* Decision history */}
        {decisions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="rounded-2xl border p-5 relative overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(24px)',
              borderColor: 'rgba(196,166,97,0.15)',
              boxShadow: '0 2px 20px rgba(0,0,0,0.04)',
            }}>
            <h3 className="text-[13px] font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-lg flex items-center justify-center text-[10px]" style={{ background: 'linear-gradient(135deg, #C4A661, #d4b96e)', color: 'white' }}>📜</span>
              최근 의사결정
            </h3>
            <div className="space-y-1.5">
              {decisions.slice(-5).reverse().map((d, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.05 }}
                  className="flex items-center justify-between text-[12px] py-1.5 border-b border-gray-50 last:border-0">
                  <span className="text-gray-500">{d.text}</span>
                  <span className="font-bold bg-gradient-to-r from-[#C4A661] to-[#d4b96e] bg-clip-text text-transparent">+{d.exp}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
