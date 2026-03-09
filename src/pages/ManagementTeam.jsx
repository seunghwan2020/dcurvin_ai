import { useState } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import Card from '../components/Card'
import DialogBox from '../components/DialogBox'
import CharacterSprite from '../components/CharacterSprite'
import DecisionPanel from '../components/DecisionPanel'
import CountUp from '../components/CountUp'
import {
  characters, dailySalesData, weeklySalesData, monthlySalesData,
  productSalesShare, colorTrendData, colorDetailData,
  salesForecastData, competitorData, managementDecisions,
} from '../data/mockData'

const char = characters.yujin

const dialogMessages = [
  { text: '대표님, 경영지원팀 유진입니다! 오늘의 매출 현황을 보고드리겠습니다.' },
  { text: '이번 달 매출 1억 1,840만원으로, 전월 대비 12.8% 상승했어요! 봄 시즌 효과가 확실합니다.' },
  { text: '특히 밝은 컬러 라인이 강세에요. 아이보리/크림 계열이 22%로 1위를 차지했습니다.' },
  { text: '경쟁사 대비 시장 점유율은 4위지만, 성장률은 단연 1위예요! 아래 상세 데이터를 확인해주세요.' },
]

export default function ManagementTeam() {
  const [dialogDone, setDialogDone] = useState(false)
  const [activeTab, setActiveTab] = useState('daily')

  return (
    <div className="space-y-5">
      {/* Character + Dialog */}
      <div className="flex items-start gap-4">
        <CharacterSprite characterId="yujin" size="md" showName={false} />
        <div className="flex-1">
          {!dialogDone ? (
            <DialogBox character={char} messages={dialogMessages} onComplete={() => setDialogDone(true)} />
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm p-4">
              <p className="text-sm text-gray-600">
                {char.emoji} <span className="font-semibold">{char.name}</span>: 차트와 데이터를 자유롭게 확인해주세요!
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Sales Charts */}
      <Card title="📈 매출 추이" delay={0.1}>
        <div className="flex gap-2 mb-4">
          {[
            { id: 'daily', label: '일별' },
            { id: 'weekly', label: '주별' },
            { id: 'monthly', label: '월별' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[#C4A661] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={260}>
          {activeTab === 'daily' ? (
            <AreaChart data={dailySalesData}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C4A661" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C4A661" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${(v / 1_000_000).toFixed(0)}M`} />
              <Tooltip formatter={v => `₩${v.toLocaleString()}`} />
              <Area type="monotone" dataKey="sales" stroke="#C4A661" fill="url(#salesGrad)" strokeWidth={2} />
            </AreaChart>
          ) : activeTab === 'weekly' ? (
            <BarChart data={weeklySalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${(v / 1_000_000).toFixed(0)}M`} />
              <Tooltip formatter={v => `₩${v.toLocaleString()}`} />
              <Bar dataKey="sales" fill="#C4A661" radius={[6, 6, 0, 0]} />
            </BarChart>
          ) : (
            <BarChart data={monthlySalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${(v / 1_000_000).toFixed(0)}M`} />
              <Tooltip formatter={v => `₩${v.toLocaleString()}`} />
              <Bar dataKey="sales" fill="#C4A661" radius={[6, 6, 0, 0]} />
              <Bar dataKey="profit" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Product sales pie */}
        <Card title="🛍️ 제품별 매출 비중" delay={0.2}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={productSalesShare} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={45} paddingAngle={3}>
                {productSalesShare.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Color trend */}
        <Card title="🎨 컬러 트렌드 (밝은색 vs 어두운색)" delay={0.25}>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={colorTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={v => `${v}%`} />
              <Area type="monotone" dataKey="bright" name="밝은색" stackId="1" stroke="#f59e0b" fill="#fef3c7" />
              <Area type="monotone" dataKey="dark" name="어두운색" stackId="1" stroke="#475569" fill="#cbd5e1" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Color detail */}
      <Card title="🎨 컬러별 판매 상세" delay={0.3}>
        <div className="space-y-2">
          {colorDetailData.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="flex items-center gap-3"
            >
              <div className="w-6 h-6 rounded-lg border border-gray-200 shadow-inner" style={{ backgroundColor: c.hex }} />
              <span className="text-sm text-gray-700 w-24">{c.name}</span>
              <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${c.percentage}%` }}
                  transition={{ delay: 0.5 + i * 0.05, duration: 0.8 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: c.hex === '#F7FAFC' ? '#e5e7eb' : c.hex }}
                />
              </div>
              <span className="text-xs text-gray-500 w-10 text-right">{c.percentage}%</span>
              <span className="text-xs text-gray-400 w-20 text-right">₩{(c.sales / 10000).toFixed(0)}만</span>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Sales Forecast */}
      <Card title="🔮 매출 예측 (향후 30일)" delay={0.35}>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={salesForecastData}>
            <defs>
              <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${(v / 1_000_000).toFixed(0)}M`} />
            <Tooltip formatter={v => `₩${v.toLocaleString()}`} />
            <Area type="monotone" dataKey="upper" stroke="none" fill="#e0e7ff" fillOpacity={0.5} name="상한" />
            <Area type="monotone" dataKey="lower" stroke="none" fill="#ffffff" fillOpacity={1} name="하한" />
            <Line type="monotone" dataKey="predicted" stroke="#6366f1" strokeWidth={2} dot={false} name="예측" />
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-400 mt-2 text-center">* 음영 영역은 85% 신뢰구간</p>
      </Card>

      {/* Competitor comparison */}
      <Card title="🏆 경쟁사 비교" delay={0.4}>
        <div className="space-y-3">
          {competitorData.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              className={`flex items-center gap-3 p-2 rounded-xl ${c.name === 'D.CURVIN' ? 'bg-amber-50 border border-amber-200' : ''}`}
            >
              <span className="text-sm font-bold text-gray-500 w-6">#{c.rank}</span>
              <span className={`text-sm flex-1 ${c.name === 'D.CURVIN' ? 'font-bold text-amber-700' : 'text-gray-600'}`}>{c.name}</span>
              <div className="w-32 h-4 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(c.sales / 320) * 100}%` }}
                  transition={{ delay: 0.6 + i * 0.08, duration: 0.8 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: c.color }}
                />
              </div>
              <span className="text-xs text-gray-500 w-14 text-right">{c.share}%</span>
              <span className="text-xs text-gray-400 w-16 text-right">{c.sales}억</span>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Decisions */}
      {managementDecisions.map((d, i) => (
        <DecisionPanel key={d.id} decision={d} character={char} />
      ))}
    </div>
  )
}
