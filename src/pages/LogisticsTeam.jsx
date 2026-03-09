import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import Card from '../components/Card'
import DialogBox from '../components/DialogBox'
import CharacterSprite from '../components/CharacterSprite'
import DecisionPanel from '../components/DecisionPanel'
import CountUp from '../components/CountUp'
import {
  characters, nDeliveryStock, easyAdminStock, restockAlerts,
  depletionTimeline, oemRecommendation, containerData, logisticsDecisions,
} from '../data/mockData'

const char = characters.taehyun

const dialogMessages = [
  { text: '대표님! 물류팀 태현 보고드립니다. 재고 상황 말씀드릴게요!' },
  { text: '긴급 상황입니다! Edge V2 네이비 M이 2.4일, Eddy V2 베이지가 2일 안에 소진됩니다!' },
  { text: 'N배송 입고가 시급한 건이 5건이에요. 본사 창고에는 재고가 있으니 즉시 입고 가능합니다.' },
  { text: 'OEM 발주 건도 준비해왔어요. 40ft HQ 컨테이너 적재율 89.4%로 최적화했습니다!' },
]

export default function LogisticsTeam() {
  const [dialogDone, setDialogDone] = useState(false)

  return (
    <div className="space-y-5">
      {/* Character + Dialog */}
      <div className="flex items-start gap-4">
        <CharacterSprite characterId="taehyun" size="md" showName={false} />
        <div className="flex-1">
          {!dialogDone ? (
            <DialogBox character={char} messages={dialogMessages} onComplete={() => setDialogDone(true)} />
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm p-4">
              <p className="text-sm text-gray-600">{char.emoji} <span className="font-semibold">{char.name}</span>: 재고 현황을 확인해주세요!</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Restock Alerts */}
      <Card title="🚨 N배송 입고 필요건" delay={0.1}>
        <div className="space-y-2">
          {restockAlerts.map((item, i) => (
            <motion.div
              key={item.sku}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className={`flex items-center justify-between p-3 rounded-xl border ${
                item.urgency === '긴급'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-amber-50 border-amber-200'
              }`}
            >
              <div>
                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-500">{item.sku}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${item.urgency === '긴급' ? 'text-red-500' : 'text-amber-500'}`}>
                  {item.daysLeft}일 후 소진
                </p>
                <p className="text-xs text-gray-500">필요 수량: {item.needed}개</p>
              </div>
              <motion.div
                animate={item.urgency === '긴급' ? {
                  boxShadow: ['0 0 0 0 rgba(239,68,68,0.4)', '0 0 0 8px rgba(239,68,68,0)', '0 0 0 0 rgba(239,68,68,0.4)']
                } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`px-2 py-0.5 rounded-full text-xs font-bold text-white ${
                  item.urgency === '긴급' ? 'bg-red-500' : 'bg-amber-500'
                }`}
              >
                {item.urgency}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Depletion Timeline */}
      <Card title="📊 재고 소진 예정일 타임라인" delay={0.15}>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={depletionTimeline} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 10 }} label={{ value: '일', position: 'insideBottomRight', offset: -5, fontSize: 10 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={110} />
            <Tooltip formatter={v => `${v}일`} />
            <Bar dataKey="days" radius={[0, 6, 6, 0]}>
              {depletionTimeline.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Integrated Stock View */}
      <Card title="📦 통합 재고 현황 (N배송 + 이지어드민)" delay={0.2}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-2 text-xs text-gray-500 font-medium">SKU</th>
                <th className="text-left py-2 px-2 text-xs text-gray-500 font-medium">상품명</th>
                <th className="text-right py-2 px-2 text-xs text-gray-500 font-medium">N배송</th>
                <th className="text-right py-2 px-2 text-xs text-gray-500 font-medium">본사</th>
                <th className="text-right py-2 px-2 text-xs text-gray-500 font-medium">일판매</th>
                <th className="text-center py-2 px-2 text-xs text-gray-500 font-medium">상태</th>
              </tr>
            </thead>
            <tbody>
              {nDeliveryStock.map((item, i) => {
                const easyItem = easyAdminStock.find(e => e.sku === item.sku)
                return (
                  <motion.tr
                    key={item.sku}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="border-b border-gray-50 hover:bg-gray-50/50"
                  >
                    <td className="py-2 px-2 text-xs text-gray-400 font-mono">{item.sku}</td>
                    <td className="py-2 px-2 text-gray-700">{item.name}</td>
                    <td className="py-2 px-2 text-right font-medium">{item.stock}</td>
                    <td className="py-2 px-2 text-right text-gray-500">{easyItem?.stock || '-'}</td>
                    <td className="py-2 px-2 text-right text-gray-500">{item.dailySales}/일</td>
                    <td className="py-2 px-2 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.status === '긴급' ? 'bg-red-100 text-red-600' :
                        item.status === '주의' ? 'bg-amber-100 text-amber-600' :
                        item.status === '과잉' ? 'bg-blue-100 text-blue-600' :
                        'bg-green-100 text-green-600'
                      }`}>{item.status}</span>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* OEM Recommendation */}
      <Card title="🏭 OEM 제작 물량 추천" delay={0.25}>
        <div className="space-y-2">
          {oemRecommendation.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.06 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">{item.product} {item.color} ({item.size})</p>
                <p className="text-xs text-gray-500">{item.reason}</p>
              </div>
              <span className="text-sm font-bold text-indigo-600">
                <CountUp end={item.recommended} />개
              </span>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Container Optimization */}
      <Card title="🚢 40ft HQ 컨테이너 적재 최적화" delay={0.3}>
        <div className="flex items-center gap-6 mb-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-indigo-600"><CountUp end={containerData.fillRate} suffix="%" format={false} /></p>
            <p className="text-xs text-gray-500">적재율</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-700">{containerData.usedCBM} / {containerData.totalCBM}</p>
            <p className="text-xs text-gray-500">CBM</p>
          </div>
        </div>
        {/* Fill bar */}
        <div className="w-full h-8 bg-gray-100 rounded-xl overflow-hidden mb-4 relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${containerData.fillRate}%` }}
            transition={{ delay: 0.5, duration: 1.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-xl"
          />
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white mix-blend-difference">
            {containerData.fillRate}% 사용
          </div>
        </div>
        {/* Items */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {containerData.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.15 }}
              className="bg-indigo-50 rounded-xl p-3 text-center border border-indigo-100"
            >
              <p className="text-xs text-indigo-400 font-medium">{item.product}</p>
              <p className="text-lg font-bold text-indigo-700"><CountUp end={item.qty} />개</p>
              <p className="text-[10px] text-indigo-400">{item.cbm} CBM · {item.boxes}박스</p>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Decisions */}
      {logisticsDecisions.map(d => (
        <DecisionPanel key={d.id} decision={d} character={char} />
      ))}
    </div>
  )
}
