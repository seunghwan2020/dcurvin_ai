// D.CURVIN Dashboard — API Service
// Fetches live data from 4 endpoints with fallback to mockData

const BASE_URL = 'https://primary-production-44bb2.up.railway.app/webhook/dcurvin-dashboard'

const ENDPOINTS = {
  sales: `${BASE_URL}/sales`,
  inventory: `${BASE_URL}/inventory`,
  orders: `${BASE_URL}/orders`,
  products: `${BASE_URL}/products`,
}

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
async function fetchEndpoint(url, timeoutMs = 8000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } finally {
    clearTimeout(timer)
  }
}

// Fetch all 4 endpoints concurrently
export async function fetchAllDashboardData() {
  const results = await Promise.allSettled([
    fetchEndpoint(ENDPOINTS.sales),
    fetchEndpoint(ENDPOINTS.inventory),
    fetchEndpoint(ENDPOINTS.orders),
    fetchEndpoint(ENDPOINTS.products),
  ])

  const [salesResult, inventoryResult, ordersResult, productsResult] = results

  return {
    sales: salesResult.status === 'fulfilled' ? salesResult.value : null,
    inventory: inventoryResult.status === 'fulfilled' ? inventoryResult.value : null,
    orders: ordersResult.status === 'fulfilled' ? ordersResult.value : null,
    products: productsResult.status === 'fulfilled' ? productsResult.value : null,
    fetchedAt: new Date().toISOString(),
    hasAnyData: results.some(r => r.status === 'fulfilled'),
  }
}

// ── Data Mappers: API → mockData shape ──

export function mapSalesData(apiData) {
  if (!apiData) return null
  try {
    const data = Array.isArray(apiData) ? apiData : apiData.data || apiData.sales || [apiData]

    // daily sales
    const dailySalesData = (data.dailySales || apiData.dailySales || []).map(d => ({
      date: formatDateKST(d.date) || d.date,
      sales: toNumber(d.sales || d.revenue || d.amount),
      orders: toNumber(d.orders || d.orderCount || 0),
      profit: toNumber(d.profit || 0),
    }))

    // weekly
    const weeklySalesData = (data.weeklySales || apiData.weeklySales || []).map(d => ({
      week: d.week || d.label,
      sales: toNumber(d.sales || d.revenue),
      orders: toNumber(d.orders || 0),
      growth: toNumber(d.growth || 0),
    }))

    // monthly
    const monthlySalesData = (data.monthlySales || apiData.monthlySales || []).map(d => ({
      month: d.month || d.label,
      sales: toNumber(d.sales || d.revenue),
      profit: toNumber(d.profit || 0),
    }))

    // today
    const todaySales = toNumber(apiData.todaySales || apiData.today?.sales || 0)
    const todayOrders = toNumber(apiData.todayOrders || apiData.today?.orders || 0)
    const salesChange = toNumber(apiData.salesChange || apiData.today?.change || 0)

    // recent 7 days mini chart
    const recentDailySales = (apiData.recentDailySales || apiData.recent7days || dailySalesData.slice(-7)).map((d, i, arr) => ({
      date: d.date || formatDateKST(d.date),
      sales: toNumber(d.sales || d.revenue || d.amount),
      isToday: i === arr.length - 1,
    }))

    // product share
    const productSalesShare = (apiData.productShare || apiData.productSalesShare || []).map((d, i) => ({
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
    const data = Array.isArray(apiData) ? { items: apiData } : apiData

    const nDeliveryStock = (data.nDeliveryStock || data.nDelivery || data.items || []).map(d => ({
      sku: d.sku || d.id,
      name: d.name || d.productName,
      stock: toNumber(d.stock || d.quantity),
      daily: toNumber(d.daily || d.dailySales || 0),
      daysLeft: toNumber(d.daysLeft || d.remainDays || 0),
      status: d.status || (toNumber(d.daysLeft) <= 3 ? '긴급' : toNumber(d.daysLeft) <= 7 ? '주의' : '정상'),
    }))

    const easyAdminStock = (data.easyAdminStock || data.easyAdmin || []).map(d => ({
      sku: d.sku || d.id,
      stock: toNumber(d.stock || d.quantity),
    }))

    const restockAlerts = (data.restockAlerts || data.alerts || nDeliveryStock.filter(d => d.daysLeft <= 7)).map(d => ({
      sku: d.sku || d.id,
      name: d.name || d.productName,
      daysLeft: toNumber(d.daysLeft || d.remainDays),
      needed: toNumber(d.needed || d.requiredQty || 0),
      urgency: d.urgency || (toNumber(d.daysLeft) <= 3 ? '긴급' : '주의'),
    }))

    // inventory gauge for main screen
    const dangerItems = restockAlerts.filter(d => d.daysLeft <= 5).length
    const inventoryGauge = {
      totalSKU: nDeliveryStock.length,
      dangerItems,
      dangerList: restockAlerts.slice(0, 3).map(d => ({ name: d.name, daysLeft: d.daysLeft })),
      alertText: `${dangerItems}개 품목 5일 내 N배송 품절 예상`,
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

export { formatDateKST, formatCurrency, toNumber }
