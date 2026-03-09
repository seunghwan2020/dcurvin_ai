import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import Card from '../components/Card'
import DialogBox from '../components/DialogBox'
import CharacterSprite from '../components/CharacterSprite'
import DecisionPanel from '../components/DecisionPanel'
import CountUp from '../components/CountUp'
import {
  characters, productSalesData, sizeColorHeatmap, colorHeatmap,
  purchasePatterns, reviewSentiment, dataDecisions,
} from '../data/mockData'

const char = characters.minjun

const dialogMessages = [
  { text: '대표님, 데이터 분석 결과를 가져왔습니다. 흥미로운 인사이트가 있어요!' },
  { text: 'Edge V2가 여전히 1위인데, ConnectBag의 성장률이 22.8%로 가장 높아요!' },
  { text: '흥미로운 발견! Edge V2와 ConnectBag을 함께 사는 고객이 12.3%나 됩니다.' },
  { text: '리뷰 감성 분석도 했어요. 전체 긍정률 72%, 평균 별점 4.3점입니다!' },
]

export default function DataTeam() {
  const [dialogDone, setDialogDone] = useState(false)

  const sentimentData = [
    { name: '긍정', value: reviewSentiment.positive, color: '#22c55e' },
    { name: '중립', value: reviewSentiment.neutral, color: '#9ca3af' },
    { name: '부정', value: reviewSentiment.negative, color: '#ef4444' },
  ]

  return (
    <div className="space-y-5">
      {/* Character + Dialog */}
      <div className="flex items-start gap-4">
        <CharacterSprite characterId="minjun" size="md" showName={false} />
        <div className="flex-1">
          {!dialogDone ? (
            <DialogBox character={char} messages={dialogMessages} onComplete={() => setDialogDone(true)} />
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm p-4">
              <p className="text-sm text-gray-600">{char.emoji} <span className="font-semibold">{char.name}</span>: 데이터 인사이트를 확인해주세요!</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Product Sales Overview */}
      <Card title="📦 제품별 판매 현황" delay={0.1}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {productSalesData.map((p, i) => (
            <motion.div
              key={p.product}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100"
            >
              <p className="text-xs text-gray-500 font-medium">{p.product}</p>
              <p className="text-xl font-bold text-gray-800 mt-1"><CountUp end={p.thisMonth} /></p>
              <p className="text-[10px] text-gray-400">이번 달 판매</p>
              <p className={`text-xs font-bold mt-1 ${p.growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {p.growth > 0 ? '↑' : '↓'} {Math.abs(p.growth)}%
              </p>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Size Heatmap */}
      <Card title="📐 사이즈별 판매 히트맵" delay={0.15}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-2 px-2 text-xs text-gray-500">제품</th>
                {sizeColorHeatmap.sizes.map(s => (
                  <th key={s} className="py-2 px-2 text-xs text-gray-500 text-center">{s}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sizeColorHeatmap.products.map((product, pi) => (
                <tr key={product} className="border-t border-gray-50">
                  <td className="py-2 px-2 text-sm font-medium text-gray-700">{product}</td>
                  {sizeColorHeatmap.data[pi].map((val, si) => {
                    const maxVal = Math.max(...sizeColorHeatmap.data.flat())
                    const intensity = val / maxVal
                    return (
                      <td key={si} className="py-2 px-2 text-center">
                        {val > 0 ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3 + pi * 0.05 + si * 0.03 }}
                            className="mx-auto w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold"
                            style={{
                              backgroundColor: `rgba(99, 102, 241, ${0.1 + intensity * 0.7})`,
                              color: intensity > 0.5 ? 'white' : '#6366f1',
                            }}
                          >
                            {val}
                          </motion.div>
                        ) : (
                          <div className="mx-auto w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-xs text-gray-300">-</div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Color Heatmap */}
      <Card title="🎨 컬러별 판매 히트맵" delay={0.2}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-2 px-2 text-xs text-gray-500">제품</th>
                {colorHeatmap.colors.map((c, i) => (
                  <th key={c} className="py-2 px-2 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: colorHeatmap.colorHex[i] }} />
                      <span className="text-[10px] text-gray-500">{c}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {colorHeatmap.products.map((product, pi) => (
                <tr key={product} className="border-t border-gray-50">
                  <td className="py-2 px-2 text-sm font-medium text-gray-700">{product}</td>
                  {colorHeatmap.data[pi].map((val, ci) => {
                    const maxVal = Math.max(...colorHeatmap.data.flat())
                    const intensity = val / maxVal
                    return (
                      <td key={ci} className="py-2 px-2 text-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.4 + pi * 0.05 + ci * 0.03 }}
                          className="mx-auto w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold"
                          style={{
                            backgroundColor: val > 0
                              ? `rgba(196, 166, 97, ${0.1 + intensity * 0.7})`
                              : '#f9fafb',
                            color: intensity > 0.5 ? 'white' : '#C4A661',
                          }}
                        >
                          {val || '-'}
                        </motion.div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Purchase Patterns */}
      <Card title="🔄 고객 구매 패턴" delay={0.25}>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-indigo-50 rounded-xl">
            <p className="text-2xl font-bold text-indigo-600"><CountUp end={342} format={false} />%</p>
            <p className="text-xs text-gray-500">재구매율</p>
          </div>
          <div className="text-center p-3 bg-amber-50 rounded-xl">
            <p className="text-2xl font-bold text-amber-600"><CountUp end={45} />일</p>
            <p className="text-xs text-gray-500">평균 재구매 주기</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-xl">
            <p className="text-2xl font-bold text-green-600"><CountUp end={18} format={false} />개</p>
            <p className="text-xs text-gray-500">평균 구매 수량</p>
          </div>
        </div>

        <h4 className="text-xs font-semibold text-gray-500 mb-2">인기 조합 상품</h4>
        {purchasePatterns.topCombos.map((combo, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + i * 0.08 }}
            className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
          >
            <span className="text-sm text-gray-700">{combo.items}</span>
            <div className="text-right">
              <span className="text-sm font-bold text-indigo-600">{combo.count}건</span>
              <span className="text-xs text-gray-400 ml-2">({combo.rate}%)</span>
            </div>
          </motion.div>
        ))}

        <h4 className="text-xs font-semibold text-gray-500 mt-4 mb-2">시간대별 주문 분포</h4>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={purchasePatterns.timeDistribution}>
            <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="orders" name="주문 수" fill="#C4A661" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Review Sentiment */}
      <Card title="💭 리뷰 감성 분석" delay={0.3}>
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={sentimentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} innerRadius={40} paddingAngle={3}>
                  {sentimentData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={v => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-1">
              <p className="text-xs text-gray-500">총 {reviewSentiment.totalReviews}건 · 평균 ⭐ {reviewSentiment.avgRating}</p>
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h4 className="text-xs font-semibold text-green-600 mb-1">긍정 키워드 TOP 5</h4>
              <div className="flex flex-wrap gap-1.5">
                {reviewSentiment.keywords.positive.map(k => (
                  <span key={k} className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs border border-green-200">{k}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-red-600 mb-1">부정 키워드 TOP 5</h4>
              <div className="flex flex-wrap gap-1.5">
                {reviewSentiment.keywords.negative.map(k => (
                  <span key={k} className="px-2 py-0.5 bg-red-50 text-red-700 rounded-full text-xs border border-red-200">{k}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Per-product sentiment */}
        <div className="mt-4 space-y-2">
          <h4 className="text-xs font-semibold text-gray-500">제품별 감성 분석</h4>
          {reviewSentiment.byProduct.map((p, i) => (
            <motion.div
              key={p.product}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="flex items-center gap-3"
            >
              <span className="text-sm text-gray-700 w-24">{p.product}</span>
              <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden flex">
                <div className="h-full bg-green-400" style={{ width: `${p.positive}%` }} />
                <div className="h-full bg-gray-300" style={{ width: `${p.neutral}%` }} />
                <div className="h-full bg-red-400" style={{ width: `${p.negative}%` }} />
              </div>
              <span className="text-xs text-gray-500 w-12">⭐ {p.avg}</span>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Decisions */}
      {dataDecisions.map(d => (
        <DecisionPanel key={d.id} decision={d} character={char} />
      ))}
    </div>
  )
}
