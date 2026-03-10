import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, Legend } from 'recharts'
import SVGAvatar from '../components/SVGAvatar'
import KpiCard from '../components/KpiCard'
import DailyQuests from '../components/DailyQuests'
import Card from '../components/Card'
import CountUp from '../components/CountUp'
import { DataStatusBadge, SkeletonKpi } from '../components/SkeletonCard'
import SkeletonCard from '../components/SkeletonCard'
import { characters, recentDailySales as mockRecentSales, inventoryGauge as mockInventoryGauge, competitorWeeklyData as mockCompetitorWeekly, competitorInsight as mockCompetitorInsight } from '../data/mockData'
import { useGame } from '../context/GameContext'
import { useApiData } from '../hooks/useApiData'
import { useExchangeRate } from '../hooks/useExchangeRate'
import { useRankingData, useCompetitorsData, formatManwon, getRankBadge } from '../hooks/useRankingData'

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

/* ── 위안화 환율 위젯 — LIVE API ── */
function ExchangeWidget() {
  const { data, loading } = useExchangeRate()

  if (loading || !data) {
    return (
      <Card title="위안화 (CNY→KRW)" icon="💱" delay={0.25}>
        <div className="animate-pulse space-y-2">
          <div className="h-7 bg-[#C6D5CC]/30 rounded w-24" />
          <div className="h-3 bg-[#C6D5CC]/20 rounded w-32" />
          <div className="h-12 bg-[#C6D5CC]/15 rounded w-full" />
        </div>
      </Card>
    )
  }

  const { label, current, previous, change, direction, weekly, isLive } = data
  return (
    <Card title={label} icon="💱" delay={0.25}>
      <div className="flex items-end justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-semibold tabular-nums" style={{ color: '#2A3B32' }}>₩<CountUp end={current} decimals={1} /></p>
            {!isLive && <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-[#C6D5CC]/20" style={{ color: '#7A9B88' }}>추정</span>}
          </div>
          <p className="text-[12px] font-medium" style={{ color: direction === 'up' ? '#C45C5C' : '#4A6355' }}>
            {direction === 'up' ? '▲' : '▼'} {change}% <span style={{ color: '#7A9B88' }}>전일 ₩{previous}</span>
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={50}>
        <LineChart data={weekly}>
          <Line type="monotone" dataKey="rate" stroke={direction === 'up' ? '#C45C5C' : '#4A6355'} strokeWidth={2} dot={false} />
          <Tooltip formatter={v => `₩${Number(v).toFixed(1)}`} contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #C6D5CC' }} />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex justify-between text-[10px] mt-1" style={{ color: '#7A9B88' }}>
        {weekly.map(d => <span key={d.date}>{d.date}</span>)}
      </div>
    </Card>
  )
}

/* ── 매출 미니차트 (7일) ── */
function SalesMiniChart({ salesData }) {
  const recentDailySales = salesData?.recentDailySales || mockRecentSales
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

/* ── N배송 품절 예상 ── */
function InventoryWidget({ inventoryData }) {
  const gauge = inventoryData?.inventoryGauge || mockInventoryGauge
  const { dangerItems, alertText, dangerList } = gauge
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

/* ── 당일 매출 순위 테이블 ── */
function RankingTable() {
  const { data: rankingData, loading, error } = useRankingData()

  if (loading) {
    return <SkeletonCard title="당일 매출 순위" icon="🏆" height={200} lines={5} delay={0.55} />
  }

  if (error || !rankingData || !rankingData.length) {
    return null // API 실패 시 위젯 숨김
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl border p-5"
      style={{ borderColor: 'rgba(198,213,204,0.5)', boxShadow: '0 1px 12px rgba(42,59,50,0.04)' }}>
      <h3 className="text-[14px] font-semibold mb-4 flex items-center gap-2" style={{ color: '#2A3B32' }}>
        🏆 당일 매출 순위
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-gray-100">
              {['순위', '브랜드', '오늘 판매', '추정 당일 매출', '주간 판매', '추정 주간 매출', '리뷰'].map(h => (
                <th key={h} className="py-2 px-2 text-[11px] text-gray-400 font-medium text-left whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rankingData.map((item, i) => {
              const isDcurvin = item.is_dcurvin
              const badge = getRankBadge(item.rank)
              return (
                <motion.tr key={item.brand_name || i}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.03 }}
                  className={`border-b border-gray-50 transition-colors ${isDcurvin ? 'bg-[#2A3B32]/[0.04]' : 'hover:bg-gray-50/30'}`}
                  style={isDcurvin ? { borderLeft: '3px solid #2A3B32' } : {}}>
                  <td className="py-2.5 px-2 whitespace-nowrap">
                    {badge.emoji ? (
                      <span className="text-[14px]">{badge.emoji}</span>
                    ) : (
                      <span className="text-[12px] font-bold text-gray-400">#{item.rank}</span>
                    )}
                  </td>
                  <td className="py-2.5 px-2 whitespace-nowrap">
                    <span className={`text-[12px] ${isDcurvin ? 'font-bold' : 'text-gray-600'}`}
                      style={isDcurvin ? { color: '#2A3B32' } : {}}>
                      {isDcurvin && <span className="mr-1">🔥</span>}
                      {item.brand_name}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 tabular-nums text-gray-600 whitespace-nowrap">
                    {Number(item.today_sales || 0).toLocaleString()}개
                  </td>
                  <td className={`py-2.5 px-2 tabular-nums font-medium whitespace-nowrap ${isDcurvin ? 'text-[#2A3B32]' : 'text-gray-700'}`}>
                    {item.est_daily_revenue_formatted || formatManwon(item.est_daily_revenue)}
                  </td>
                  <td className="py-2.5 px-2 tabular-nums text-gray-600 whitespace-nowrap">
                    {Number(item.weekly_sales || 0).toLocaleString()}개
                  </td>
                  <td className={`py-2.5 px-2 tabular-nums font-medium whitespace-nowrap ${isDcurvin ? 'text-[#2A3B32]' : 'text-gray-700'}`}>
                    {item.est_weekly_revenue_formatted || formatManwon(item.est_weekly_revenue)}
                  </td>
                  <td className="py-2.5 px-2 tabular-nums text-gray-400 whitespace-nowrap">
                    {Number(item.total_reviews || 0).toLocaleString()}
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

/* ── 경쟁사 매출 추이 라인차트 — LIVE API with fallback ── */
function CompetitorChart({ onClick }) {
  const { data: competitorsRaw, loading: compLoading } = useCompetitorsData()

  // Transform competitors API data into chart format
  let chartData = mockCompetitorWeekly
  let insight = mockCompetitorInsight
  let brandNames = []

  if (competitorsRaw && !compLoading) {
    try {
      // Expect: array of { brand_name, daily_data: [{ date, est_daily_revenue }], is_dcurvin }
      // Or: { brands: [...], daily: [...] }
      if (Array.isArray(competitorsRaw)) {
        const dcurvin = competitorsRaw.find(b => b.is_dcurvin)
        const others = competitorsRaw.filter(b => !b.is_dcurvin).slice(0, 2)
        brandNames = [dcurvin, ...others].filter(Boolean).map(b => b.brand_name)

        // Build chart from daily_data
        if (dcurvin?.daily_data?.length) {
          chartData = dcurvin.daily_data.slice(-7).map((d, i) => {
            const entry = { date: d.date || `Day${i + 1}` }
            entry.dcurvin = Number(d.est_daily_revenue || d.revenue || 0)
            others.forEach((ob, oi) => {
              const obDay = ob.daily_data?.[i]
              entry[`comp${oi}`] = Number(obDay?.est_daily_revenue || obDay?.revenue || 0)
            })
            return entry
          })

          const lastDcurvin = chartData[chartData.length - 1]?.dcurvin || 0
          const lastComp = chartData[chartData.length - 1]?.comp0 || 0
          if (lastDcurvin > lastComp) {
            insight = `D.CURVIN이 최근 일 매출 기준 경쟁사를 추월했습니다.`
          } else {
            insight = `경쟁사 대비 D.CURVIN의 매출 격차를 좁혀가고 있습니다.`
          }
        }
      }
    } catch (e) {
      console.warn('[Competitors] Chart mapping failed:', e)
    }
  }

  // Determine data keys based on what we have
  const hasComp0 = chartData.some(d => d.comp0 !== undefined)
  const hasComp1 = chartData.some(d => d.comp1 !== undefined)
  const hasWeekKey = chartData.some(d => d.week !== undefined)
  const xKey = hasWeekKey ? 'week' : 'date'

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
      onClick={onClick}
      className="bg-white/80 backdrop-blur-xl rounded-2xl border p-5 cursor-pointer hover:shadow-md transition-all"
      style={{ borderColor: 'rgba(198,213,204,0.5)', boxShadow: '0 1px 12px rgba(42,59,50,0.04)' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[14px] font-semibold" style={{ color: '#2A3B32' }}>📈 경쟁사 매출 추이 — 최근 7일</h3>
        <span className="text-[11px]" style={{ color: '#7A9B88' }}>상세 보기 →</span>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#7A9B88' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#7A9B88' }} tickFormatter={v => `${(v / 1e6).toFixed(0)}M`} axisLine={false} tickLine={false} />
          <Tooltip formatter={v => `₩${Number(v).toLocaleString()}`} contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #C6D5CC' }} />
          <Legend wrapperStyle={{ fontSize: '11px' }} />
          <Line type="monotone" dataKey="dcurvin" name={brandNames[0] || 'D.CURVIN'} stroke="#2A3B32" strokeWidth={2.5} dot={{ r: 3 }} />
          {(hasComp0 || !hasWeekKey) && (
            <Line type="monotone" dataKey={hasComp0 ? 'comp0' : 'compA'} name={brandNames[1] || '경쟁사 A'} stroke="#7A9B88" strokeWidth={1.5} dot={{ r: 2 }} strokeDasharray="4 2" />
          )}
          {(hasComp1 || (!hasWeekKey && chartData[0]?.compB !== undefined)) && (
            <Line type="monotone" dataKey={hasComp1 ? 'comp1' : 'compB'} name={brandNames[2] || '경쟁사 B'} stroke="#C6D5CC" strokeWidth={1.5} dot={{ r: 2 }} strokeDasharray="4 2" />
          )}
        </LineChart>
      </ResponsiveContainer>
      <p className="text-[12px] mt-2" style={{ color: '#4A6355' }}>{insight}</p>
    </motion.div>
  )
}

export default function OfficeMap() {
  const navigate = useNavigate()
  const { decisions } = useGame()
  const { data: apiData, loading, error, refresh } = useApiData()

  // KPI values: API data → fallback
  const todaySales = apiData?.sales?.todaySales || 4280000
  const todayOrders = apiData?.sales?.todayOrders || 342
  const salesChange = apiData?.sales?.salesChange || 8.4
  const unansweredCount = apiData?.orders?.unansweredCount || 8
  const dangerItemCount = apiData?.inventory?.inventoryGauge?.dangerItems || 5

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-2">
        <h2 className="text-[26px] font-semibold tracking-[-0.02em]" style={{ color: '#2A3B32' }}>
          좋은 아침이에요, <span style={{ color: '#8EBAA4' }}>대표님</span>
        </h2>
        <p className="text-[13px] mt-1" style={{ color: '#7A9B88' }}>각 팀 카드를 클릭하면 보고를 받을 수 있어요.</p>
        <div className="flex justify-center mt-2">
          <DataStatusBadge loading={loading} error={error} fetchedAt={apiData?.fetchedAt} onRefresh={refresh} />
        </div>
      </motion.div>

      {/* KPIs */}
      {loading && !apiData ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[0,1,2,3].map(i => <SkeletonKpi key={i} delay={0.05 + i * 0.05} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard label="오늘 매출" value={todaySales} prefix="₩" change={salesChange} icon="💰" delay={0.05} />
          <KpiCard label="총 주문" value={todayOrders} suffix="건" change={5.2} icon="📦" delay={0.1} />
          <KpiCard label="미답변 CS" value={unansweredCount} suffix="건" change={-12.5} icon="💬" delay={0.15} />
          <KpiCard label="재고 부족" value={dangerItemCount} suffix="종" change={-20} icon="⚠️" delay={0.2} />
        </div>
      )}

      {/* Dashboard Widgets */}
      {loading && !apiData ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[0,1,2].map(i => <SkeletonCard key={i} height={80} lines={1} delay={0.25 + i * 0.05} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ExchangeWidget />
          <SalesMiniChart salesData={apiData?.sales} />
          <InventoryWidget inventoryData={apiData?.inventory} />
        </div>
      )}

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

      {/* Competitor Chart (LIVE) */}
      <CompetitorChart onClick={() => navigate('/management')} />

      {/* Daily Ranking Table (LIVE) */}
      <RankingTable />

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
