import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import Card from '../components/Card'
import ReportLayout from '../components/ReportLayout'
import DecisionPanel from '../components/DecisionPanel'
import ExecutionChecklist from '../components/ExecutionChecklist'
import SkeletonCard from '../components/SkeletonCard'
import { DataStatusBadge } from '../components/SkeletonCard'
import CountUp from '../components/CountUp'
import { characters, nDeliveryStock as mockNDelivery, easyAdminStock as mockEasyAdmin, restockAlerts as mockRestockAlerts, depletionTimeline, oemRecommendation, containerData, logisticsDecisions, executionChecklists } from '../data/mockData'
import { useInventoryData } from '../hooks/useApiData'

const c = characters.taehyun
const msgs = [
  { text: '대표님! 물류팀 이태현 대리 보고드립니다. 오늘 재고 상황 좀 급합니다!' },
  { text: '긴급! Edge V2 네이비 M이 2.4일, Eddy V2 베이지가 2일 안에 소진됩니다!' },
  { text: 'N배송 입고 시급한 건 4건이에요. 본사 창고에 재고 있으니 즉시 입고 가능합니다.' },
  { text: 'OEM 발주도 준비했어요. 40ft HQ 컨테이너 적재율 89.4%로 최적화했습니다!' },
]

export default function LogisticsTeam() {
  const { data: invData, loading, error, refresh } = useInventoryData()

  // Use API data with fallback to mockData
  const nDeliveryStock = invData?.nDeliveryStock || mockNDelivery
  const easyAdminStock = invData?.easyAdminStock || mockEasyAdmin
  const restockAlerts = invData?.restockAlerts || mockRestockAlerts

  return (
    <ReportLayout characterId="taehyun" characterName={c.name} characterColor={c.color} messages={msgs} questId="q3">
      <div className="space-y-5">
        <div className="flex justify-end">
          <DataStatusBadge loading={loading} error={error} onRefresh={refresh} />
        </div>

        {loading && !invData ? (
          <SkeletonCard title="N배송 입고 필요건" icon="🚨" height={160} delay={0.1} />
        ) : (
        <Card title="N배송 입고 필요건" icon="🚨" delay={0.1}>
          <div className="space-y-2">
            {restockAlerts.map((item, i) => (
              <motion.div key={item.sku} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.07 }}
                className={`flex items-center justify-between p-3 rounded-xl border ${item.urgency === '긴급' ? 'bg-red-50/60 border-red-200/60' : 'bg-[#EFF4F1] border-[#C6D5CC]'}`}>
                <div><p className="text-[13px] font-medium text-gray-800">{item.name}</p><p className="text-[10px] text-gray-400">{item.sku}</p></div>
                <div className="text-right"><p className={`text-[13px] font-bold ${item.urgency === '긴급' ? 'text-[#C45C5C]' : 'text-[#7A9B88]'}`}>{item.daysLeft}일 후 소진</p><p className="text-[10px] text-gray-400">필요: {item.needed}개</p></div>
                <motion.span animate={item.urgency === '긴급' ? { boxShadow: ['0 0 0 0 rgba(196,92,92,0.4)', '0 0 0 6px rgba(196,92,92,0)', '0 0 0 0 rgba(196,92,92,0.4)'] } : {}} transition={{ repeat: Infinity, duration: 2 }}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${item.urgency === '긴급' ? 'bg-[#C45C5C]' : 'bg-[#7A9B88]'}`}>{item.urgency}</motion.span>
              </motion.div>
            ))}
          </div>
        </Card>
        )}

        <Card title="재고 소진 예정일 타임라인" icon="📊" delay={0.15}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={depletionTimeline} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/><XAxis type="number" tick={{ fontSize: 10 }} label={{ value: '일', position: 'insideBottomRight', offset: -5, fontSize: 10 }}/><YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={110}/><Tooltip formatter={v => `${v}일`}/><Bar dataKey="days" radius={[0, 6, 6, 0]}>{depletionTimeline.map((d, i) => <Cell key={i} fill={d.color}/>)}</Bar></BarChart>
          </ResponsiveContainer>
        </Card>

        {loading && !invData ? (
          <SkeletonCard title="통합 재고" icon="📦" height={200} lines={5} delay={0.2} />
        ) : (
        <Card title="통합 재고 (N배송 + 이지어드민)" icon="📦" delay={0.2}>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead><tr className="border-b border-gray-100">{['SKU','상품명','N배송','본사','일판매','상태'].map(h=><th key={h} className="py-2 px-2 text-[11px] text-gray-400 font-medium text-left">{h}</th>)}</tr></thead>
              <tbody>{nDeliveryStock.map((item, i) => {
                const ea = easyAdminStock.find(e => e.sku === item.sku)
                return <motion.tr key={item.sku} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.04 }} className="border-b border-gray-50 hover:bg-gray-50/30">
                  <td className="py-2 px-2 text-gray-400 font-mono text-[10px]">{item.sku}</td><td className="py-2 px-2 text-gray-700">{item.name}</td>
                  <td className="py-2 px-2 font-medium">{item.stock}</td><td className="py-2 px-2 text-gray-400">{ea?.stock || '-'}</td><td className="py-2 px-2 text-gray-400">{item.daily}/일</td>
                  <td className="py-2 px-2"><span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${item.status==='긴급'?'bg-[#C45C5C]/10 text-[#C45C5C]':item.status==='주의'?'bg-[#7A9B88]/10 text-[#7A9B88]':item.status==='과잉'?'bg-[#8EBAA4]/10 text-[#8EBAA4]':'bg-[#4A6355]/10 text-[#4A6355]'}`}>{item.status}</span></td></motion.tr>
              })}</tbody>
            </table>
          </div>
        </Card>
        )}

        <Card title="OEM 제작 물량 추천" icon="🏭" delay={0.25}>
          <div className="space-y-2">{oemRecommendation.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.05 }}
              className="flex items-center justify-between p-3 bg-gray-50/60 rounded-xl">
              <div><p className="text-[13px] font-medium text-gray-800">{item.product}</p><p className="text-[10px] text-gray-400">{item.reason}</p></div>
              <span className="text-[13px] font-bold text-[#4A6355]"><CountUp end={item.qty}/>개</span>
            </motion.div>
          ))}</div>
        </Card>

        <Card title="40ft HQ 컨테이너 적재 최적화" icon="🚢" delay={0.3}>
          <div className="flex items-center gap-6 mb-4">
            <div className="text-center"><p className="text-3xl font-bold text-[#4A6355]"><CountUp end={containerData.fillRate} decimals={1}/>%</p><p className="text-[10px] text-gray-400">적재율</p></div>
            <div className="text-center"><p className="text-base font-semibold text-gray-600">{containerData.usedCBM} / {containerData.totalCBM}</p><p className="text-[10px] text-gray-400">CBM</p></div>
          </div>
          <div className="w-full h-6 bg-gray-100 rounded-xl overflow-hidden mb-4 relative">
            <motion.div initial={{ width: 0 }} animate={{ width: `${containerData.fillRate}%` }} transition={{ delay: 0.5, duration: 1.5 }}
              className="h-full rounded-xl" style={{ background: 'linear-gradient(90deg, #8EBAA4, #4A6355)' }}/>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {containerData.items.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i * 0.12 }}
                className="bg-[#EFF4F1] rounded-xl p-3 text-center border border-[#C6D5CC]">
                <p className="text-[10px] text-[#7A9B88] font-medium">{item.product}</p>
                <p className="text-lg font-bold text-[#4A6355]"><CountUp end={item.qty}/>개</p>
                <p className="text-[9px] text-[#C6D5CC]">{item.cbm} CBM · {item.boxes}박스</p>
              </motion.div>
            ))}
          </div>
        </Card>

        <ExecutionChecklist items={executionChecklists.logistics} delay={0.35} />
        {logisticsDecisions.map(d => <DecisionPanel key={d.id} decision={d} characterColor={c.color}/>)}
      </div>
    </ReportLayout>
  )
}
