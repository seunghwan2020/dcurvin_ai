import { motion } from 'framer-motion'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import Card from '../components/Card'
import ReportLayout from '../components/ReportLayout'
import DecisionPanel from '../components/DecisionPanel'
import ExecutionChecklist from '../components/ExecutionChecklist'
import CountUp from '../components/CountUp'
import { characters, productSalesData, sizeHeatmap, colorHeatmap, purchasePatterns, reviewSentiment, dataDecisions, executionChecklists } from '../data/mockData'

const c = characters.minjun
const msgs = [
  { text: '대표님, 고객데이터분석팀 최민준 주임입니다. 분석 결과를 보고드립니다.' },
  { text: 'Edge V2가 여전히 1위인데, ConnectBag 성장률이 22.8%로 가장 높아요!' },
  { text: '흥미로운 발견! Edge V2와 ConnectBag 함께 사는 고객이 12.3%나 됩니다.' },
  { text: '리뷰 감성 분석도 했어요. 전체 긍정률 72%, 평균 별점 4.3점입니다!' },
]
const sentimentPie = [
  { name: '긍정', value: reviewSentiment.positive, color: '#22c55e' },
  { name: '중립', value: reviewSentiment.neutral, color: '#9ca3af' },
  { name: '부정', value: reviewSentiment.negative, color: '#ef4444' },
]

function Heatmap({ labels, cols, colColors, data, delay = 0 }) {
  const max = Math.max(...data.flat())
  return (
    <div className="overflow-x-auto"><table className="w-full"><thead><tr><th className="text-left py-2 px-2 text-[11px] text-gray-400">제품</th>
      {cols.map((c, i) => <th key={c} className="py-2 px-2 text-center">
        {colColors && <div className="w-3.5 h-3.5 rounded-full mx-auto mb-0.5 border border-gray-200" style={{ backgroundColor: colColors[i] }} />}
        <span className="text-[10px] text-gray-400">{c}</span>
      </th>)}</tr></thead>
    <tbody>{labels.map((label, pi) => <tr key={label} className="border-t border-gray-50"><td className="py-2 px-2 text-[12px] font-medium text-gray-600">{label}</td>
      {data[pi].map((val, ci) => { const intensity = val / max; return <td key={ci} className="py-2 px-2 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: delay + pi * 0.04 + ci * 0.02 }}
          className="mx-auto w-9 h-9 rounded-lg flex items-center justify-center text-[11px] font-bold"
          style={{ backgroundColor: val > 0 ? `rgba(196,166,97,${0.08 + intensity * 0.6})` : '#f9fafb', color: intensity > 0.5 ? 'white' : val > 0 ? '#C4A661' : '#d1d5db' }}>
          {val || '-'}
        </motion.div>
      </td> })}</tr>)}</tbody></table></div>
  )
}

export default function DataTeam() {
  return (
    <ReportLayout characterId="minjun" characterName={c.name} characterColor={c.color} messages={msgs}>
      <div className="space-y-5">
        <Card title="제품별 판매 현황" icon="📦" delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{productSalesData.map((p, i) => (
            <motion.div key={p.product} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.07 }}
              className="bg-gray-50/60 rounded-xl p-4 text-center border border-gray-100/50">
              <p className="text-[11px] text-gray-400 font-medium">{p.product}</p>
              <p className="text-xl font-bold text-gray-800 mt-1"><CountUp end={p.thisMonth} /></p>
              <p className="text-[9px] text-gray-300">이번 달</p>
              <p className={`text-[11px] font-bold mt-1 ${p.growth > 0 ? 'text-emerald-500' : 'text-red-400'}`}>{p.growth > 0 ? '↑' : '↓'} {Math.abs(p.growth)}%</p>
            </motion.div>
          ))}</div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card title="사이즈별 판매 히트맵" icon="📐" delay={0.15}>
            <Heatmap labels={sizeHeatmap.products} cols={sizeHeatmap.sizes} data={sizeHeatmap.data} delay={0.25} />
          </Card>
          <Card title="컬러별 판매 히트맵" icon="🎨" delay={0.2}>
            <Heatmap labels={colorHeatmap.products} cols={colorHeatmap.colors} colColors={colorHeatmap.hex} data={colorHeatmap.data} delay={0.3} />
          </Card>
        </div>

        <Card title="고객 구매 패턴" icon="🔄" delay={0.25}>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 bg-indigo-50/60 rounded-xl"><p className="text-xl font-bold text-indigo-600"><CountUp end={342} decimals={1}/>%</p><p className="text-[10px] text-gray-400">재구매율</p></div>
            <div className="text-center p-3 bg-amber-50/60 rounded-xl"><p className="text-xl font-bold text-amber-600"><CountUp end={45}/>일</p><p className="text-[10px] text-gray-400">재구매 주기</p></div>
            <div className="text-center p-3 bg-green-50/60 rounded-xl"><p className="text-xl font-bold text-green-600"><CountUp end={18} decimals={1}/>개</p><p className="text-[10px] text-gray-400">평균 구매량</p></div>
          </div>
          <p className="text-[11px] font-semibold text-gray-400 mb-2">인기 조합</p>
          {purchasePatterns.combos.map((combo, i) => <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.06 }} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <span className="text-[12px] text-gray-600">{combo.items}</span><span className="text-[12px] font-bold text-indigo-600">{combo.count}건 <span className="text-gray-300 font-normal">({combo.rate}%)</span></span>
          </motion.div>)}
          <p className="text-[11px] font-semibold text-gray-400 mt-4 mb-2">시간대별 주문</p>
          <ResponsiveContainer width="100%" height={130}><BarChart data={purchasePatterns.timeDist}><XAxis dataKey="hour" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip/><Bar dataKey="orders" name="주문" fill="#C4A661" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer>
        </Card>

        <Card title="리뷰 감성 분석" icon="💭" delay={0.3}>
          <div className="flex items-start gap-5">
            <div className="flex-shrink-0"><ResponsiveContainer width={140} height={140}><PieChart><Pie data={sentimentPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={58} innerRadius={36} paddingAngle={3}>{sentimentPie.map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie><Tooltip formatter={v=>`${v}%`}/></PieChart></ResponsiveContainer>
              <p className="text-[10px] text-gray-300 text-center">총 {reviewSentiment.total}건 · ⭐ {reviewSentiment.avg}</p></div>
            <div className="flex-1 space-y-3">
              <div><p className="text-[11px] font-semibold text-emerald-600 mb-1">긍정 키워드</p><div className="flex flex-wrap gap-1">{reviewSentiment.posKeywords.map(k=><span key={k} className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-[10px] border border-green-200/50">{k}</span>)}</div></div>
              <div><p className="text-[11px] font-semibold text-red-500 mb-1">부정 키워드</p><div className="flex flex-wrap gap-1">{reviewSentiment.negKeywords.map(k=><span key={k} className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-[10px] border border-red-200/50">{k}</span>)}</div></div>
            </div>
          </div>
          <div className="mt-4 space-y-1.5"><p className="text-[11px] font-semibold text-gray-400 mb-1">제품별</p>
            {reviewSentiment.byProduct.map((p, i) => <motion.div key={p.product} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.04 }} className="flex items-center gap-2.5">
              <span className="text-[11px] text-gray-600 w-20">{p.product}</span>
              <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden flex"><div className="h-full bg-green-400" style={{width:`${p.pos}%`}}/><div className="h-full bg-gray-300" style={{width:`${p.neu}%`}}/><div className="h-full bg-red-400" style={{width:`${p.neg}%`}}/></div>
              <span className="text-[10px] text-gray-400 w-10">⭐ {p.avg}</span>
            </motion.div>)}
          </div>
        </Card>

        <ExecutionChecklist items={executionChecklists.data} delay={0.35} />
        {dataDecisions.map(d => <DecisionPanel key={d.id} decision={d} characterColor={c.color}/>)}
      </div>
    </ReportLayout>
  )
}
