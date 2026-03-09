import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import Card from '../components/Card'
import { inventoryStatusData, skuTableData } from '../data/mockData'

const statusBadge = {
  '긴급': 'bg-red-100 text-red-700',
  '부족': 'bg-yellow-100 text-yellow-700',
  '정상': 'bg-green-100 text-green-700',
  '과잉': 'bg-blue-100 text-blue-700',
}

const trendIcon = { up: '↑', down: '↓', stable: '→' }
const trendColor = { up: 'text-green-600', down: 'text-red-600', stable: 'text-gray-500' }

export default function Inventory() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">재고 현황</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <Card title="재고 상태 분포">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={inventoryStatusData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                dataKey="value"
                label={({ name, value }) => `${name} ${value}`}
                labelLine={false}
              >
                {inventoryStatusData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 text-xs mt-2">
            <span className="font-semibold">총 {inventoryStatusData.reduce((a, b) => a + b.value, 0)} SKU</span>
          </div>
        </Card>

        {/* SKU Table */}
        <Card title="SKU별 재고 현황" className="md:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-text-secondary">
                  <th className="pb-2 pr-3 font-medium">SKU</th>
                  <th className="pb-2 pr-3 font-medium">상품명</th>
                  <th className="pb-2 pr-3 font-medium">카테고리</th>
                  <th className="pb-2 pr-3 font-medium">사이즈</th>
                  <th className="pb-2 pr-3 font-medium text-right">재고</th>
                  <th className="pb-2 pr-3 font-medium">상태</th>
                  <th className="pb-2 font-medium text-center">추세</th>
                </tr>
              </thead>
              <tbody>
                {skuTableData.map((row) => (
                  <tr key={row.sku} className="border-b border-border/50 hover:bg-gray-50">
                    <td className="py-2 pr-3 font-mono text-xs">{row.sku}</td>
                    <td className="py-2 pr-3">{row.name}</td>
                    <td className="py-2 pr-3 text-text-secondary">{row.category}</td>
                    <td className="py-2 pr-3">{row.size}</td>
                    <td className="py-2 pr-3 text-right font-semibold">{row.stock}</td>
                    <td className="py-2 pr-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge[row.status]}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className={`py-2 text-center font-bold ${trendColor[row.trend]}`}>
                      {trendIcon[row.trend]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
