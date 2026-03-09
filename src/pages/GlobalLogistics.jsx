import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../components/Card'
import ReportLayout from '../components/ReportLayout'
import CountUp from '../components/CountUp'
import { characters, ordersList as defaultOrders, chinaWarehouse, importHistory as defaultImportHistory, pipelineStages, productCBM, domesticInventory, containerData } from '../data/mockData'

const c = characters.hanwei
const msgs = [
  { text: '대표님, 한웨이 매니저입니다. 중국 공장 현황을 보고드립니다.' },
  { text: '현재 제작 중인 발주 2건, 중국 창고에 수입 대기 물량 1,520개가 있습니다!' },
  { text: '발주부터 수입까지 전체 흐름을 한눈에 확인하실 수 있어요.' },
  { text: '각 탭에서 상세한 관리가 가능합니다. 확인해주세요!' },
]

const TABS = [
  { id: 'orders', label: '발주 관리', icon: '📝' },
  { id: 'china', label: '중국 창고', icon: '🏬' },
  { id: 'import', label: '수입 관리', icon: '🚢' },
  { id: 'domestic', label: '국내 재고', icon: '📦' },
]

const statusColor = {
  '제작중': 'bg-blue-100 text-blue-600',
  '제작완료': 'bg-amber-100 text-amber-600',
  '부분수입': 'bg-violet-100 text-violet-600',
  '완료': 'bg-green-100 text-green-600',
}

// localStorage helpers
function loadLocal(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback }
}
function saveLocal(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch { /* noop */ }
}

/* ── Pipeline Flow ── */
function PipelineFlow() {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex items-center gap-1 min-w-[640px]">
        {pipelineStages.map((stage, i) => (
          <div key={stage.id} className="flex items-center flex-1">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center gap-1 p-2 rounded-xl w-full hover:bg-gray-50/50 transition-all cursor-default"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm"
                style={{ backgroundColor: stage.color + '15', border: `1.5px solid ${stage.color}30` }}>
                {stage.icon}
              </div>
              <span className="text-[9px] font-medium text-gray-500 whitespace-nowrap">{stage.label}</span>
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + i * 0.08, type: 'spring' }}
                className="text-[12px] font-bold" style={{ color: stage.color }}>
                {stage.count.toLocaleString()}
              </motion.span>
            </motion.div>
            {i < pipelineStages.length - 1 && (
              <div className="flex-shrink-0 mx-0.5 relative">
                <div className="w-4 h-[2px] bg-gray-200 rounded" />
                <motion.div
                  initial={{ x: -8 }} animate={{ x: 8 }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2, ease: 'linear' }}
                  className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: stage.color + '60' }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── 1. 발주 관리 탭 ── */
function OrdersTab({ orders, onAddOrder }) {
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({ product: 'Edge V2', variants: '', qty: '', expectedDone: '' })

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  const statuses = ['all', '제작중', '제작완료', '부분수입', '완료']

  const handleSubmit = () => {
    if (!form.qty || !form.variants) return
    const newOrder = {
      id: `PO-2026-${String(orders.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().slice(0, 10),
      product: form.product,
      variants: form.variants,
      qty: parseInt(form.qty),
      status: '제작중',
      progress: 0,
      chinaQty: 0,
      importedQty: 0,
      remainQty: parseInt(form.qty),
      expectedDone: form.expectedDone || '미정',
    }
    onAddOrder(newOrder)
    setForm({ product: 'Edge V2', variants: '', qty: '', expectedDone: '' })
    setShowForm(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5 flex-wrap">
          {statuses.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${filter === s ? 'text-white shadow-sm' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
              style={filter === s ? { background: '#2d8a4e' } : {}}>
              {s === 'all' ? '전체' : s}
            </button>
          ))}
        </div>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-1.5 rounded-xl text-[11px] font-semibold text-white shadow-sm"
          style={{ background: '#2d8a4e' }}>
          + 새 발주
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-green-50/60 rounded-xl border border-green-200/40 space-y-3">
            <p className="text-[12px] font-semibold text-green-800">새 발주 등록</p>
            <div className="grid grid-cols-2 gap-2">
              <select value={form.product} onChange={e => setForm({ ...form, product: e.target.value })}
                className="px-2 py-1.5 bg-white rounded-lg text-[11px] border border-gray-200">
                {Object.keys(productCBM).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <input type="text" placeholder="사이즈/컬러 (예: 블랙M, 네이비L)" value={form.variants}
                onChange={e => setForm({ ...form, variants: e.target.value })}
                className="px-2 py-1.5 bg-white rounded-lg text-[11px] border border-gray-200" />
              <input type="number" placeholder="수량" value={form.qty}
                onChange={e => setForm({ ...form, qty: e.target.value })}
                className="px-2 py-1.5 bg-white rounded-lg text-[11px] border border-gray-200" />
              <input type="date" value={form.expectedDone}
                onChange={e => setForm({ ...form, expectedDone: e.target.value })}
                className="px-2 py-1.5 bg-white rounded-lg text-[11px] border border-gray-200" />
            </div>
            <div className="flex gap-2">
              <motion.button whileTap={{ scale: 0.96 }} onClick={handleSubmit}
                className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white" style={{ background: '#2d8a4e' }}>등록</motion.button>
              <button onClick={() => setShowForm(false)} className="px-3 py-1.5 rounded-lg text-[11px] text-gray-400">취소</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {filtered.map((order, i) => (
          <motion.div key={order.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-gray-400">{order.id}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${statusColor[order.status] || 'bg-gray-100 text-gray-500'}`}>{order.status}</span>
              </div>
              <span className="text-[10px] text-gray-300">{order.date}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-[13px] font-medium text-gray-800">{order.product}</p>
                <p className="text-[10px] text-gray-400">{order.variants} · {order.qty.toLocaleString()}개</p>
              </div>
              {order.expectedDone && <span className="text-[10px] text-gray-300">예상완료: {order.expectedDone}</span>}
            </div>
            {/* 진행률 */}
            <div className="w-full h-1.5 bg-gray-200/50 rounded-full overflow-hidden mb-2">
              <motion.div initial={{ width: 0 }} animate={{ width: `${order.progress}%` }} transition={{ duration: 0.8 }}
                className="h-full rounded-full" style={{ background: order.progress === 100 ? '#22c55e' : order.progress >= 50 ? '#f59e0b' : '#6366f1' }} />
            </div>
            {/* 수량 시각화 */}
            <div className="flex items-center gap-3 text-[10px]">
              <span className="text-blue-500">중국창고 {order.chinaQty}</span>
              <span className="text-green-500">수입완료 {order.importedQty}</span>
              <span className="text-gray-400">남은 {order.remainQty}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ── 2. 중국 창고 현황 탭 ── */
function ChinaWarehouseTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 mb-2">
        <div className="p-3 bg-green-50/60 rounded-xl text-center border border-green-200/40">
          <p className="text-2xl font-bold text-green-700"><CountUp end={chinaWarehouse.reduce((s, i) => s + i.qty, 0)} /></p>
          <p className="text-[10px] text-green-500">총 보관 수량</p>
        </div>
        <div className="p-3 bg-blue-50/60 rounded-xl text-center border border-blue-200/40">
          <p className="text-2xl font-bold text-blue-700"><CountUp end={chinaWarehouse.filter(i => i.importable).length} /></p>
          <p className="text-[10px] text-blue-500">수입 가능 품목</p>
        </div>
      </div>

      <div className="space-y-2">
        {chinaWarehouse.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
            className={`p-4 rounded-xl border ${item.importable ? 'bg-green-50/40 border-green-200/40' : 'bg-gray-50/40 border-gray-100'}`}>
            <div className="flex items-center justify-between mb-1">
              <div>
                <p className="text-[13px] font-medium text-gray-700">{item.product}</p>
                <p className="text-[10px] text-gray-400">발주: {item.fromOrder} · 입고일: {item.storedDate}</p>
              </div>
              <div className="text-right">
                <p className="text-[16px] font-bold text-gray-800"><CountUp end={item.qty} />개</p>
                {item.importable && <span className="text-[9px] text-green-600 font-bold">✓ 수입 가능</span>}
              </div>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[10px] text-gray-400">보관 {item.monthsStored}개월</span>
              <span className="text-[10px] text-gray-400">CBM/개: {item.cbmPerUnit}</span>
              {item.monthsStored >= 3 && (
                <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-[9px] text-red-500 font-bold ml-auto">⚠️ 장기 보관</motion.span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ── 3. 수입 관리 탭 ── */
function ImportTab({ imports }) {
  const [selectedItems, setSelectedItems] = useState([])
  const [showSim, setShowSim] = useState(false)
  const maxCBM = 67.5 // 40ft HQ

  const toggleSelect = (id) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const selectedCBM = selectedItems.reduce((sum, id) => {
    const item = chinaWarehouse.find(i => i.id === id)
    return sum + (item ? item.qty * item.cbmPerUnit : 0)
  }, 0)
  const fillRate = Math.min((selectedCBM / maxCBM) * 100, 100)
  const remainCBM = maxCBM - selectedCBM

  // AI suggestion
  const suggestItem = chinaWarehouse.find(i => !selectedItems.includes(i.id) && i.qty * i.cbmPerUnit <= remainCBM)

  return (
    <div className="space-y-4">
      {/* Selectable items from China warehouse */}
      <div>
        <p className="text-[12px] font-semibold text-gray-600 mb-2">중국 창고 물량 선택 (수입할 품목 체크)</p>
        <div className="space-y-1.5">
          {chinaWarehouse.map((item) => (
            <motion.div key={item.id} whileTap={{ scale: 0.98 }}
              onClick={() => toggleSelect(item.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedItems.includes(item.id) ? 'bg-blue-50/60 border-blue-300/60' : 'bg-white/50 border-gray-100 hover:border-blue-200'}`}>
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${selectedItems.includes(item.id) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                {selectedItems.includes(item.id) && <span className="text-white text-[8px]">✓</span>}
              </div>
              <div className="flex-1">
                <p className="text-[12px] font-medium text-gray-700">{item.product}</p>
                <p className="text-[10px] text-gray-400">{item.qty}개 · {(item.qty * item.cbmPerUnit).toFixed(1)} CBM</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Container Simulator */}
      {selectedItems.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-200/40">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[12px] font-semibold text-indigo-700">📦 40ft HQ 컨테이너 시뮬레이터</p>
            <span className="text-[11px] font-bold text-indigo-600"><CountUp end={fillRate} decimals={1} />%</span>
          </div>
          <div className="w-full h-6 bg-white rounded-xl overflow-hidden mb-2 border border-indigo-200/40">
            <motion.div initial={{ width: 0 }} animate={{ width: `${fillRate}%` }} transition={{ duration: 0.8 }}
              className="h-full rounded-xl"
              style={{ background: fillRate > 90 ? 'linear-gradient(90deg, #ef4444, #f87171)' : 'linear-gradient(90deg, #818cf8, #6366f1)' }} />
          </div>
          <div className="flex items-center justify-between text-[10px] mb-3">
            <span className="text-indigo-500">{selectedCBM.toFixed(1)} / {maxCBM} CBM</span>
            <span className="text-gray-400">남은 공간: {remainCBM.toFixed(1)} CBM</span>
          </div>
          {/* Selected items breakdown */}
          <div className="space-y-1 mb-3">
            {selectedItems.map(id => {
              const item = chinaWarehouse.find(i => i.id === id)
              if (!item) return null
              const cbm = item.qty * item.cbmPerUnit
              return (
                <div key={id} className="flex items-center justify-between text-[10px] py-1 border-b border-indigo-100/50 last:border-0">
                  <span className="text-indigo-700">{item.product}</span>
                  <span className="text-indigo-400">{item.qty}개 · {cbm.toFixed(1)} CBM</span>
                </div>
              )
            })}
          </div>
          {/* AI suggestion */}
          {suggestItem && remainCBM > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="p-2 bg-amber-50/60 rounded-lg border border-amber-200/40 mt-2">
              <p className="text-[10px] text-amber-700">
                💡 AI 추천: 여유 공간에 <span className="font-bold">{suggestItem.product}</span> ({(suggestItem.qty * suggestItem.cbmPerUnit).toFixed(1)} CBM) 추가 가능
              </p>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Import History */}
      <div>
        <p className="text-[12px] font-semibold text-gray-600 mb-2">수입 히스토리</p>
        <div className="space-y-2">
          {imports.map((imp, i) => (
            <motion.div key={imp.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
              className="p-3 bg-white/60 rounded-xl border border-gray-100/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono text-gray-400">{imp.id}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${imp.status === '입고완료' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>{imp.status}</span>
              </div>
              <p className="text-[12px] text-gray-700 mb-1">{imp.items}</p>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-gray-400">{imp.container}</span>
                <span className="text-[10px] text-gray-400">{imp.cbm} CBM</span>
                <span className="text-[10px] text-indigo-500 font-bold">{imp.fillRate}%</span>
                <span className="text-[10px] text-gray-300 ml-auto">{imp.date}</span>
              </div>
              {/* Products in this import */}
              {imp.products && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {imp.products.map((p, j) => (
                    <span key={j} className="px-1.5 py-0.5 bg-gray-100 rounded text-[9px] text-gray-500">{p.name} ×{p.qty}</span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── 4. 국내 재고 연동 탭 ── */
function DomesticTab() {
  return (
    <div className="space-y-4">
      <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/40 mb-2">
        <p className="text-[11px] text-blue-600">
          ℹ️ 현재 Mock 데이터 표시 중. 추후 n8n MCP 연동 시 실시간 DB 조회로 전환 예정입니다.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-2">
        <div className="p-3 bg-green-50/60 rounded-xl text-center border border-green-200/40">
          <p className="text-2xl font-bold text-green-700"><CountUp end={domesticInventory.reduce((s, i) => s + i.nDelivery, 0)} /></p>
          <p className="text-[10px] text-green-500">N배송 총 재고</p>
        </div>
        <div className="p-3 bg-amber-50/60 rounded-xl text-center border border-amber-200/40">
          <p className="text-2xl font-bold text-amber-700"><CountUp end={domesticInventory.reduce((s, i) => s + i.easyAdmin, 0)} /></p>
          <p className="text-[10px] text-amber-500">이지어드민 총 재고</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-gray-100">
              {['SKU', '상품명', 'N배송', '이지어드민', '최근수입', '매칭'].map(h => (
                <th key={h} className="py-2 px-2 text-[10px] text-gray-400 font-medium text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {domesticInventory.map((item, i) => (
              <motion.tr key={item.sku} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                className="border-b border-gray-50 hover:bg-gray-50/30">
                <td className="py-2 px-2 text-gray-400 font-mono text-[10px]">{item.sku}</td>
                <td className="py-2 px-2 text-gray-700">{item.name}</td>
                <td className="py-2 px-2 font-medium">{item.nDelivery}</td>
                <td className="py-2 px-2 text-gray-500">{item.easyAdmin}</td>
                <td className="py-2 px-2 text-gray-400 text-[10px]">{item.lastImport || '-'}</td>
                <td className="py-2 px-2">
                  {item.matched === true && <span className="text-[10px] text-green-500 font-bold">✓</span>}
                  {item.matched === false && (
                    <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-[10px] text-red-500 font-bold">⚠ 불일치</motion.span>
                  )}
                  {item.matched === null && <span className="text-[10px] text-gray-300">-</span>}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 불일치 경고 */}
      {domesticInventory.some(i => i.matched === false) && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-50/60 rounded-xl border border-red-200/40">
          <p className="text-[11px] font-semibold text-red-700 mb-1">⚠️ 데이터 불일치 감지</p>
          {domesticInventory.filter(i => i.matched === false).map(i => (
            <p key={i.sku} className="text-[10px] text-red-500">
              • {i.name}: 발주/수입 기록과 현재 재고 수량 확인 필요
            </p>
          ))}
        </motion.div>
      )}
    </div>
  )
}

/* ── Main Component ── */
export default function GlobalLogistics() {
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState(() => loadLocal('gl_orders', defaultOrders))
  const [imports] = useState(() => loadLocal('gl_imports', defaultImportHistory))

  // Save to localStorage
  useEffect(() => { saveLocal('gl_orders', orders) }, [orders])

  const handleAddOrder = useCallback((newOrder) => {
    setOrders(prev => [...prev, newOrder])
  }, [])

  // Tab-specific HanWei messages
  const tabMessages = {
    orders: '발주 현황을 보시죠. 새 발주 등록도 여기서 가능합니다!',
    china: '중국 창고에 수입 대기 물량이 있습니다. 오래된 재고도 확인해주세요.',
    import: '수입할 물량을 선택하면 컨테이너 적재율을 시뮬레이션할 수 있어요!',
    domestic: '국내 재고 현황입니다. 추후 DB 연동 시 실시간으로 업데이트됩니다.',
  }

  return (
    <ReportLayout characterId="hanwei" characterName={c.name} characterColor={c.color} messages={msgs}>
      <div className="space-y-5">
        {/* Pipeline Flow */}
        <Card title="발주 → 입고 전체 파이프라인" icon="🔄" delay={0.1}>
          <PipelineFlow />
          <p className="text-[10px] text-gray-300 text-center mt-2">각 단계를 클릭하면 상세 보기</p>
        </Card>

        {/* Tab-specific message from HanWei */}
        <motion.div key={activeTab} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          className="p-3 bg-green-50/60 rounded-xl border border-green-200/40 flex items-center gap-2">
          <span className="text-[12px]">🏭</span>
          <p className="text-[11px] text-green-700"><span className="font-semibold">한웨이 매니저:</span> {tabMessages[activeTab]}</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100/60 rounded-xl p-1">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-3 py-2 rounded-lg text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5 ${activeTab === tab.id ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}>
            {activeTab === 'orders' && <OrdersTab orders={orders} onAddOrder={handleAddOrder} />}
            {activeTab === 'china' && <ChinaWarehouseTab />}
            {activeTab === 'import' && <ImportTab imports={imports} />}
            {activeTab === 'domestic' && <DomesticTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </ReportLayout>
  )
}
