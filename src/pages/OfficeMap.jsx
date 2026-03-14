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
import { characters, recentDailySales as mockRecentSales, inventoryGauge as mockInventoryGauge, competitorWeeklyData as mockCompetitorWeekly, competitorInsight as mockCompetitorInsight, csStatusData as mockCsStatus, unansweredCS as mockUnansweredCS } from '../data/mockData'
import { useGame } from '../context/GameContext'
import { useApiData } from '../hooks/useApiData'
import { useExchangeRate } from '../hooks/useExchangeRate'
import { formatManwon, getRankBadge } from '../hooks/useRankingData'

const teamCards = [
  { id: 'yujin', path: '/management', preview: '이번 달 매출 1.18억 · 전월비 +12.8%' },
  { id: 'taehyun', path: '/logistics', preview: '긴급 입고 2건 · OEM 발주 대기' },
  { id: 'seoyeon', path: '/cs', preview: '미답변 8건 · 만족도 4.5점' },
  { id: 'minjun', path: '/data', preview: 'ConnectBag 성장률 22.8% · 번들 제안' },
  { id: 'haeun', path: '/secretary', preview: '핵심 의사결정 2건 · 미확인 메일 2건' },
]

// Sage Mineral palette for competitor lines
const COMP_COLORS = ['#2A3B32', '#6B8A5E', '#8EBAA4', '#5B7A6A', '#7A9B88', '#4A6355']

function TitleBadge({ title, color }) {
  return (
    <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-semibold text-white"
      style={{ background: color }}>
      {title}
    </span>
  )
}

/* ── 위안화 환율 위젯 — LIVE API with dual fallback ── */
function ExchangeWidget() {
  const { data, loading } = useExchangeRate()

  if (loading || !data) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border p-4"
        style={{ borderColor: 'rgba(198,213,204,0.5)' }}>
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-[#C6D5CC]/30 rounded w-28" />
          <div className="h-7 bg-[#C6D5CC]/30 rounded w-20" />
          <div className="h-3 bg-[#C6D5CC]/20 rounded w-32" />
        </div>
      </div>
    )
  }

  const { label, current, previous, change, direction, weekly, isLive, lastUpdateLabel, fetchFailed } = data
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl border p-4"
      style={{ borderColor: 'rgba(198,213,204,0.5)', boxShadow: '0 1px 12px rgba(42,59,50,0.04)' }}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-medium" style={{ color: '#7A9B88' }}>💱 {label}</span>
        {fetchFailed && <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#C45C5C]/10 text-[#C45C5C]">업데이트 실패</span>}
      </div>
      <div className="flex items-end gap-2 mb-1">
        <p className="text-xl font-semibold tabular-nums" style={{ color: '#2A3B32' }}>₩<CountUp end={current} decimals={1} /></p>
        <p className="text-[11px] font-medium pb-0.5" style={{ color: direction === 'up' ? '#C45C5C' : '#4A6355' }}>
          {direction === 'up' ? '▲' : '▼'} {change}%
        </p>
      </div>
      {weekly.length > 0 && (
        <ResponsiveContainer width="100%" height={36}>
          <LineChart data={weekly}>
            <Line type="monotone" dataKey="rate" stroke={direction === 'up' ? '#C45C5C' : '#4A6355'} strokeWidth={1.5} dot={false} />
            <Tooltip formatter={v => `₩${Number(v).toFixed(1)}`} contentStyle={{ fontSize: '11px', borderRadius: '6px', border: '1px solid #C6D5CC', padding: '4px 8px' }} />
          </LineChart>
        </ResponsiveContainer>
      )}
      <p className="text-[9px] mt-1" style={{ color: '#C6D5CC' }}>
        {lastUpdateLabel || `전일 ₩${previous}`}
      </p>
    </motion.div>
  )
}

/* ── 매출 미니차트 (7일) — mock 데이터 사용 ── */
function SalesMiniChart() {
  const recentDailySales = mockRecentSales
  return (
    <Card title="최근 7일 매출" icon="📊" delay={0.3}>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={recentDailySales} barCategoryGap={3}>
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#7A9B88' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#7A9B88' }} tickFormatter={v => `${(v / 1e6).toFixed(0)}M`} axisLine={false} tickLine={false} width={40} />
          <Tooltip formatter={v => `₩${Number(v).toLocaleString()}`} contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #C6D5CC' }} />
          <Bar dataKey="sales" radius={[3, 3, 0, 0]}>
            {recentDailySales.map((entry, i) => (
              <Cell key={i} fill={entry.isToday ? '#2A3B32' : '#C6D5CC'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px]" style={{ color: '#C6D5CC' }}>7일 전</span>
        <span className="text-[12px] font-semibold tabular-nums" style={{ color: '#2A3B32' }}>오늘: ₩{Number(recentDailySales[recentDailySales.length - 1]?.sales || 0).toLocaleString()}</span>
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
          style={{ background: dangerItems > 0 ? 'rgba(196,92,92,0.08)' : 'rgba(142,186,164,0.1)', color: dangerItems > 0 ? '#C45C5C' : '#4A6355' }}>
          {dangerItems > 0 ? `위험 ${dangerItems}개` : '안정'}
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
function RankingTable({ rankingData, loading }) {
  if (loading) {
    return <SkeletonCard title="당일 매출 순위" icon="🏆" height={200} lines={5} delay={0.55} />
  }

  if (!rankingData || !rankingData.length) {
    return null
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

/* ── 경쟁사 매출 추이 라인차트 ── */
function CompetitorChart({ competitorsRaw, compLoading, onClick }) {
  let chartData = mockCompetitorWeekly
  let insight = mockCompetitorInsight
  let brandNames = []
  let lineColors = [...COMP_COLORS]

  if (competitorsRaw && !compLoading) {
    try {
      if (Array.isArray(competitorsRaw) && competitorsRaw.length > 0) {
        const dcurvin = competitorsRaw.find(b => b.is_dcurvin)
        const others = competitorsRaw.filter(b => !b.is_dcurvin).slice(0, 4)
        const allBrands = [dcurvin, ...others].filter(Boolean)
        brandNames = allBrands.map(b => b.brand_name)

        if (dcurvin?.daily_data?.length) {
          const dayCount = Math.min(dcurvin.daily_data.length, 7)
          chartData = dcurvin.daily_data.slice(-dayCount).map((d, i) => {
            const entry = { date: d.date || `Day${i + 1}` }
            entry['brand_0'] = Number(d.est_daily_revenue || d.revenue || 0)
            others.forEach((ob, oi) => {
              const obDay = ob.daily_data?.[ob.daily_data.length - dayCount + i]
              entry[`brand_${oi + 1}`] = Number(obDay?.est_daily_revenue || obDay?.revenue || 0)
            })
            return entry
          })

          const lastDcurvin = chartData[chartData.length - 1]?.['brand_0'] || 0
          const lastComp = chartData[chartData.length - 1]?.['brand_1'] || 0
          insight = lastDcurvin > lastComp
            ? `D.CURVIN이 최근 일 매출 기준 경쟁사를 추월했습니다.`
            : `경쟁사 대비 D.CURVIN의 매출 격차를 좁혀가고 있습니다.`
        }
      }
    } catch (e) {
      console.warn('[Competitors] Chart mapping failed:', e)
    }
  }

  // Determine which brand keys exist
  const brandKeys = Object.keys(chartData[0] || {}).filter(k => k.startsWith('brand_'))
  const hasWeekKey = chartData.some(d => d.week !== undefined)
  const hasOldFormat = chartData.some(d => d.dcurvin !== undefined)
  const xKey = hasWeekKey ? 'week' : 'date'

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
      onClick={onClick}
      className="bg-white/80 backdrop-blur-xl rounded-2xl border p-5 cursor-pointer hover:shadow-md transition-all"
      style={{ borderColor: 'rgba(198,213,204,0.5)', boxShadow: '0 1px 12px rgba(42,59,50,0.04)' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[14px] font-semibold" style={{ color: '#2A3B32' }}>📈 경쟁사 매출 추이 — 최근 7일</h3>
        <span className="text-[11px]" style={{ color: '#7A9B88' }}>상세 보기 →</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#7A9B88' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#7A9B88' }} tickFormatter={v => `${(v / 1e6).toFixed(0)}M`} axisLine={false} tickLine={false} />
          <Tooltip formatter={v => `₩${Number(v).toLocaleString()}`} contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #C6D5CC' }} />
          <Legend wrapperStyle={{ fontSize: '11px' }} />
          {brandKeys.length > 0 ? (
            // New format: brand_0, brand_1, brand_2, ...
            brandKeys.map((key, idx) => (
              <Line key={key} type="monotone" dataKey={key}
                name={brandNames[idx] || (idx === 0 ? 'D.CURVIN' : `경쟁사 ${idx}`)}
                stroke={lineColors[idx % lineColors.length]}
                strokeWidth={idx === 0 ? 2.5 : 1.5}
                dot={{ r: idx === 0 ? 3 : 2 }}
                strokeDasharray={idx === 0 ? undefined : '4 2'} />
            ))
          ) : hasOldFormat ? (
            // Old mock format: dcurvin, compA, compB
            <>
              <Line type="monotone" dataKey="dcurvin" name={brandNames[0] || 'D.CURVIN'} stroke="#2A3B32" strokeWidth={2.5} dot={{ r: 3 }} />
              {chartData.some(d => d.compA !== undefined) && (
                <Line type="monotone" dataKey="compA" name={brandNames[1] || '경쟁사 A'} stroke="#6B8A5E" strokeWidth={1.5} dot={{ r: 2 }} strokeDasharray="4 2" />
              )}
              {chartData.some(d => d.compB !== undefined) && (
                <Line type="monotone" dataKey="compB" name={brandNames[2] || '경쟁사 B'} stroke="#8EBAA4" strokeWidth={1.5} dot={{ r: 2 }} strokeDasharray="4 2" />
              )}
            </>
          ) : null}
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

  // KPI values: mock 기준 일매출 ~727만원
  const mockLastDay = mockRecentSales[mockRecentSales.length - 1]
  const todaySales = mockLastDay.sales   // 7,270,000
  const todayOrders = 66
  const salesChange = 2.1
  const unansweredCount = apiData?.orders?.unansweredCount || mockUnansweredCS.length
  const dangerItemCount = apiData?.inventory?.inventoryGauge?.dangerItems || mockInventoryGauge.dangerItems

  return (
    <div className="space-y-6">
      {/* ═══ 1. CEO 인사 + KPI + 환율 ═══ */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-2">
        <h2 className="text-[26px] font-semibold tracking-[-0.02em]" style={{ color: '#2A3B32' }}>
          좋은 아침이에요, <span style={{ color: '#8EBAA4' }}>대표님</span>
        </h2>
        <p className="text-[13px] mt-1" style={{ color: '#7A9B88' }}>각 팀 카드를 클릭하면 보고를 받을 수 있어요.</p>
        <div className="flex justify-center mt-2">
          <DataStatusBadge loading={loading} error={error} fetchedAt={apiData?.fetchedAt} onRefresh={refresh} />
        </div>
      </motion.div>

      {/* KPIs + Exchange Rate — bigger numbers, wider spacing */}
      {loading && !apiData ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {[0,1,2,3,4].map(i => <SkeletonKpi key={i} delay={0.05 + i * 0.05} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <KpiCard label="오늘 매출" value={todaySales} prefix="₩" change={salesChange} icon="💰" delay={0.05} />
          <KpiCard label="총 주문" value={todayOrders} suffix="건" icon="📦" delay={0.1} />
          <KpiCard label="미답변 CS" value={unansweredCount} suffix="건" icon="💬" delay={0.15} />
          <KpiCard label="N배송 품절" value={dangerItemCount} suffix="종" icon="⚠️" delay={0.2} />
          <ExchangeWidget />
        </div>
      )}

      {/* ═══ 2. 매출 미니차트 + 경쟁사 추이 (2열) ═══ */}
      {loading && !apiData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonCard height={200} lines={1} delay={0.3} />
          <SkeletonCard height={220} lines={1} delay={0.35} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SalesMiniChart />
          <CompetitorChart competitorsRaw={apiData?.competitors} compLoading={loading} onClick={() => navigate('/management')} />
        </div>
      )}

      {/* ═══ 3. N배송 품절 예상 ═══ */}
      <InventoryWidget inventoryData={apiData?.inventory} />

      {/* ═══ 4. 팀 카드 그리드 ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* ═══ 5. 오늘의 퀘스트 (팀 카드 아래로 이동) ═══ */}
      <DailyQuests />

      {/* ═══ 6. 당일 매출 순위 (맨 하단) ═══ */}
      <RankingTable rankingData={apiData?.ranking} loading={loading && !apiData} />

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
  )
}
