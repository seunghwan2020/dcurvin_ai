// D.CURVIN Dashboard — API Service
// Fetches live data from 6 endpoints via ?type= params with fallback to mockData

const BASE_URL = 'https://primary-production-44bb2.up.railway.app/webhook/dcurvin-dashboard'

// KST date formatter → MM/DD
function formatDateKST(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000)
  return `${kst.getUTCMonth() + 1}/${kst.getUTCDate()}`
}

// Currency formatter → ₩1,234,567
function formatCurrency(value) {
  return `₩${Number(value).toLocaleString('ko-KR')}`
}

// Safely convert revenue strings to numbers
function toNumber(val) {
  if (typeof val === 'number') return val
  if (typeof val === 'string') return Number(val.replace(/[^0-9.-]/g, '')) || 0
  return 0
}

// Fetch a single endpoint with timeout
async function fetchEndpoint(url, timeoutMs = 10000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    // Unwrap { success, data } pattern
    if (json?.success && json.data !== undefined) return json.data
    return json
  } finally {
    clearTimeout(timer)
  }
}

// Fetch all 6 endpoints concurrently via Promise.all
export async function fetchAllDashboardData() {
  const types = ['sales', 'inventory', 'orders', 'products', 'ranking', 'competitors']
  const results = await Promise.allSettled(
    types.map(type => fetchEndpoint(`${BASE_URL}?type=${type}`))
  )

  const out = {}
  types.forEach((type, i) => {
    out[type] = results[i].status === 'fulfilled' ? results[i].value : null
  })

  return {
    ...out,
    fetchedAt: new Date().toISOString(),
    hasAnyData: results.some(r => r.status === 'fulfilled'),
  }
}

// ── Data Mappers: API → component shape ──

export function mapSalesData(apiData) {
  if (!apiData) return null
  try {
    // API may return array directly or wrapped object
    const items = Array.isArray(apiData) ? apiData : apiData.data || apiData.sales || apiData.dailySales || []
    const src = Array.isArray(apiData) ? {} : apiData

    // Build daily sales from items array
    const dailySalesData = items.map(d => ({
      date: formatDateKST(d.date) || d.date,
      sales: toNumber(d.sales || d.revenue || d.amount),
      orders: toNumber(d.orders || d.orderCount || 0),
      profit: toNumber(d.profit || 0),
    }))

    // Also check for nested structures
    const weeklySalesData = (src.weeklySales || []).map(d => ({
      week: d.week || d.label,
      sales: toNumber(d.sales || d.revenue),
      orders: toNumber(d.orders || 0),
      growth: toNumber(d.growth || 0),
    }))

    const monthlySalesData = (src.monthlySales || []).map(d => ({
      month: d.month || d.label,
      sales: toNumber(d.sales || d.revenue),
      profit: toNumber(d.profit || 0),
    }))

    // Today's sales = last item in daily data
    const lastDay = dailySalesData.length ? dailySalesData[dailySalesData.length - 1] : null
    const todaySales = toNumber(src.todaySales || src.today?.sales || lastDay?.sales || 0)
    const todayOrders = toNumber(src.todayOrders || src.today?.orders || lastDay?.orders || 0)
    const salesChange = toNumber(src.salesChange || src.today?.change || 0)

    // Recent 7 days for mini chart
    const recent = dailySalesData.slice(-7)
    const recentDailySales = recent.map((d, i) => ({
      ...d,
      isToday: i === recent.length - 1,
    }))

    // Product share
    const productSalesShare = (src.productShare || src.productSalesShare || []).map((d, i) => ({
      name: d.name || d.product,
      value: toNumber(d.value || d.share || d.percentage),
      amount: toNumber(d.amount || d.sales || 0),
      color: ['#2A3B32', '#4A6355', '#7A9B88', '#8EBAA4'][i % 4],
    }))

    return {
      dailySalesData: dailySalesData.length ? dailySalesData : null,
      weeklySalesData: weeklySalesData.length ? weeklySalesData : null,
      monthlySalesData: monthlySalesData.length ? monthlySalesData : null,
      todaySales,
      todayOrders,
      salesChange,
      recentDailySales: recentDailySales.length ? recentDailySales : null,
      productSalesShare: productSalesShare.length ? productSalesShare : null,
    }
  } catch (e) {
    console.warn('[API] Sales data mapping failed:', e)
    return null
  }
}

export function mapInventoryData(apiData) {
  if (!apiData) return null
  try {
    const items = Array.isArray(apiData) ? apiData : apiData.data || apiData.items || apiData.nDeliveryStock || apiData.nDelivery || []
    const src = Array.isArray(apiData) ? {} : apiData

    const nDeliveryStock = items.map(d => {
      const stockQty = toNumber(d.stock_quantity ?? d.stock ?? d.quantity ?? 0)
      const dailyQty = toNumber(d.daily ?? d.dailySales ?? 0)
      const daysLeft = dailyQty > 0 ? Math.round((stockQty / dailyQty) * 10) / 10 : (stockQty > 0 ? 999 : 0)
      return {
        sku: d.sku || d.id || d.product_id,
        name: d.name || d.productName || d.product_name,
        stock: stockQty,
        daily: dailyQty,
        daysLeft: toNumber(d.daysLeft || d.remainDays || daysLeft),
        status: d.status || (toNumber(d.daysLeft || daysLeft) <= 3 ? '긴급' : toNumber(d.daysLeft || daysLeft) <= 7 ? '주의' : '정상'),
        channel: d.channel || '',
      }
    })

    const easyAdminStock = (src.easyAdminStock || src.easyAdmin || []).map(d => ({
      sku: d.sku || d.id,
      stock: toNumber(d.stock || d.quantity),
    }))

    // Restock alerts: items with low stock
    const lowStock = nDeliveryStock.filter(d => d.daysLeft <= 7 || d.stock === 0)
    const restockAlerts = (src.restockAlerts || src.alerts || lowStock).map(d => ({
      sku: d.sku || d.id,
      name: d.name || d.productName || d.product_name,
      daysLeft: toNumber(d.daysLeft || d.remainDays || 0),
      needed: toNumber(d.needed || d.requiredQty || 0),
      urgency: d.urgency || (toNumber(d.daysLeft) <= 3 || d.stock === 0 ? '긴급' : '주의'),
    }))

    // N배송 품절 예상 count: items where 도착보장 stock_quantity = 0
    const outOfStockCount = nDeliveryStock.filter(d => d.stock === 0).length
    const dangerItems = outOfStockCount || restockAlerts.filter(d => d.daysLeft <= 5).length
    const inventoryGauge = {
      totalSKU: nDeliveryStock.length,
      dangerItems,
      dangerList: restockAlerts.slice(0, 3).map(d => ({ name: d.name, daysLeft: d.daysLeft })),
      alertText: dangerItems > 0 ? `${dangerItems}개 품목 N배송 품절 예상` : '재고 안정',
    }

    return {
      nDeliveryStock: nDeliveryStock.length ? nDeliveryStock : null,
      easyAdminStock: easyAdminStock.length ? easyAdminStock : null,
      restockAlerts: restockAlerts.length ? restockAlerts : null,
      inventoryGauge,
    }
  } catch (e) {
    console.warn('[API] Inventory data mapping failed:', e)
    return null
  }
}

export function mapOrdersData(apiData) {
  if (!apiData) return null
  try {
    const data = Array.isArray(apiData) ? { items: apiData } : apiData

    const csStatusData = (data.csStatus || data.status || []).map((d, i) => ({
      name: d.name || d.label,
      value: toNumber(d.value || d.count),
      color: ['#4A6355', '#7A9B88', '#C45C5C'][i % 3],
    }))

    const unansweredCS = (data.unanswered || data.unansweredCS || data.pending || []).map(d => ({
      id: d.id,
      customer: d.customer || d.customerName,
      subject: d.subject || d.title,
      category: d.category || d.type,
      priority: d.priority || 'medium',
      hours: toNumber(d.hours || d.waitingHours || 0),
    }))

    const claimData = (data.claims || data.claimData || []).map(d => ({
      month: d.month || d.label,
      claims: toNumber(d.claims || 0),
      returns: toNumber(d.returns || 0),
      refunds: toNumber(d.refunds || 0),
    }))

    const satisfactionData = (data.satisfaction || data.satisfactionData || []).map(d => ({
      month: d.month || d.label,
      score: toNumber(d.score || d.rating || 0),
    }))

    const totalCS = csStatusData.reduce((sum, d) => sum + d.value, 0)
    const unansweredCount = unansweredCS.length || (csStatusData.find(d => d.name === '미답변')?.value || 0)

    return {
      csStatusData: csStatusData.length ? csStatusData : null,
      unansweredCS: unansweredCS.length ? unansweredCS : null,
      claimData: claimData.length ? claimData : null,
      satisfactionData: satisfactionData.length ? satisfactionData : null,
      totalCS,
      unansweredCount,
    }
  } catch (e) {
    console.warn('[API] Orders data mapping failed:', e)
    return null
  }
}

export function mapProductsData(apiData) {
  if (!apiData) return null
  try {
    const data = Array.isArray(apiData) ? { items: apiData } : apiData

    const productSalesData = (data.productSales || data.products || data.items || []).map(d => ({
      product: d.product || d.name,
      total: toNumber(d.total || d.totalSales || 0),
      thisMonth: toNumber(d.thisMonth || d.monthlySales || 0),
      growth: toNumber(d.growth || d.growthRate || 0),
      avgPrice: toNumber(d.avgPrice || d.averagePrice || 0),
    }))

    const sizeHeatmap = data.sizeHeatmap || null
    const colorHeatmap = data.colorHeatmap || null
    const purchasePatterns = data.purchasePatterns || null
    const reviewSentiment = data.reviewSentiment || null

    return {
      productSalesData: productSalesData.length ? productSalesData : null,
      sizeHeatmap,
      colorHeatmap,
      purchasePatterns,
      reviewSentiment,
    }
  } catch (e) {
    console.warn('[API] Products data mapping failed:', e)
    return null
  }
}

// Ranking data is passed through as-is (already unwrapped by fetchEndpoint)
export function mapRankingData(apiData) {
  if (!apiData) return null
  try {
    const items = Array.isArray(apiData) ? apiData : apiData.data || []
    return items.map(d => ({
      ...d,
      today_sales: toNumber(d.today_sales),
      est_daily_revenue: toNumber(d.est_daily_revenue),
      weekly_sales: toNumber(d.weekly_sales),
      est_weekly_revenue: toNumber(d.est_weekly_revenue),
      total_reviews: toNumber(d.total_reviews),
    }))
  } catch (e) {
    console.warn('[API] Ranking data mapping failed:', e)
    return null
  }
}

// Competitors data pass-through with number conversion
export function mapCompetitorsData(apiData) {
  if (!apiData) return null
  try {
    if (Array.isArray(apiData)) {
      return apiData.map(brand => ({
        ...brand,
        daily_data: (brand.daily_data || []).map(d => ({
          ...d,
          est_daily_revenue: toNumber(d.est_daily_revenue || d.revenue),
        })),
      }))
    }
    return apiData
  } catch (e) {
    console.warn('[API] Competitors data mapping failed:', e)
    return null
  }
}

export { formatDateKST, formatCurrency, toNumber }
