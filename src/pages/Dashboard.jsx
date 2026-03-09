import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import KpiCard from '../components/KpiCard'
import Card from '../components/Card'
import { kpiData, aiInsights, weeklySalesData, weeklyStockData } from '../data/mockData'

const fmt = (v) => `${(v / 10000).toFixed(0)}만원`

const insightColors = {
  warning: 'border-l-yellow-400 bg-yellow-50',
  success: 'border-l-green-400 bg-green-50',
  info: 'border-l-blue-400 bg-blue-50',
  danger: 'border-l-red-400 bg-red-50',
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">종합 현황</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <KpiCard title="오늘 매출" value={fmt(kpiData.todaySales)} sub={`어제 ${fmt(kpiData.yesterdaySales)}`} color="blue" icon="💵" />
        <KpiCard title="주간 매출" value={fmt(kpiData.weeklySales)} color="blue" icon="📈" />
        <KpiCard title="월간 매출" value={fmt(kpiData.monthlySales)} color="purple" icon="📊" />
        <KpiCard title="총 주문" value={`${kpiData.totalOrders}건`} sub={`대기 ${kpiData.pendingOrders}건`} color="green" icon="🛒" />
        <KpiCard title="재고 부족" value={`${kpiData.lowStockSKU}건`} sub={`전체 ${kpiData.totalSKU} SKU`} color="red" icon="📦" />
        <KpiCard title="미답변 CS" value={`${kpiData.csUnanswered}건`} sub={`전체 ${kpiData.csTotal}건`} color="yellow" icon="🎧" />
      </div>

      {/* AI Insights */}
      <Card title="🤖 AI 인사이트">
        <div className="space-y-3">
          {aiInsights.map((insight) => (
            <div
              key={insight.id}
              className={`border-l-4 rounded-r-lg p-3 ${insightColors[insight.type]}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-sm">{insight.title}</p>
                  <p className="text-xs text-text-secondary mt-1">{insight.message}</p>
                </div>
                <span className="text-xs text-text-secondary whitespace-nowrap ml-4">{insight.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Mini Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card title="주간 매출 추이">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklySalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `${v / 10000}만`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `${(v / 10000).toLocaleString()}만원`} />
              <Bar dataKey="sales" name="매출" fill="#2c5282" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="주간 재고 입출고">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weeklyStockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="inbound" name="입고" stroke="#38a169" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="outbound" name="출고" stroke="#e53e3e" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}
