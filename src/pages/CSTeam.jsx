import { useState } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import Card from '../components/Card'
import DialogBox from '../components/DialogBox'
import CharacterSprite from '../components/CharacterSprite'
import DecisionPanel from '../components/DecisionPanel'
import { characters, csStatusData, unansweredCS, claimData, satisfactionData, csDecisions } from '../data/mockData'

const char = characters.seoyeon

const dialogMessages = [
  { text: '대표님, CS팀 서연이에요. 고객 문의 현황 보고 올립니다!' },
  { text: '현재 미답변 8건 중 3건이 24시간을 초과했어요. 긴급 처리가 필요합니다!' },
  { text: '좋은 소식도 있어요! 고객 만족도가 4.5점으로 사상 최고치를 기록했답니다!' },
  { text: '클레임과 반품도 3월에 크게 줄었어요. 품질 개선 효과가 나타나고 있습니다.' },
]

export default function CSTeam() {
  const [dialogDone, setDialogDone] = useState(false)

  return (
    <div className="space-y-5">
      {/* Character + Dialog */}
      <div className="flex items-start gap-4">
        <CharacterSprite characterId="seoyeon" size="md" showName={false} />
        <div className="flex-1">
          {!dialogDone ? (
            <DialogBox character={char} messages={dialogMessages} onComplete={() => setDialogDone(true)} />
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm p-4">
              <p className="text-sm text-gray-600">{char.emoji} <span className="font-semibold">{char.name}</span>: CS 현황을 확인해주세요!</p>
            </motion.div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* CS Status Pie */}
        <Card title="📊 답변 현황" delay={0.1}>
          <div className="flex items-center">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={csStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40} paddingAngle={3}>
                  {csStatusData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {csStatusData.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-sm text-gray-600">{d.name}</span>
                  <span className="text-sm font-bold text-gray-800">{d.value}건</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Satisfaction Trend */}
        <Card title="😊 고객 만족도 트렌드" delay={0.15}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={satisfactionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis domain={[3.5, 5]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#ec4899" strokeWidth={2} dot={{ fill: '#ec4899', r: 4 }} name="만족도" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Unanswered List */}
      <Card title="🔴 미답변 문의 목록" delay={0.2}>
        <div className="space-y-2">
          {unansweredCS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className={`flex items-center justify-between p-3 rounded-xl border ${
                item.hours >= 24 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    item.priority === 'high' ? 'bg-red-100 text-red-600' :
                    item.priority === 'medium' ? 'bg-amber-100 text-amber-600' :
                    'bg-gray-100 text-gray-500'
                  }`}>{item.priority === 'high' ? '긴급' : item.priority === 'medium' ? '보통' : '낮음'}</span>
                  <span className="text-sm font-medium text-gray-800">{item.subject}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">{item.id}</span>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-gray-400">{item.customer}</span>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-gray-400">{item.category}</span>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${item.hours >= 24 ? 'text-red-500' : 'text-gray-500'}`}>
                  {item.hours}시간 경과
                </p>
                {item.hours >= 24 && (
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="text-[10px] text-red-500 font-medium"
                  >
                    ⚠️ 24시간 초과
                  </motion.span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Claims / Returns */}
      <Card title="📉 클레임/반품 현황" delay={0.25}>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={claimData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="claims" name="클레임" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="returns" name="반품" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="refunds" name="환불" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Decisions */}
      {csDecisions.map(d => (
        <DecisionPanel key={d.id} decision={d} character={char} />
      ))}
    </div>
  )
}
