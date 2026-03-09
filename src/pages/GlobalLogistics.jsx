import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../components/Card'
import CSSAvatar from '../components/CSSAvatar'
import DialogBox from '../components/DialogBox'
import Pipeline from '../components/Pipeline'
import CountUp from '../components/CountUp'
import { characters, ordersList, chinaWarehouse, importHistory, containerData, pipelineData } from '../data/mockData'

const c = characters.taehyun
const msgs = [
  { text: '대표님, 글로벌 물류센터에 오신 걸 환영합니다!' },
  { text: '여기서 발주부터 수입까지 전체 흐름을 한눈에 확인할 수 있어요.' },
  { text: '현재 제작 중인 발주 2건, 중국 창고에 수입 대기 물량 1,520개가 있습니다!' },
]

const statusColor = { '제작중': 'bg-blue-100 text-blue-600', '제작완료': 'bg-amber-100 text-amber-600', '부분수입': 'bg-violet-100 text-violet-600', '완료': 'bg-green-100 text-green-600' }

export default function GlobalLogistics() {
  const [dialogDone, setDialogDone] = useState(false)
  const [activeStage, setActiveStage] = useState(null)
  const [simBoxes, setSimBoxes] = useState([])
  const [simRunning, setSimRunning] = useState(false)

  const runContainerSim = () => {
    if (simRunning) return
    setSimRunning(true)
    setSimBoxes([])
    const total = containerData.items.reduce((s, it) => s + it.boxes, 0)
    let idx = 0
    const iv = setInterval(() => {
      if (idx >= total) { clearInterval(iv); setSimRunning(false); return }
      const itemIdx = containerData.items.findIndex((_, i) => {
        const before = containerData.items.slice(0, i).reduce((s, it) => s + it.boxes, 0)
        return idx < before + containerData.items[i].boxes
      })
      const colors = ['#818cf8', '#6366f1', '#a78bfa', '#c4b5fd']
      setSimBoxes(prev => [...prev, { id: idx, color: colors[itemIdx % colors.length] }])
      idx++
    }, 30)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-4">
        <CSSAvatar characterId="taehyun" size="md" expression={dialogDone ? 'happy' : 'neutral'} />
        <div className="flex-1">
          {!dialogDone ? (
            <DialogBox characterName={c.name} characterColor={c.color} messages={msgs} onComplete={() => setDialogDone(true)} />
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/70 backdrop-blur-2xl rounded-2xl border border-white/60 shadow-sm p-4">
              <p className="text-[13px] text-gray-500"><span className="font-semibold text-gray-700">{c.name}</span>: 전체 물류 흐름을 확인해주세요!</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Pipeline Flow */}
      <Card title="전체 흐름" icon="🔄" delay={0.1}>
        <Pipeline data={pipelineData} onStageClick={setActiveStage} />
        <p className="text-[10px] text-gray-300 text-center mt-3">발주 → 제작 → 중국창고 → 수입 → 국내입고 → 판매</p>
      </Card>

      {/* Orders List */}
      <Card title="발주 목록" icon="📝" delay={0.15}>
        <div className="space-y-2">
          {ordersList.map((order, i) => (
            <motion.div key={order.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.06 }}
              className="p-3 bg-gray-50/40 rounded-xl border border-gray-100/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-gray-400">{order.id}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${statusColor[order.status] || 'bg-gray-100 text-gray-500'}`}>{order.status}</span>
                </div>
                <span className="text-[10px] text-gray-300">{order.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-gray-800">{order.product}</p>
                  <p className="text-[10px] text-gray-400">{order.variants} · {order.qty.toLocaleString()}개</p>
                </div>
              </div>
              <div className="mt-2 w-full h-1.5 bg-gray-200/50 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${order.progress}%` }} transition={{ delay: 0.4 + i * 0.06, duration: 0.8 }}
                  className="h-full rounded-full" style={{ background: order.progress === 100 ? '#22c55e' : order.progress >= 50 ? '#f59e0b' : '#6366f1' }} />
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* China Warehouse */}
        <Card title="중국 공장 창고 현황" icon="🏬" delay={0.2}>
          <div className="space-y-2">
            {chinaWarehouse.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.05 }}
                className={`flex items-center justify-between p-3 rounded-xl border ${item.importable ? 'bg-green-50/40 border-green-200/40' : 'bg-gray-50/40 border-gray-100'}`}>
                <div>
                  <p className="text-[12px] font-medium text-gray-700">{item.product}</p>
                  <p className="text-[10px] text-gray-400">{item.fromOrder}</p>
                </div>
                <div className="text-right">
                  <p className="text-[14px] font-bold text-gray-800"><CountUp end={item.qty} />개</p>
                  {item.importable && <span className="text-[9px] text-green-600 font-bold">수입 가능</span>}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Import History */}
        <Card title="수입 히스토리" icon="🚢" delay={0.25}>
          <div className="space-y-2">
            {importHistory.map((imp, i) => (
              <motion.div key={imp.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.05 }}
                className="p-3 bg-gray-50/40 rounded-xl border border-gray-100/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono text-gray-400">{imp.id}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${imp.status === '입고완료' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>{imp.status}</span>
                </div>
                <p className="text-[12px] text-gray-700">{imp.items}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-gray-400">{imp.container}</span>
                  <span className="text-[10px] text-gray-400">{imp.cbm} CBM</span>
                  <span className="text-[10px] text-indigo-500 font-bold">{imp.fillRate}%</span>
                  <span className="text-[10px] text-gray-300 ml-auto">{imp.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Container Simulator */}
      <Card title="컨테이너 적재 시뮬레이터" icon="📦" delay={0.3}>
        <div className="flex items-center gap-4 mb-4">
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={runContainerSim}
            className="px-4 py-2 rounded-xl text-[12px] font-semibold text-white shadow-sm"
            style={{ background: simRunning ? '#9ca3af' : '#6366f1' }}>
            {simRunning ? '적재 중...' : '적재 시뮬레이션 시작'}
          </motion.button>
          <span className="text-[11px] text-gray-400">40ft HQ · 총 {containerData.items.reduce((s, it) => s + it.boxes, 0)}박스</span>
        </div>

        {/* Container visual */}
        <div className="relative w-full h-32 bg-gray-100/60 rounded-xl border-2 border-gray-200/60 overflow-hidden">
          {/* Grid */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(90deg, #000 1px, transparent 1px), linear-gradient(#000 1px, transparent 1px)', backgroundSize: '8px 8px' }} />

          {/* Boxes */}
          <div className="absolute bottom-0 left-0 right-0 flex flex-wrap-reverse items-end content-end p-1 gap-0.5" style={{ height: '100%' }}>
            <AnimatePresence>
              {simBoxes.map(box => (
                <motion.div key={box.id}
                  initial={{ opacity: 0, y: -20, scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="w-[5px] h-[5px] rounded-[1px]"
                  style={{ backgroundColor: box.color }}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Fill rate overlay */}
          <div className="absolute top-2 right-2 bg-white/80 backdrop-blur rounded-lg px-2 py-1">
            <span className="text-[11px] font-bold text-indigo-600">
              {simBoxes.length > 0 ? `${Math.min(Math.round((simBoxes.length / containerData.items.reduce((s, it) => s + it.boxes, 0)) * 100), 100)}%` : '0%'}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-3">
          {containerData.items.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: ['#818cf8', '#6366f1', '#a78bfa', '#c4b5fd'][i] }} />
              <span className="text-[10px] text-gray-400">{item.product} ({item.boxes})</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
