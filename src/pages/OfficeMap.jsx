import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import SVGAvatar from '../components/SVGAvatar'
import KpiCard from '../components/KpiCard'
import DailyQuests from '../components/DailyQuests'
import Card from '../components/Card'
import CountUp from '../components/CountUp'
import { characters, exchangeRateData, recentDailySales, inventoryGauge, competitorWeeklyData, competitorInsight } from '../data/mockData'
import { useGame } from '../context/GameContext'

const teamCards = [
  { id: 'yujin', path: '/management', preview: '이번 달 매출 1.18억 · 전월비 +12.8%' },
  { id: 'taehyun', path: '/logistics', preview: '긴급 입고 2건 · OEM 발주 대기' },
  { id: 'seoyeon', path: '/cs', preview: '미답변 8건 · 만족도 4.5점' },
  { id: 'minjun', path: '/data', preview: 'ConnectBag 성장률 22.8% · 번들 제안' },
  { id: 'haeun', path: '/secretary', preview: '핵심 의사결정 2건 · 미확인 메일 2건' },
]

function TitleBadge({ title, color }) {
  return (
    <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-semibold text-white"
      style={{ background: color }}>
      {title}
    </span>
  )
}

/* 위안화 환율 위젯 */
function ExchangeWidget() {
  const { label, current, previous, change, direction, weekly } = exchangeRateData
  return (
    <Card title={label} icon="💱" delay={0.25}>
      <div className="flex items-end justify-between mb-2">
        <div>
          <p className="text-2xl font-semibold tabular-nums" style={{ color: '#2A3B32' }}>₩<CountUp end={current} decimals={1} /></p>
          <p className="text-[12px] font-medium" style={{ color: direction === 'up' ? '#C45C5C' : '#4A6355' }}>
            {direction === 'up' ? '▲' : '▼'} {change}% <span style={{ color: '#7A9B88' }}>전일 ₩{previous}</span>
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={50}>
        <LineChart data={weekly}>
          <Line type="monotone" dataKey="rate" stroke={direction === 'up' ? '#C45C5C' : '#4A6355'} strokeWidth={2} dot={false} />
          <Tooltip formatter={v => `₩${v}`} contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #C6D5CC' }} />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex justify-between text-[10px] mt-1" style={{ color: '#7A9B88' }}>
        {weekly.map(d => <span key={d.date}>{d.date}</span>)}
      </div>
    </Card>
  )
}

/* 매출 미니차트 (7일) */
function SalesMiniChart() {
  return (
    <Card title="최근 7일 매출" icon="📊" delay={0.3}>
      <ResponsiveContainer width="100%" height={80}>
        <BarChart data={recentDailySales} barCategoryGap={3}>
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#7A9B88' }} axisLine={false} tickLine={false} />
          <Tooltip formatter={v => `₩${v.toLocaleString()}`} contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #C6D5CC' }} />
          <Bar dataKey="sales" radius={[3, 3, 0, 0]}>
            {recentDailySales.map((entry, i) => (
              <Cell key={i} fill={entry.isToday ? '#2A3B32' : '#C6D5CC'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px]" style={{ color: '#C6D5CC' }}>7일 전</span>
        <span className="text-[11px] font-semibold tabular-nums" style={{ color: '#2A3B32' }}>오늘: ₩{recentDailySales[recentDailySales.length - 1].sales.toLocaleString()}</span>
      </div>
    </Card>
  )
}

/* N배송 품절 예상 */
function InventoryWidget() {
  const { dangerItems, alertText, dangerList } = inventoryGauge
  return (
    <Card title="N배송 품절 예상" icon="📦" delay={0.35}>
      <div className="flex items-center gap-3 mb-3">
        <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
          className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
          style={{ background: 'rgba(196,92,92,0.08)', color: '#C45C5C' }}>
          위험 {dangerItems}개
        </motion.span>
        <p className="text-[12px]" style={{ color: '#4A6355' }}>{alertText}</p>
      </div>
      <div className="space-y-1.5">
        {dangerList.map((item, i) => (
          <div key={i} className="flex items-center justify-between py-1 text-[12px]">
            <span style={{ color: '#4A6355' }}>{item.name}</span>
            <span className="font-semibold tabular-nums" style={{ color: '#C45C5C' }}>{item.daysLeft}일</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

/* 시장 동향 — 경쟁사 비교 */
function CompetitorChart({ onClick }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
      onClick={onClick}
      className="bg-white/80 backdrop-blur-xl rounded-2xl border p-5 cursor-pointer hover:shadow-md transition-all"
      style={{ borderColor: 'rgba(198,213,204,0.5)', boxShadow: '0 1px 12px rgba(42,59,50,0.04)' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[14px] font-semibold" style={{ color: '#2A3B32' }}>📈 시장 동향 — 주간 매출 비교</h3>
        <span className="text-[11px]" style={{ color: '#7A9B88' }}>상세 보기 →</span>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={competitorWeeklyData}>
          <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#7A9B88' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#7A9B88' }} tickFormatter={v => `${(v/1e6).toFixed(0)}M`} axisLine={false} tickLine={false} />
          <Tooltip formatter={v => `₩${v.toLocaleString()}`} contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #C6D5CC' }} />
          <Line type="monotone" dataKey="dcurvin" name="D.CURVIN" stroke="#2A3B32" strokeWidth={2.5} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="compA" name="경쟁사 A" stroke="#7A9B88" strokeWidth={1.5} dot={{ r: 2 }} strokeDasharray="4 2" />
          <Line type="monotone" dataKey="compB" name="경쟁사 B" stroke="#C6D5CC" strokeWidth={1.5} dot={{ r: 2 }} strokeDasharray="4 2" />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-[12px] mt-2" style={{ color: '#4A6355' }}>{competitorInsight}</p>
    </motion.div>
  )
}

export default function OfficeMap() {
  const navigate = useNavigate()
  const { decisions } = useGame()

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-2">
        <h2 className="text-[26px] font-semibold tracking-[-0.02em]" style={{ color: '#2A3B32' }}>
          좋은 아침이에요, <span style={{ color: '#8EBAA4' }}>대표님</span>
        </h2>
        <p className="text-[13px] mt-1" style={{ color: '#7A9B88' }}>각 팀 카드를 클릭하면 보고를 받을 수 있어요.</p>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="오늘 매출" value={4280000} prefix="₩" change={8.4} icon="💰" delay={0.05} />
        <KpiCard label="총 주문" value={342} suffix="건" change={5.2} icon="📦" delay={0.1} />
        <KpiCard label="미답변 CS" value={8} suffix="건" change={-12.5} icon="💬" delay={0.15} />
        <KpiCard label="재고 부족" value={5} suffix="종" change={-20} icon="⚠️" delay={0.2} />
      </div>

      {/* Dashboard Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ExchangeWidget />
        <SalesMiniChart />
        <InventoryWidget />
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamCards.map((tc, i) => {
          const char = characters[tc.id]
          return (
            <motion.div key={tc.id}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.25 + i * 0.08, type: 'spring', damping: 18 }}>
              <motion.button
                onClick={() => navigate(tc.path)}
                whileHover={{ y: -4, boxShadow: '0 8px 28px rgba(42,59,50,0.08)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group sage-border-glow ripple-container"
                style={{
                  background: 'rgba(255,255,255,0.8)',
                  borderColor: 'rgba(198,213,204,0.5)',
                  boxShadow: '0 1px 8px rgba(42,59,50,0.03)',
                }}>
                <div className="absolute top-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg, transparent, ${char.color}, transparent)` }} />
                <div className="flex items-center gap-4">
                  <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 3 + i * 0.4, ease: 'easeInOut' }}>
                    <SVGAvatar characterId={tc.id} size={80} expression="happy" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-medium tracking-wider uppercase" style={{ color: '#7A9B88' }}>{char.team}</p>
                    <p className="text-[14px] font-semibold mt-0.5" style={{ color: '#2A3B32' }}>
                      {char.name}
                      <TitleBadge title={char.title} color={char.color} />
                    </p>
                    <p className="text-[12px] mt-1 leading-relaxed" style={{ color: '#7A9B88' }}>{tc.preview}</p>
                  </div>
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0 translate-x-[-4px]">
                  <span className="text-[14px]" style={{ color: char.color }}>→</span>
                </div>
              </motion.button>
            </motion.div>
          )
        })}

        {/* Global Logistics Card */}
        <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.65, type: 'spring', damping: 18 }}>
          <motion.button
            onClick={() => navigate('/global-logistics')}
            whileHover={{ y: -4, boxShadow: '0 8px 28px rgba(42,59,50,0.08)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group sage-border-glow ripple-container"
            style={{
              background: 'linear-gradient(135deg, rgba(42,59,50,0.04) 0%, rgba(255,255,255,0.8) 100%)',
              borderColor: 'rgba(198,213,204,0.5)',
              boxShadow: '0 1px 8px rgba(42,59,50,0.03)',
            }}>
            <div className="absolute top-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'linear-gradient(90deg, transparent, #2A3B32, transparent)' }} />
            <div className="flex items-center gap-4">
              <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}>
                <SVGAvatar characterId="hanwei" size={80} expression="happy" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium tracking-wider uppercase" style={{ color: '#7A9B88' }}>GLOBAL LOGISTICS</p>
                <p className="text-[14px] font-semibold mt-0.5" style={{ color: '#2A3B32' }}>
                  한웨이 매니저
                  <TitleBadge title="매니저" color="#2A3B32" />
                </p>
                <p className="text-[12px] mt-1" style={{ color: '#7A9B88' }}>발주/수입 현황 · 파이프라인 관리</p>
              </div>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0 translate-x-[-4px]">
              <span className="text-[14px]" style={{ color: '#2A3B32' }}>→</span>
            </div>
          </motion.button>
        </motion.div>
      </div>

      {/* Competitor Chart + Bottom row */}
      <CompetitorChart onClick={() => navigate('/management')} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <DailyQuests />
        {decisions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="rounded-2xl border p-5" style={{
              background: 'rgba(255,255,255,0.7)', borderColor: 'rgba(198,213,204,0.5)',
              boxShadow: '0 1px 12px rgba(42,59,50,0.04)',
            }}>
            <h3 className="text-[14px] font-semibold mb-3 flex items-center gap-2" style={{ color: '#2A3B32' }}>📜 최근 의사결정</h3>
            <div className="space-y-1.5">
              {decisions.slice(-5).reverse().map((d, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.05 }}
                  className="flex items-center justify-between text-[13px] py-1.5" style={{ borderBottom: '1px solid rgba(198,213,204,0.3)' }}>
                  <span style={{ color: '#4A6355' }}>{d.text}</span>
                  <span className="font-semibold tabular-nums" style={{ color: '#8EBAA4' }}>+{d.exp}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
