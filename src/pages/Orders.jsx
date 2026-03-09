import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import Card from '../components/Card'
import { csStatusData, unansweredCS, recentOrders } from '../data/mockData'

const priorityBadge = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-gray-100 text-gray-600',
}
const priorityLabel = { high: '긴급', medium: '보통', low: '낮음' }

const orderStatusBadge = {
  '결제완료': 'bg-blue-100 text-blue-700',
  '배송준비': 'bg-yellow-100 text-yellow-700',
  '배송중': 'bg-purple-100 text-purple-700',
  '배송완료': 'bg-green-100 text-green-700',
}

export default function Orders() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">주문 / CS 관리</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {/* CS Status */}
        <Card title="CS 답변 현황">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={csStatusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name} ${value}건`}
                labelLine={false}
              >
                {csStatusData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center text-sm mt-2">
            <span className="text-text-secondary">총 </span>
            <span className="font-bold">{csStatusData.reduce((a, b) => a + b.value, 0)}건</span>
          </div>
        </Card>

        {/* Unanswered CS */}
        <Card title="미답변 문의 목록" className="md:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-text-secondary">
                  <th className="pb-2 pr-3 font-medium">번호</th>
                  <th className="pb-2 pr-3 font-medium">고객</th>
                  <th className="pb-2 pr-3 font-medium">제목</th>
                  <th className="pb-2 pr-3 font-medium">분류</th>
                  <th className="pb-2 pr-3 font-medium">우선순위</th>
                  <th className="pb-2 font-medium text-right">경과</th>
                </tr>
              </thead>
              <tbody>
                {unansweredCS.map((cs) => (
                  <tr
                    key={cs.id}
                    className={`border-b border-border/50 hover:bg-gray-50 ${
                      cs.elapsedHours >= 24 ? 'bg-red-50/50' : ''
                    }`}
                  >
                    <td className="py-2 pr-3 font-mono text-xs">{cs.id}</td>
                    <td className="py-2 pr-3">{cs.customer}</td>
                    <td className="py-2 pr-3">{cs.subject}</td>
                    <td className="py-2 pr-3 text-text-secondary text-xs">{cs.category}</td>
                    <td className="py-2 pr-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${priorityBadge[cs.priority]}`}>
                        {priorityLabel[cs.priority]}
                      </span>
                    </td>
                    <td className={`py-2 text-right text-xs font-semibold ${
                      cs.elapsedHours >= 24 ? 'text-red-600' : 'text-text-secondary'
                    }`}>
                      {cs.elapsedHours}시간
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card title="최근 주문">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-text-secondary">
                <th className="pb-2 pr-3 font-medium">주문번호</th>
                <th className="pb-2 pr-3 font-medium">고객</th>
                <th className="pb-2 pr-3 font-medium">상품</th>
                <th className="pb-2 pr-3 font-medium text-right">금액</th>
                <th className="pb-2 pr-3 font-medium">상태</th>
                <th className="pb-2 font-medium">일시</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-border/50 hover:bg-gray-50">
                  <td className="py-2 pr-3 font-mono text-xs">{order.id}</td>
                  <td className="py-2 pr-3">{order.customer}</td>
                  <td className="py-2 pr-3">{order.items}</td>
                  <td className="py-2 pr-3 text-right font-semibold">
                    {order.total.toLocaleString()}원
                  </td>
                  <td className="py-2 pr-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${orderStatusBadge[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2 text-xs text-text-secondary">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
