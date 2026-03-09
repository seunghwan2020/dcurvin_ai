import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../components/Card'
import ReportLayout from '../components/ReportLayout'
import CountUp from '../components/CountUp'
import { characters, ordersList as defaultOrders, chinaWarehouse as defaultChinaWarehouse, importHistory as defaultImportHistory, pipelineStages, productCBM, domesticInventory, productInfo } from '../data/mockData'

/* ── Sage Mineral Palette ── */
const P = {
  forest: '#2A3B32',
  sage: '#4A6355',
  eucalyptus: '#7A9B88',
  mintHaze: '#C6D5CC',
  dew: '#EFF4F1',
  celadon: '#8EBAA4',
  danger: '#C45C5C',
}

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
  { id: 'gantt', label: '타임라인', icon: '📊' },
]

const statusStyles = {
  '제작중': { bg: `${P.celadon}20`, text: P.celadon, border: `${P.celadon}40` },
  '제작완료': { bg: `${P.sage}20`, text: P.sage, border: `${P.sage}40` },
  '부분수입': { bg: `${P.eucalyptus}20`, text: P.eucalyptus, border: `${P.eucalyptus}40` },
  '완료': { bg: `${P.forest}20`, text: P.forest, border: `${P.forest}40` },
}

/* ── localStorage helpers ── */
function loadLocal(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback }
}
function saveLocal(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch { /* noop */ }
}

/* ── Status Badge ── */
function StatusBadge({ status }) {
  const s = statusStyles[status] || { bg: `${P.mintHaze}40`, text: P.sage, border: P.mintHaze }
  return (
    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold"
      style={{ backgroundColor: s.bg, color: s.text, border: `1px solid ${s.border}` }}>
      {status}
    </span>
  )
}

/* ── Create empty SKU matrix ── */
function createEmptyMatrix(sizes, colors) {
  const m = {}
  sizes.forEach(sz => { m[sz] = {}; colors.forEach(cl => { m[sz][cl] = 0 }) })
  return m
}

function matrixTotal(matrix) {
  return Object.values(matrix).reduce((s, row) => s + Object.values(row).reduce((a, b) => a + b, 0), 0)
}

function rowSum(matrix, size) {
  return Object.values(matrix[size] || {}).reduce((a, b) => a + b, 0)
}

function colSum(matrix, colors, col) {
  return Object.keys(matrix).reduce((s, sz) => s + (matrix[sz]?.[col] || 0), 0)
}

/* ── Matrix Input Component ── */
function MatrixInput({ product, matrix, onChange, maxMatrix, label }) {
  const info = productInfo[product]
  if (!info) return null
  const { sizes, colors } = info

  return (
    <div className="overflow-x-auto">
      {label && <p className="text-[11px] font-semibold mb-2" style={{ color: P.sage }}>{label}</p>}
      <table className="w-full text-[11px]" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
        <thead>
          <tr>
            <th className="py-1.5 px-2 text-left text-[10px] font-medium" style={{ color: P.eucalyptus }}>사이즈\컬러</th>
            {colors.map(cl => (
              <th key={cl} className="py-1.5 px-2 text-center text-[10px] font-medium" style={{ color: P.eucalyptus }}>{cl}</th>
            ))}
            <th className="py-1.5 px-2 text-center text-[10px] font-bold" style={{ color: P.sage }}>합계</th>
          </tr>
        </thead>
        <tbody>
          {sizes.map(sz => (
            <tr key={sz}>
              <td className="py-1 px-2 text-[11px] font-medium" style={{ color: P.forest }}>{sz}</td>
              {colors.map(cl => {
                const max = maxMatrix ? (maxMatrix[sz]?.[cl] || 0) : Infinity
                return (
                  <td key={cl} className="py-1 px-1">
                    <input
                      type="number"
                      min={0}
                      max={max < Infinity ? max : undefined}
                      value={matrix[sz]?.[cl] || 0}
                      onChange={e => {
                        let v = parseInt(e.target.value) || 0
                        if (max < Infinity) v = Math.min(v, max)
                        if (v < 0) v = 0
                        const next = { ...matrix, [sz]: { ...matrix[sz], [cl]: v } }
                        onChange(next)
                      }}
                      className="w-full px-1.5 py-1 rounded-lg text-center text-[11px] outline-none transition-all focus:ring-1"
                      style={{
                        background: 'rgba(255,255,255,0.8)',
                        border: `1px solid ${P.mintHaze}`,
                        color: P.forest,
                      }}
                    />
                  </td>
                )
              })}
              <td className="py-1 px-2 text-center text-[11px] font-bold" style={{ color: P.sage }}>
                {rowSum(matrix, sz)}
              </td>
            </tr>
          ))}
          <tr style={{ borderTop: `1px solid ${P.mintHaze}` }}>
            <td className="py-1.5 px-2 text-[10px] font-bold" style={{ color: P.sage }}>합계</td>
            {colors.map(cl => (
              <td key={cl} className="py-1.5 px-2 text-center text-[11px] font-bold" style={{ color: P.sage }}>
                {colSum(matrix, colors, cl)}
              </td>
            ))}
            <td className="py-1.5 px-2 text-center text-[12px] font-bold" style={{ color: P.forest }}>
              {matrixTotal(matrix)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

/* ── SKU Breakdown Display ── */
function SkuBreakdown({ product, skuMatrix }) {
  const info = productInfo[product]
  if (!info || !skuMatrix) return null
  const { sizes, colors } = info
  const entries = []
  sizes.forEach(sz => {
    colors.forEach(cl => {
      const qty = skuMatrix[sz]?.[cl]
      if (qty > 0) entries.push({ size: sz, color: cl, qty })
    })
  })
  if (entries.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {entries.map((e, i) => (
        <span key={i} className="px-1.5 py-0.5 rounded text-[9px]"
          style={{ background: `${P.dew}`, color: P.sage, border: `1px solid ${P.mintHaze}` }}>
          {e.size} {e.color} x{e.qty}
        </span>
      ))}
    </div>
  )
}

/* ── Pipeline Flow (Sage palette) ── */
function PipelineFlow() {
  const sageColors = [P.sage, P.eucalyptus, P.forest, P.celadon, P.sage, P.eucalyptus, P.forest]
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex items-center gap-1 min-w-[640px]">
        {pipelineStages.map((stage, i) => {
          const stageColor = sageColors[i % sageColors.length]
          return (
            <div key={stage.id} className="flex items-center flex-1">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col items-center gap-1 p-2 rounded-xl w-full transition-all cursor-default"
                style={{ ':hover': { background: `${P.dew}60` } }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ backgroundColor: `${stageColor}15`, border: `1.5px solid ${stageColor}30`, boxShadow: `0 1px 4px ${P.forest}08` }}>
                  {stage.icon}
                </div>
                <span className="text-[9px] font-medium whitespace-nowrap" style={{ color: P.eucalyptus }}>{stage.label}</span>
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + i * 0.08, type: 'spring' }}
                  className="text-[12px] font-bold" style={{ color: stageColor }}>
                  {stage.count.toLocaleString()}
                </motion.span>
              </motion.div>
              {i < pipelineStages.length - 1 && (
                <div className="flex-shrink-0 mx-0.5 relative">
                  <div className="w-4 h-[2px] rounded" style={{ background: P.mintHaze }} />
                  <motion.div
                    initial={{ x: -8 }} animate={{ x: 8 }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2, ease: 'linear' }}
                    className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: `${stageColor}60` }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Partial Completion Modal ── */
function PartialCompletionModal({ order, onComplete, onCancel }) {
  const info = productInfo[order.product]
  const [completedMatrix, setCompletedMatrix] = useState(() =>
    createEmptyMatrix(info?.sizes || [], info?.colors || [])
  )

  if (!info) return null

  const handleFullComplete = () => {
    if (order.skuMatrix) {
      onComplete({ ...order.skuMatrix })
    } else {
      const full = createEmptyMatrix(info.sizes, info.colors)
      info.sizes.forEach(sz => info.colors.forEach(cl => { full[sz][cl] = Math.ceil(order.qty / (info.sizes.length * info.colors.length)) }))
      onComplete(full)
    }
  }

  const handlePartialComplete = () => {
    const total = matrixTotal(completedMatrix)
    if (total === 0) return
    onComplete(completedMatrix)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(42,59,50,0.4)', backdropFilter: 'blur(4px)' }}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl p-5 space-y-4"
        style={{ background: 'white', border: `1px solid ${P.mintHaze}`, boxShadow: `0 8px 32px ${P.forest}15` }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[14px] font-semibold" style={{ color: P.forest }}>제작 완료 처리</p>
            <p className="text-[11px]" style={{ color: P.eucalyptus }}>{order.id} - {order.product}</p>
          </div>
          <button onClick={onCancel} className="text-[18px]" style={{ color: P.eucalyptus }}>x</button>
        </div>

        <MatrixInput
          product={order.product}
          matrix={completedMatrix}
          onChange={setCompletedMatrix}
          maxMatrix={order.skuMatrix}
          label="완료 수량 입력 (발주 수량 이하)"
        />

        <div className="flex items-center justify-between pt-2" style={{ borderTop: `1px solid ${P.mintHaze}` }}>
          <p className="text-[12px] font-medium" style={{ color: P.sage }}>
            완료: {matrixTotal(completedMatrix)}개 / 발주: {order.qty}개
          </p>
          <div className="flex gap-2">
            <motion.button whileTap={{ scale: 0.96 }} onClick={handleFullComplete}
              className="px-3 py-1.5 rounded-xl text-[11px] font-semibold text-white"
              style={{ background: P.sage }}>
              전체 완료
            </motion.button>
            <motion.button whileTap={{ scale: 0.96 }} onClick={handlePartialComplete}
              className="px-3 py-1.5 rounded-xl text-[11px] font-semibold text-white"
              style={{ background: P.celadon }}>
              부분 완료
            </motion.button>
            <button onClick={onCancel} className="px-3 py-1.5 rounded-xl text-[11px]" style={{ color: P.eucalyptus }}>취소</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════════ */
/* ── 1. Orders Tab ── */
/* ══════════════════════════════════════════════════════════ */
function OrdersTab({ orders, onAddOrder, onUpdateOrder }) {
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)
  const [completionOrder, setCompletionOrder] = useState(null)
  const [product, setProduct] = useState('Edge V2')
  const [expectedDone, setExpectedDone] = useState('')
  const [skuMatrix, setSkuMatrix] = useState(() => {
    const info = productInfo['Edge V2']
    return createEmptyMatrix(info.sizes, info.colors)
  })

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  const statuses = ['all', '제작중', '제작완료', '부분수입', '완료']
  const info = productInfo[product]

  const handleProductChange = (p) => {
    setProduct(p)
    const pi = productInfo[p]
    setSkuMatrix(createEmptyMatrix(pi.sizes, pi.colors))
  }

  const handleSubmit = () => {
    const totalQty = matrixTotal(skuMatrix)
    if (totalQty === 0) return
    const newOrder = {
      id: `PO-2026-${String(orders.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().slice(0, 10),
      product,
      factory: info.factory,
      factoryLabel: info.factoryLabel,
      variants: `${info.sizes.length}사이즈 x ${info.colors.length}컬러`,
      qty: totalQty,
      skuMatrix: { ...skuMatrix },
      status: '제작중',
      progress: 0,
      chinaQty: 0,
      chinaMatrix: null,
      importedQty: 0,
      remainQty: totalQty,
      expectedDone: expectedDone || '미정',
      createdAt: new Date().toISOString(),
      completedAt: null,
      shippedAt: null,
      arrivedAt: null,
    }
    onAddOrder(newOrder)
    setSkuMatrix(createEmptyMatrix(info.sizes, info.colors))
    setExpectedDone('')
    setShowForm(false)
  }

  const handleCompletion = (completedMatrix) => {
    if (!completionOrder) return
    const completedQty = matrixTotal(completedMatrix)
    const isFullComplete = completedQty >= completionOrder.qty
    const newChinaQty = (completionOrder.chinaQty || 0) + completedQty
    const newRemain = Math.max(0, completionOrder.qty - newChinaQty - (completionOrder.importedQty || 0))
    const progress = Math.round(((newChinaQty + (completionOrder.importedQty || 0)) / completionOrder.qty) * 100)

    // Merge completed matrix into existing chinaMatrix
    const existingChina = completionOrder.chinaMatrix || createEmptyMatrix(
      productInfo[completionOrder.product]?.sizes || [],
      productInfo[completionOrder.product]?.colors || []
    )
    const mergedChina = { ...existingChina }
    Object.keys(completedMatrix).forEach(sz => {
      mergedChina[sz] = { ...mergedChina[sz] }
      Object.keys(completedMatrix[sz]).forEach(cl => {
        mergedChina[sz][cl] = (mergedChina[sz][cl] || 0) + (completedMatrix[sz][cl] || 0)
      })
    })

    const updated = {
      ...completionOrder,
      chinaQty: newChinaQty,
      chinaMatrix: mergedChina,
      remainQty: newRemain,
      progress: Math.min(progress, 100),
      status: isFullComplete ? '제작완료' : '제작중',
      completedAt: isFullComplete ? new Date().toISOString().slice(0, 10) : completionOrder.completedAt,
    }
    onUpdateOrder(updated)
    setCompletionOrder(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-1.5 flex-wrap">
          {statuses.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className="px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all"
              style={filter === s
                ? { background: P.forest, color: 'white' }
                : { background: `${P.mintHaze}40`, color: P.eucalyptus }
              }>
              {s === 'all' ? '전체' : s}
            </button>
          ))}
        </div>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-1.5 rounded-xl text-[11px] font-semibold text-white shadow-sm"
          style={{ background: P.forest }}>
          + 새 발주
        </motion.button>
      </div>

      {/* New Order Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden">
            <div className="p-4 rounded-2xl space-y-4"
              style={{ background: `${P.dew}`, border: `1px solid ${P.mintHaze}` }}>
              <p className="text-[13px] font-semibold" style={{ color: P.forest }}>새 발주 등록</p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-medium mb-1 block" style={{ color: P.eucalyptus }}>제품</label>
                  <select value={product} onChange={e => handleProductChange(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl text-[11px] outline-none"
                    style={{ background: 'white', border: `1px solid ${P.mintHaze}`, color: P.forest }}>
                    {Object.keys(productInfo).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-medium mb-1 block" style={{ color: P.eucalyptus }}>공장</label>
                  <div className="px-2.5 py-2 rounded-xl text-[11px]"
                    style={{ background: `${P.mintHaze}30`, border: `1px solid ${P.mintHaze}`, color: P.sage }}>
                    {info?.factoryLabel || '-'}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-medium mb-1 block" style={{ color: P.eucalyptus }}>예상 완료일</label>
                <input type="date" value={expectedDone} onChange={e => setExpectedDone(e.target.value)}
                  className="px-2.5 py-2 rounded-xl text-[11px] outline-none w-full max-w-[200px]"
                  style={{ background: 'white', border: `1px solid ${P.mintHaze}`, color: P.forest }} />
              </div>

              <MatrixInput product={product} matrix={skuMatrix} onChange={setSkuMatrix} label="사이즈 x 컬러별 수량" />

              <div className="flex items-center justify-between pt-2" style={{ borderTop: `1px solid ${P.mintHaze}` }}>
                <p className="text-[12px] font-semibold" style={{ color: P.forest }}>
                  총 수량: {matrixTotal(skuMatrix).toLocaleString()}개
                </p>
                <div className="flex gap-2">
                  <motion.button whileTap={{ scale: 0.96 }} onClick={handleSubmit}
                    className="px-4 py-1.5 rounded-xl text-[11px] font-semibold text-white"
                    style={{ background: P.forest }}>
                    등록
                  </motion.button>
                  <button onClick={() => setShowForm(false)} className="px-3 py-1.5 rounded-xl text-[11px]"
                    style={{ color: P.eucalyptus }}>취소</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order List */}
      <div className="space-y-2">
        {filtered.map((order, i) => {
          const st = statusStyles[order.status] || {}
          const progressColor = order.progress === 100 ? P.forest : order.progress >= 50 ? P.celadon : P.eucalyptus
          return (
            <motion.div key={order.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="rounded-xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.7)', border: `1px solid rgba(198,213,204,0.5)` }}>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono" style={{ color: P.eucalyptus }}>{order.id}</span>
                    <StatusBadge status={order.status} />
                    {order.factoryLabel && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded"
                        style={{ background: `${P.dew}`, color: P.eucalyptus }}>
                        {order.factoryLabel}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px]" style={{ color: P.mintHaze }}>{order.date}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-[13px] font-medium" style={{ color: P.forest }}>{order.product}</p>
                    <p className="text-[10px]" style={{ color: P.eucalyptus }}>{order.variants} · {order.qty.toLocaleString()}개</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {order.expectedDone && (
                      <span className="text-[10px]" style={{ color: P.mintHaze }}>예상완료: {order.expectedDone}</span>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full overflow-hidden mb-2" style={{ background: `${P.mintHaze}40` }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${order.progress}%` }} transition={{ duration: 0.8 }}
                    className="h-full rounded-full" style={{ background: progressColor }} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[10px]">
                    <span style={{ color: P.celadon }}>중국창고 {order.chinaQty || 0}</span>
                    <span style={{ color: P.forest }}>수입완료 {order.importedQty || 0}</span>
                    <span style={{ color: P.eucalyptus }}>남은 {order.remainQty || 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {order.status === '제작중' && (
                      <motion.button whileTap={{ scale: 0.96 }}
                        onClick={() => setCompletionOrder(order)}
                        className="px-2 py-1 rounded-lg text-[9px] font-semibold text-white"
                        style={{ background: P.sage }}>
                        제작 완료
                      </motion.button>
                    )}
                    {order.skuMatrix && (
                      <button onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                        className="px-2 py-1 rounded-lg text-[9px] font-medium"
                        style={{ background: `${P.dew}`, color: P.sage, border: `1px solid ${P.mintHaze}` }}>
                        {expandedId === order.id ? 'SKU 닫기' : 'SKU 상세'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded SKU breakdown */}
              <AnimatePresence>
                {expandedId === order.id && order.skuMatrix && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden">
                    <div className="px-4 pb-4 pt-2" style={{ borderTop: `1px solid ${P.mintHaze}` }}>
                      <SkuBreakdown product={order.product} skuMatrix={order.skuMatrix} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Partial Completion Modal */}
      <AnimatePresence>
        {completionOrder && (
          <PartialCompletionModal
            order={completionOrder}
            onComplete={handleCompletion}
            onCancel={() => setCompletionOrder(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════ */
/* ── 2. China Warehouse Tab ── */
/* ══════════════════════════════════════════════════════════ */
function ChinaWarehouseTab({ orders, chinaItems, onExport }) {
  const [selectedOrders, setSelectedOrders] = useState([])
  const [showExport, setShowExport] = useState(false)
  const [exportProduct, setExportProduct] = useState('Edge V2')
  const [exportMatrix, setExportMatrix] = useState(() =>
    createEmptyMatrix(productInfo['Edge V2'].sizes, productInfo['Edge V2'].colors)
  )

  // Build warehouse items from orders that have chinaQty > 0
  const warehouseOrders = orders.filter(o => (o.chinaQty || 0) > 0 && o.status !== '완료')

  const totalQty = chinaItems.reduce((s, i) => s + i.qty, 0) +
    warehouseOrders.reduce((s, o) => s + (o.chinaQty || 0), 0)

  const toggleOrder = (id) => {
    setSelectedOrders(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleExportProductChange = (p) => {
    setExportProduct(p)
    const pi = productInfo[p]
    if (pi) setExportMatrix(createEmptyMatrix(pi.sizes, pi.colors))
  }

  const handleExportSubmit = () => {
    const totalExport = matrixTotal(exportMatrix)
    if (totalExport === 0) return
    onExport({
      product: exportProduct,
      matrix: { ...exportMatrix },
      qty: totalExport,
      selectedOrders: [...selectedOrders],
    })
    setExportMatrix(createEmptyMatrix(productInfo[exportProduct].sizes, productInfo[exportProduct].colors))
    setSelectedOrders([])
    setShowExport(false)
  }

  const selectedTotalCBM = selectedOrders.reduce((sum, id) => {
    const order = warehouseOrders.find(o => o.id === id)
    if (!order) return sum
    const cbmInfo = productCBM[order.product]
    return sum + (order.chinaQty || 0) * (cbmInfo?.cbmPerUnit || 0.04)
  }, 0)

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl text-center" style={{ background: `${P.celadon}15`, border: `1px solid ${P.celadon}30` }}>
          <p className="text-2xl font-bold" style={{ color: P.forest }}><CountUp end={totalQty} /></p>
          <p className="text-[10px]" style={{ color: P.eucalyptus }}>총 보관 수량</p>
        </div>
        <div className="p-3 rounded-xl text-center" style={{ background: `${P.sage}15`, border: `1px solid ${P.sage}30` }}>
          <p className="text-2xl font-bold" style={{ color: P.forest }}>
            <CountUp end={warehouseOrders.filter(o => o.status === '제작완료').length + chinaItems.filter(i => i.importable).length} />
          </p>
          <p className="text-[10px]" style={{ color: P.eucalyptus }}>수입 가능 품목</p>
        </div>
      </div>

      {/* Default China Warehouse Items */}
      {chinaItems.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold mb-2" style={{ color: P.sage }}>기존 창고 재고</p>
          <div className="space-y-2">
            {chinaItems.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                className="p-3 rounded-xl"
                style={{
                  background: item.importable ? `${P.celadon}08` : 'rgba(255,255,255,0.6)',
                  border: `1px solid ${item.importable ? `${P.celadon}30` : P.mintHaze}`,
                }}>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="text-[12px] font-medium" style={{ color: P.forest }}>{item.product}</p>
                    <p className="text-[10px]" style={{ color: P.eucalyptus }}>발주: {item.fromOrder} · 입고일: {item.storedDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[15px] font-bold" style={{ color: P.forest }}><CountUp end={item.qty} />개</p>
                    {item.importable && <span className="text-[9px] font-bold" style={{ color: P.celadon }}>수입 가능</span>}
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px]" style={{ color: P.eucalyptus }}>보관 {item.monthsStored}개월</span>
                  <span className="text-[10px]" style={{ color: P.eucalyptus }}>CBM/개: {item.cbmPerUnit}</span>
                  {item.monthsStored >= 3 && (
                    <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-[9px] font-bold ml-auto" style={{ color: P.danger }}>장기 보관 주의</motion.span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Orders with China warehouse qty */}
      {warehouseOrders.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold mb-2" style={{ color: P.sage }}>발주별 창고 재고 (수출 선택)</p>
          <div className="space-y-2">
            {warehouseOrders.map((order, i) => {
              const cbmInfo = productCBM[order.product]
              const itemCBM = (order.chinaQty || 0) * (cbmInfo?.cbmPerUnit || 0.04)
              return (
                <motion.div key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleOrder(order.id)}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                  style={{
                    background: selectedOrders.includes(order.id) ? `${P.celadon}12` : 'rgba(255,255,255,0.6)',
                    border: `1px solid ${selectedOrders.includes(order.id) ? `${P.celadon}50` : P.mintHaze}`,
                  }}>
                  <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      background: selectedOrders.includes(order.id) ? P.celadon : 'transparent',
                      border: `2px solid ${selectedOrders.includes(order.id) ? P.celadon : P.mintHaze}`,
                    }}>
                    {selectedOrders.includes(order.id) && <span className="text-white text-[8px]">✓</span>}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[12px] font-medium" style={{ color: P.forest }}>{order.product}</p>
                      <span className="text-[9px] font-mono" style={{ color: P.eucalyptus }}>{order.id}</span>
                    </div>
                    <p className="text-[10px]" style={{ color: P.eucalyptus }}>
                      {(order.chinaQty || 0).toLocaleString()}개 · {itemCBM.toFixed(1)} CBM
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* Selected summary & export */}
      {selectedOrders.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl space-y-3"
          style={{ background: `${P.dew}`, border: `1px solid ${P.mintHaze}` }}>
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-semibold" style={{ color: P.forest }}>
              선택 {selectedOrders.length}건 · 총 {selectedTotalCBM.toFixed(1)} CBM
            </p>
            <motion.button whileTap={{ scale: 0.96 }}
              onClick={() => setShowExport(!showExport)}
              className="px-3 py-1.5 rounded-xl text-[11px] font-semibold text-white"
              style={{ background: P.forest }}>
              수출 매트릭스 작성
            </motion.button>
          </div>

          <AnimatePresence>
            {showExport && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-3 pt-3" style={{ borderTop: `1px solid ${P.mintHaze}` }}>
                <div>
                  <label className="text-[10px] font-medium mb-1 block" style={{ color: P.eucalyptus }}>수출 제품</label>
                  <select value={exportProduct} onChange={e => handleExportProductChange(e.target.value)}
                    className="px-2.5 py-2 rounded-xl text-[11px] outline-none"
                    style={{ background: 'white', border: `1px solid ${P.mintHaze}`, color: P.forest }}>
                    {Object.keys(productInfo).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <MatrixInput product={exportProduct} matrix={exportMatrix} onChange={setExportMatrix} label="수출 수량 입력" />
                <div className="flex items-center justify-between">
                  <p className="text-[11px]" style={{ color: P.sage }}>
                    총 수출: {matrixTotal(exportMatrix)}개 ·
                    CBM: {(matrixTotal(exportMatrix) * (productCBM[exportProduct]?.cbmPerUnit || 0.04)).toFixed(1)}
                  </p>
                  <motion.button whileTap={{ scale: 0.96 }} onClick={handleExportSubmit}
                    className="px-3 py-1.5 rounded-xl text-[11px] font-semibold text-white"
                    style={{ background: P.sage }}>
                    수출 등록
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════ */
/* ── 3. Import Tab ── */
/* ══════════════════════════════════════════════════════════ */
function ImportTab({ chinaItems, orders, imports }) {
  const [selectedItems, setSelectedItems] = useState([])
  const maxCBM = 67.5

  const importableItems = [
    ...chinaItems.filter(i => i.importable).map(i => ({
      id: i.id,
      label: i.product,
      qty: i.qty,
      cbm: i.qty * i.cbmPerUnit,
      source: 'warehouse',
    })),
    ...orders.filter(o => o.status === '제작완료' && (o.chinaQty || 0) > 0).map(o => ({
      id: o.id,
      label: `${o.product} (${o.id})`,
      qty: o.chinaQty,
      cbm: (o.chinaQty || 0) * (productCBM[o.product]?.cbmPerUnit || 0.04),
      source: 'order',
    })),
  ]

  const toggleSelect = (id) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const selectedCBM = selectedItems.reduce((sum, id) => {
    const item = importableItems.find(i => i.id === id)
    return sum + (item ? item.cbm : 0)
  }, 0)
  const fillRate = Math.min((selectedCBM / maxCBM) * 100, 100)
  const remainCBM = Math.max(0, maxCBM - selectedCBM)

  const suggestItem = importableItems.find(i => !selectedItems.includes(i.id) && i.cbm <= remainCBM && i.cbm > 0)

  const fillColor = fillRate > 90 ? P.danger : fillRate > 70 ? P.celadon : P.eucalyptus

  return (
    <div className="space-y-4">
      {/* Selectable items */}
      <div>
        <p className="text-[12px] font-semibold mb-2" style={{ color: P.sage }}>수입 가능 품목 선택</p>
        {importableItems.length === 0 ? (
          <p className="text-[11px] p-4 text-center" style={{ color: P.eucalyptus }}>현재 수입 가능한 품목이 없습니다.</p>
        ) : (
          <div className="space-y-1.5">
            {importableItems.map(item => (
              <motion.div key={item.id} whileTap={{ scale: 0.98 }}
                onClick={() => toggleSelect(item.id)}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                style={{
                  background: selectedItems.includes(item.id) ? `${P.celadon}10` : 'rgba(255,255,255,0.6)',
                  border: `1px solid ${selectedItems.includes(item.id) ? `${P.celadon}50` : P.mintHaze}`,
                }}>
                <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    background: selectedItems.includes(item.id) ? P.celadon : 'transparent',
                    border: `2px solid ${selectedItems.includes(item.id) ? P.celadon : P.mintHaze}`,
                  }}>
                  {selectedItems.includes(item.id) && <span className="text-white text-[8px]">✓</span>}
                </div>
                <div className="flex-1">
                  <p className="text-[12px] font-medium" style={{ color: P.forest }}>{item.label}</p>
                  <p className="text-[10px]" style={{ color: P.eucalyptus }}>{item.qty}개 · {item.cbm.toFixed(1)} CBM</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Container Simulator */}
      {selectedItems.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl"
          style={{ background: `${P.dew}`, border: `1px solid ${P.mintHaze}` }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[12px] font-semibold" style={{ color: P.forest }}>40ft HQ 컨테이너 시뮬레이터</p>
            <span className="text-[11px] font-bold" style={{ color: fillColor }}><CountUp end={fillRate} decimals={1} />%</span>
          </div>

          {/* Fill bar */}
          <div className="w-full h-6 rounded-xl overflow-hidden mb-2"
            style={{ background: 'white', border: `1px solid ${P.mintHaze}` }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${fillRate}%` }} transition={{ duration: 0.8 }}
              className="h-full rounded-xl"
              style={{ background: `linear-gradient(90deg, ${P.eucalyptus}, ${fillColor})` }} />
          </div>

          <div className="flex items-center justify-between text-[10px] mb-3">
            <span style={{ color: P.sage }}>{selectedCBM.toFixed(1)} / {maxCBM} CBM</span>
            <span style={{ color: P.eucalyptus }}>남은 공간: {remainCBM.toFixed(1)} CBM</span>
          </div>

          {/* Selected items breakdown */}
          <div className="space-y-1 mb-3">
            {selectedItems.map(id => {
              const item = importableItems.find(i => i.id === id)
              if (!item) return null
              return (
                <div key={id} className="flex items-center justify-between text-[10px] py-1"
                  style={{ borderBottom: `1px solid ${P.mintHaze}40` }}>
                  <span style={{ color: P.forest }}>{item.label}</span>
                  <span style={{ color: P.eucalyptus }}>{item.qty}개 · {item.cbm.toFixed(1)} CBM</span>
                </div>
              )
            })}
          </div>

          {/* AI suggestion */}
          {suggestItem && remainCBM > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="p-2 rounded-lg mt-2"
              style={{ background: `${P.celadon}12`, border: `1px solid ${P.celadon}30` }}>
              <p className="text-[10px]" style={{ color: P.sage }}>
                AI 추천: 여유 공간에 <span className="font-bold" style={{ color: P.forest }}>{suggestItem.label}</span> ({suggestItem.cbm.toFixed(1)} CBM) 추가 가능
              </p>
            </motion.div>
          )}

          {fillRate > 100 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="p-2 rounded-lg mt-2"
              style={{ background: `${P.danger}12`, border: `1px solid ${P.danger}30` }}>
              <p className="text-[10px] font-bold" style={{ color: P.danger }}>
                컨테이너 용량을 초과했습니다! 일부 품목을 제외해주세요.
              </p>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Import History */}
      <div>
        <p className="text-[12px] font-semibold mb-2" style={{ color: P.sage }}>수입 히스토리</p>
        <div className="space-y-2">
          {imports.map((imp, i) => (
            <motion.div key={imp.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
              className="p-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.7)', border: `1px solid rgba(198,213,204,0.5)` }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono" style={{ color: P.eucalyptus }}>{imp.id}</span>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                  style={{
                    background: imp.status === '입고완료' ? `${P.forest}15` : `${P.celadon}15`,
                    color: imp.status === '입고완료' ? P.forest : P.celadon,
                  }}>
                  {imp.status}
                </span>
              </div>
              <p className="text-[12px] mb-1" style={{ color: P.forest }}>{imp.items}</p>
              <div className="flex items-center gap-3">
                <span className="text-[10px]" style={{ color: P.eucalyptus }}>{imp.container}</span>
                <span className="text-[10px]" style={{ color: P.eucalyptus }}>{imp.cbm} CBM</span>
                <span className="text-[10px] font-bold" style={{ color: P.celadon }}>{imp.fillRate}%</span>
                <span className="text-[10px] ml-auto" style={{ color: P.mintHaze }}>{imp.date}</span>
              </div>
              {imp.products && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {imp.products.map((p, j) => (
                    <span key={j} className="px-1.5 py-0.5 rounded text-[9px]"
                      style={{ background: `${P.dew}`, color: P.sage }}>
                      {p.name} x{p.qty}
                    </span>
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

/* ══════════════════════════════════════════════════════════ */
/* ── 4. Domestic Tab ── */
/* ══════════════════════════════════════════════════════════ */
function DomesticTab() {
  const hasMismatch = domesticInventory.some(i => i.matched === false)

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl" style={{ background: `${P.celadon}10`, border: `1px solid ${P.celadon}25` }}>
        <p className="text-[11px]" style={{ color: P.sage }}>
          현재 Mock 데이터 표시 중. 추후 n8n MCP 연동 시 실시간 DB 조회로 전환 예정입니다.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl text-center" style={{ background: `${P.celadon}15`, border: `1px solid ${P.celadon}30` }}>
          <p className="text-2xl font-bold" style={{ color: P.forest }}>
            <CountUp end={domesticInventory.reduce((s, i) => s + i.nDelivery, 0)} />
          </p>
          <p className="text-[10px]" style={{ color: P.eucalyptus }}>N배송 총 재고</p>
        </div>
        <div className="p-3 rounded-xl text-center" style={{ background: `${P.sage}15`, border: `1px solid ${P.sage}30` }}>
          <p className="text-2xl font-bold" style={{ color: P.forest }}>
            <CountUp end={domesticInventory.reduce((s, i) => s + i.easyAdmin, 0)} />
          </p>
          <p className="text-[10px]" style={{ color: P.eucalyptus }}>이지어드민 총 재고</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr style={{ borderBottom: `1px solid ${P.mintHaze}` }}>
              {['SKU', '상품명', 'N배송', '이지어드민', '최근수입', '매칭'].map(h => (
                <th key={h} className="py-2 px-2 text-[10px] font-medium text-left" style={{ color: P.eucalyptus }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {domesticInventory.map((item, i) => (
              <motion.tr key={item.sku} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                style={{ borderBottom: `1px solid ${P.mintHaze}30` }}>
                <td className="py-2 px-2 font-mono text-[10px]" style={{ color: P.eucalyptus }}>{item.sku}</td>
                <td className="py-2 px-2" style={{ color: P.forest }}>{item.name}</td>
                <td className="py-2 px-2 font-medium" style={{ color: P.forest }}>{item.nDelivery}</td>
                <td className="py-2 px-2" style={{ color: P.sage }}>{item.easyAdmin}</td>
                <td className="py-2 px-2 text-[10px]" style={{ color: P.eucalyptus }}>{item.lastImport || '-'}</td>
                <td className="py-2 px-2">
                  {item.matched === true && <span className="text-[10px] font-bold" style={{ color: P.celadon }}>✓</span>}
                  {item.matched === false && (
                    <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-[10px] font-bold" style={{ color: P.danger }}>불일치</motion.span>
                  )}
                  {item.matched === null && <span className="text-[10px]" style={{ color: P.mintHaze }}>-</span>}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMismatch && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl" style={{ background: `${P.danger}08`, border: `1px solid ${P.danger}25` }}>
          <p className="text-[11px] font-semibold mb-1" style={{ color: P.danger }}>데이터 불일치 감지</p>
          {domesticInventory.filter(i => i.matched === false).map(i => (
            <p key={i.sku} className="text-[10px]" style={{ color: P.danger }}>
              {i.name}: 발주/수입 기록과 현재 재고 수량 확인 필요
            </p>
          ))}
        </motion.div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════ */
/* ── 5. Gantt Timeline Tab ── */
/* ══════════════════════════════════════════════════════════ */
function GanttTab({ orders }) {
  const milestoneColors = {
    order: P.eucalyptus,
    production: P.celadon,
    completed: P.sage,
    shipped: P.forest,
    arrived: P.forest,
  }

  // Calculate date range
  const allDates = orders.flatMap(o => [o.date, o.expectedDone, o.completedAt, o.shippedAt, o.arrivedAt].filter(Boolean))
  if (allDates.length === 0) {
    return <p className="text-[11px] text-center py-8" style={{ color: P.eucalyptus }}>표시할 발주 내역이 없습니다.</p>
  }

  const parseDt = d => new Date(d).getTime()
  const minDate = Math.min(...allDates.map(parseDt))
  const maxDate = Math.max(...allDates.map(parseDt), Date.now() + 30 * 86400000)
  const range = maxDate - minDate || 1

  const pct = (dateStr) => {
    if (!dateStr) return null
    return ((parseDt(dateStr) - minDate) / range) * 100
  }

  // Format date label
  const fmtDate = (ts) => {
    const d = new Date(ts)
    return `${d.getMonth() + 1}/${d.getDate()}`
  }

  // Generate tick marks
  const ticks = []
  const tickInterval = Math.ceil(range / (6 * 86400000)) * 86400000
  for (let t = minDate; t <= maxDate; t += tickInterval) {
    ticks.push(t)
  }

  return (
    <div className="space-y-4">
      <p className="text-[12px] font-semibold" style={{ color: P.sage }}>발주별 타임라인</p>

      {/* Timeline header */}
      <div className="relative h-6 mb-1">
        {ticks.map((t, i) => {
          const left = ((t - minDate) / range) * 100
          return (
            <span key={i} className="absolute text-[8px] -translate-x-1/2"
              style={{ left: `${left}%`, color: P.eucalyptus }}>
              {fmtDate(t)}
            </span>
          )
        })}
      </div>

      {/* Orders */}
      <div className="space-y-3">
        {orders.map((order, i) => {
          const orderPct = pct(order.date) || 0
          const expectedPct = pct(order.expectedDone)
          const completedPct = pct(order.completedAt)
          const shippedPct = pct(order.shippedAt)
          const arrivedPct = pct(order.arrivedAt)
          const endPct = arrivedPct || shippedPct || completedPct || expectedPct || orderPct + 10
          const barWidth = Math.max(endPct - orderPct, 2)
          const st = statusStyles[order.status] || {}

          return (
            <motion.div key={order.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono w-24 flex-shrink-0" style={{ color: P.eucalyptus }}>{order.id}</span>
                <span className="text-[10px] font-medium" style={{ color: P.forest }}>{order.product}</span>
                <StatusBadge status={order.status} />
              </div>

              <div className="relative h-7 rounded-lg ml-24" style={{ background: `${P.mintHaze}25` }}>
                {/* Tick lines */}
                {ticks.map((t, j) => {
                  const left = ((t - minDate) / range) * 100
                  return <div key={j} className="absolute top-0 bottom-0 w-px" style={{ left: `${left}%`, background: `${P.mintHaze}40` }} />
                })}

                {/* Bar */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ duration: 0.6, delay: i * 0.06 }}
                  className="absolute top-1 bottom-1 rounded"
                  style={{ left: `${orderPct}%`, background: `${st.text || P.eucalyptus}30` }}
                />

                {/* Milestones */}
                {[
                  { p: orderPct, label: '발주', color: milestoneColors.order },
                  { p: completedPct, label: '완료', color: milestoneColors.completed },
                  { p: expectedPct, label: '예정', color: milestoneColors.production, dashed: !completedPct },
                  { p: shippedPct, label: '출고', color: milestoneColors.shipped },
                  { p: arrivedPct, label: '입고', color: milestoneColors.arrived },
                ].filter(m => m.p != null).map((m, j) => (
                  <div key={j} className="absolute top-0 bottom-0 flex flex-col items-center justify-center"
                    style={{ left: `${m.p}%`, transform: 'translateX(-50%)' }}>
                    <div className="w-2.5 h-2.5 rounded-full border-2"
                      style={{
                        background: m.dashed ? 'white' : m.color,
                        borderColor: m.color,
                        borderStyle: m.dashed ? 'dashed' : 'solid',
                      }} />
                    <span className="text-[7px] font-medium mt-0.5 whitespace-nowrap" style={{ color: m.color }}>{m.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 pt-2" style={{ borderTop: `1px solid ${P.mintHaze}` }}>
        {[
          { color: milestoneColors.order, label: '발주일' },
          { color: milestoneColors.production, label: '제작완료 예정' },
          { color: milestoneColors.shipped, label: '출고' },
          { color: milestoneColors.arrived, label: '국내 입고' },
        ].map((l, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
            <span className="text-[9px]" style={{ color: P.eucalyptus }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════ */
/* ── Main Component ── */
/* ══════════════════════════════════════════════════════════ */
export default function GlobalLogistics() {
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState(() => loadLocal('gl_orders', defaultOrders))
  const [chinaItems] = useState(() => loadLocal('gl_china', defaultChinaWarehouse))
  const [imports] = useState(defaultImportHistory)

  // Persist to localStorage
  useEffect(() => { saveLocal('gl_orders', orders) }, [orders])
  useEffect(() => { saveLocal('gl_china', chinaItems) }, [chinaItems])

  const handleAddOrder = useCallback((newOrder) => {
    setOrders(prev => [...prev, newOrder])
  }, [])

  const handleUpdateOrder = useCallback((updatedOrder) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o))
  }, [])

  const handleExport = useCallback((exportData) => {
    // Reduce chinaQty from selected orders
    setOrders(prev => prev.map(o => {
      if (!exportData.selectedOrders.includes(o.id)) return o
      return { ...o, status: '부분수입', chinaQty: Math.max(0, (o.chinaQty || 0) - exportData.qty) }
    }))
  }, [])

  const tabMessages = {
    orders: '발주 현황을 보시죠. 매트릭스 입력으로 SKU별 수량 관리가 가능합니다!',
    china: '중국 창고에 수입 대기 물량이 있습니다. 다중 발주 병합 수출도 가능해요.',
    import: '수입할 물량을 선택하면 컨테이너 적재율을 시뮬레이션할 수 있어요!',
    domestic: '국내 재고 현황입니다. N배송과 이지어드민 불일치를 확인하세요.',
    gantt: '발주별 타임라인을 한눈에 확인하실 수 있습니다!',
  }

  return (
    <ReportLayout characterId="hanwei" characterName={c.name} characterColor={c.color} messages={msgs}>
      <div className="space-y-5">
        {/* Pipeline Flow */}
        <Card title="발주 → 입고 전체 파이프라인" icon="🔄" delay={0.1}>
          <PipelineFlow />
          <p className="text-[10px] text-center mt-2" style={{ color: P.mintHaze }}>전체 물류 흐름 요약</p>
        </Card>

        {/* Tab-specific HanWei message */}
        <motion.div key={activeTab} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          className="p-3 rounded-xl flex items-center gap-2"
          style={{ background: `${P.dew}`, border: `1px solid ${P.mintHaze}` }}>
          <span className="text-[12px]">🏭</span>
          <p className="text-[11px]" style={{ color: P.sage }}>
            <span className="font-semibold" style={{ color: P.forest }}>한웨이 매니저:</span> {tabMessages[activeTab]}
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl p-1" style={{ background: `${P.mintHaze}30` }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex-1 px-2 py-2 rounded-lg text-[11px] font-semibold transition-all flex items-center justify-center gap-1"
              style={activeTab === tab.id
                ? { background: 'white', color: P.forest, boxShadow: `0 1px 4px ${P.forest}08` }
                : { color: P.eucalyptus }
              }>
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}>
            {activeTab === 'orders' && (
              <OrdersTab orders={orders} onAddOrder={handleAddOrder} onUpdateOrder={handleUpdateOrder} />
            )}
            {activeTab === 'china' && (
              <ChinaWarehouseTab orders={orders} chinaItems={chinaItems} onExport={handleExport} />
            )}
            {activeTab === 'import' && (
              <ImportTab chinaItems={chinaItems} orders={orders} imports={imports} />
            )}
            {activeTab === 'domestic' && <DomesticTab />}
            {activeTab === 'gantt' && <GanttTab orders={orders} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </ReportLayout>
  )
}
