import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, Cell,
} from 'recharts'
import Card from '../components/Card'
import { dailySalesData, colorTrendData, categorySalesData } from '../data/mockData'

export default function Sales() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">매출 분석</h2>

      {/* Daily Sales Chart */}
      <Card title="일별 매출 추이 (최근 30일)">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={dailySalesData}>
            <defs>
              <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2c5282" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2c5282" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={2} />
            <YAxis tickFormatter={(v) => `${v / 10000}만`} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => `${(v / 10000).toLocaleString()}만원`} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="sales" name="매출" stroke="#2c5282" fill="url(#salesGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Color Trend */}
        <Card title="컬러 트렌드 (이번 주)">
          <div className="space-y-3">
            {colorTrendData.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full border border-gray-300 shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm w-24 shrink-0">{item.name}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary-light transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-xs text-text-secondary w-10 text-right">{item.percentage}%</span>
                <span className="text-xs text-text-secondary w-20 text-right">
                  {(item.sales / 10000).toLocaleString()}만원
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Category Sales */}
        <Card title="카테고리별 매출">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categorySalesData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={(v) => `${v / 10000}만`} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 12 }} width={70} />
              <Tooltip formatter={(v) => `${(v / 10000).toLocaleString()}만원`} />
              <Bar dataKey="sales" name="매출" radius={[0, 4, 4, 0]}>
                {categorySalesData.map((_, i) => (
                  <Cell key={i} fill={['#1e3a5f', '#2c5282', '#3182ce', '#63b3ed', '#bee3f8'][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}
