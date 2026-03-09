import { useState } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import Card from '../components/Card'
import ReportLayout from '../components/ReportLayout'
import DecisionPanel from '../components/DecisionPanel'
import ExecutionChecklist from '../components/ExecutionChecklist'
import CountUp from '../components/CountUp'
import { characters, dailySalesData, weeklySalesData, monthlySalesData, productSalesShare, colorTrendData, colorDetailData, salesForecastData, competitorData, managementDecisions, executionChecklists } from '../data/mockData'

const c = characters.yujin
const msgs = [
  { text: '대표님, 경영지원팀 김유진 과장입니다. 오늘의 매출 현황을 보고드리겠습니다.' },
  { text: '이번 달 매출 1억 1,840만원, 전월 대비 12.8% 상승! 봄 시즌 효과가 확실합니다.' },
  { text: '밝은 컬러 라인이 강세예요. 아이보리/크림 계열이 전체의 22%로 1위입니다.' },
  { text: '경쟁사 대비 성장률은 업계 1위! 아래 상세 데이터를 확인해주세요.' },
]

export default function ManagementTeam() {
  const [tab, setTab] = useState('daily')
  return (
    <ReportLayout characterId="yujin" characterName={c.name} characterColor={c.color} messages={msgs} questId="q1">
      <div className="space-y-5">
        <Card title="매출 추이" icon="📈" delay={0.1}>
          <div className="flex gap-2 mb-4">
            {[{ id:'daily',l:'일별' },{id:'weekly',l:'주별'},{id:'monthly',l:'월별'}].map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${tab===t.id?'text-white shadow-sm':'bg-gray-100 text-gray-400 hover:bg-gray-200'}`} style={tab===t.id?{background:'#C4A661'}:{}}>{t.l}</button>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={240}>
            {tab==='daily'?(
              <AreaChart data={dailySalesData}><defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#C4A661" stopOpacity={0.2}/><stop offset="95%" stopColor="#C4A661" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/><XAxis dataKey="date" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}} tickFormatter={v=>`${(v/1e6).toFixed(0)}M`}/><Tooltip formatter={v=>`₩${v.toLocaleString()}`}/><Area type="monotone" dataKey="sales" stroke="#C4A661" fill="url(#sg)" strokeWidth={2}/></AreaChart>
            ):tab==='weekly'?(
              <BarChart data={weeklySalesData}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/><XAxis dataKey="week" tick={{fontSize:11}}/><YAxis tick={{fontSize:10}} tickFormatter={v=>`${(v/1e6).toFixed(0)}M`}/><Tooltip formatter={v=>`₩${v.toLocaleString()}`}/><Bar dataKey="sales" fill="#C4A661" radius={[6,6,0,0]}/></BarChart>
            ):(
              <BarChart data={monthlySalesData}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/><XAxis dataKey="month" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}} tickFormatter={v=>`${(v/1e6).toFixed(0)}M`}/><Tooltip formatter={v=>`₩${v.toLocaleString()}`}/><Bar dataKey="sales" fill="#C4A661" radius={[6,6,0,0]}/><Bar dataKey="profit" fill="#6366f1" radius={[6,6,0,0]}/></BarChart>
            )}
          </ResponsiveContainer>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card title="제품별 매출 비중" icon="🛍️" delay={0.15}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart><Pie data={productSalesShare} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={42} paddingAngle={3}>{productSalesShare.map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie><Tooltip formatter={v=>`${v}%`}/><Legend wrapperStyle={{fontSize:'11px'}}/></PieChart>
            </ResponsiveContainer>
          </Card>
          <Card title="컬러 트렌드 (밝은 vs 어두운)" icon="🎨" delay={0.2}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={colorTrendData}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/><XAxis dataKey="month" tick={{fontSize:11}}/><YAxis tick={{fontSize:10}}/><Tooltip formatter={v=>`${v}%`}/><Area type="monotone" dataKey="bright" name="밝은색" stackId="1" stroke="#f59e0b" fill="#fef3c7"/><Area type="monotone" dataKey="dark" name="어두운색" stackId="1" stroke="#475569" fill="#cbd5e1"/></AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>
        <Card title="컬러별 판매 상세" icon="🎨" delay={0.25}>
          <div className="space-y-2">
            {colorDetailData.map((c,i)=>(
              <motion.div key={c.name} initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:0.3+i*0.04}} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-md border border-gray-200 shadow-inner flex-shrink-0" style={{backgroundColor:c.hex}}/>
                <span className="text-[12px] text-gray-600 w-16">{c.name}</span>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div initial={{width:0}} animate={{width:`${c.pct}%`}} transition={{delay:0.4+i*0.04,duration:0.7}} className="h-full rounded-full" style={{backgroundColor:c.hex==='#F0F0F0'?'#d1d5db':c.hex}}/>
                </div>
                <span className="text-[11px] text-gray-400 w-8 text-right">{c.pct}%</span>
              </motion.div>
            ))}
          </div>
        </Card>
        <Card title="매출 예측 (향후 30일)" icon="🔮" delay={0.3}>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={salesForecastData}><defs><linearGradient id="fg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/><XAxis dataKey="date" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}} tickFormatter={v=>`${(v/1e6).toFixed(0)}M`}/><Tooltip formatter={v=>`₩${v.toLocaleString()}`}/><Area type="monotone" dataKey="upper" stroke="none" fill="#e0e7ff" fillOpacity={0.5} name="상한"/><Area type="monotone" dataKey="lower" stroke="none" fill="#ffffff" fillOpacity={1} name="하한"/><Line type="monotone" dataKey="predicted" stroke="#6366f1" strokeWidth={2} dot={false} name="예측"/></AreaChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-gray-300 text-center mt-2">* 음영 영역은 85% 신뢰구간</p>
        </Card>
        <Card title="경쟁사 비교" icon="🏆" delay={0.35}>
          <div className="space-y-2.5">
            {competitorData.map((r,i)=>(
              <motion.div key={r.name} initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:0.4+i*0.07}}
                className={`flex items-center gap-3 p-2 rounded-xl ${r.highlight?'bg-amber-50/60 border border-amber-200/40':''}`}>
                <span className="text-[12px] font-bold text-gray-400 w-5">#{r.rank}</span>
                <span className={`text-[12px] flex-1 ${r.highlight?'font-bold':'text-gray-500'}`} style={r.highlight?{color:'#C4A661'}:{}}>{r.name}</span>
                <div className="w-28 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div initial={{width:0}} animate={{width:`${(r.sales/320)*100}%`}} transition={{delay:0.5+i*0.07,duration:0.7}} className="h-full rounded-full" style={{backgroundColor:r.color}}/>
                </div>
                <span className="text-[11px] text-gray-400 w-10 text-right">{r.share}%</span>
              </motion.div>
            ))}
          </div>
        </Card>
        <ExecutionChecklist items={executionChecklists.management} delay={0.4} />
        {managementDecisions.map(d=><DecisionPanel key={d.id} decision={d} characterColor={c.color}/>)}
      </div>
    </ReportLayout>
  )
}
