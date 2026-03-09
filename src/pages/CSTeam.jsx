import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import Card from '../components/Card'
import ReportLayout from '../components/ReportLayout'
import DecisionPanel from '../components/DecisionPanel'
import ExecutionChecklist from '../components/ExecutionChecklist'
import { characters, csStatusData, unansweredCS, claimData, satisfactionData, csDecisions, executionChecklists } from '../data/mockData'

const c = characters.seoyeon
const msgs = [
  { text: '대표님, CS팀 박서연 사원입니다. 고객 문의 현황 보고드립니다.' },
  { text: '미답변 8건 중 3건이 24시간을 초과했어요. 긴급 처리가 필요합니다!' },
  { text: '좋은 소식도 있어요! 고객 만족도가 4.5점으로 사상 최고치예요!' },
  { text: '클레임과 반품도 크게 줄었어요. 품질 개선 효과가 나타나고 있습니다.' },
]

export default function CSTeam() {
  return (
    <ReportLayout characterId="seoyeon" characterName={c.name} characterColor={c.color} messages={msgs} questId="q2">
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card title="답변 현황" icon="📊" delay={0.1}>
            <div className="flex items-center">
              <ResponsiveContainer width="50%" height={180}><PieChart><Pie data={csStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} innerRadius={38} paddingAngle={3}>{csStatusData.map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer>
              <div className="space-y-2">{csStatusData.map(d=><div key={d.name} className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor:d.color}}/><span className="text-[12px] text-gray-500">{d.name}</span><span className="text-[12px] font-bold text-gray-700">{d.value}건</span></div>)}</div>
            </div>
          </Card>
          <Card title="고객 만족도 트렌드" icon="😊" delay={0.15}>
            <ResponsiveContainer width="100%" height={180}><LineChart data={satisfactionData}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/><XAxis dataKey="month" tick={{fontSize:11}}/><YAxis domain={[3.5,5]} tick={{fontSize:10}}/><Tooltip/><Line type="monotone" dataKey="score" stroke="#e84393" strokeWidth={2} dot={{fill:'#e84393',r:4}} name="만족도"/></LineChart></ResponsiveContainer>
          </Card>
        </div>

        <Card title="미답변 문의 목록" icon="🔴" delay={0.2}>
          <div className="space-y-2">{unansweredCS.map((item,i)=>(
            <motion.div key={item.id} initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:0.3+i*0.04}}
              className={`flex items-center justify-between p-3 rounded-xl border ${item.hours>=24?'bg-red-50/50 border-red-200/50':'bg-white/50 border-gray-100'}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${item.priority==='high'?'bg-red-100 text-red-600':item.priority==='medium'?'bg-amber-100 text-amber-600':'bg-gray-100 text-gray-400'}`}>{item.priority==='high'?'긴급':item.priority==='medium'?'보통':'낮음'}</span>
                  <span className="text-[12px] font-medium text-gray-800">{item.subject}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5"><span className="text-[10px] text-gray-300">{item.id} · {item.customer} · {item.category}</span></div>
              </div>
              <div className="text-right">
                <p className={`text-[12px] font-bold ${item.hours>=24?'text-red-500':'text-gray-400'}`}>{item.hours}h</p>
                {item.hours>=24 && <motion.span animate={{opacity:[1,0.3,1]}} transition={{repeat:Infinity,duration:1}} className="text-[9px] text-red-400 font-medium">⚠️ 초과</motion.span>}
              </div>
            </motion.div>
          ))}</div>
        </Card>

        <Card title="클레임/반품 현황" icon="📉" delay={0.25}>
          <ResponsiveContainer width="100%" height={220}><BarChart data={claimData}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/><XAxis dataKey="month" tick={{fontSize:11}}/><YAxis tick={{fontSize:10}}/><Tooltip/><Legend wrapperStyle={{fontSize:'11px'}}/><Bar dataKey="claims" name="클레임" fill="#ef4444" radius={[4,4,0,0]}/><Bar dataKey="returns" name="반품" fill="#f59e0b" radius={[4,4,0,0]}/><Bar dataKey="refunds" name="환불" fill="#8b5cf6" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer>
        </Card>

        <ExecutionChecklist items={executionChecklists.cs} delay={0.3} />
        {csDecisions.map(d=><DecisionPanel key={d.id} decision={d} characterColor={c.color}/>)}
      </div>
    </ReportLayout>
  )
}
