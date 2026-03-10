// D.CURVIN Dashboard — API Service
// Fetches live data from 6 endpoints via ?type= params with fallback to mockData

const API_BASE = 'https://primary-production-44bb2.up.railway.app/webhook/dcurvin-dashboard'

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
    types.map(type => fetchEndpoint(`${API_BASE}?type=${type}`))
  )

  const out = {}
  types.forEach((type, i) => {
    out[type] = results[i].status === 'fulfilled' ? results[i].value : null
    // Debug: log raw API responses
    console.log(`[API RAW] ${type}:`, results[i].status === 'fulfilled' ? results[i].value : results[i].reason?.message)
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
    console.log('[API MAP] sales input:', apiData)
    // API may return array directly or wrapped object
    const items = Array.isArray(apiData) ? apiData : apiData.data || apiData.sales || apiData.dailySales || []
    const src = Array.isArray(apiData) ? {} : apiData

    // Build daily sales from items array
    // API fields: date, revenue (string), order_count (string)
    const dailySalesData = items.map(d => ({
      date: formatDateKST(d.date) || d.date,
      sales: toNumber(d.revenue || d.sales || d.amount),
      orders: toNumber(d.order_count || d.orders || d.orderCount || 0),
      profit: toNumber(d.profit || 0),
    }))

    // Sort by date to ensure chronological order
    dailySalesData.sort((a, b) => {
      const parseDate = (s) => {
        if (!s) return 0
        const parts = s.split('/')
        if (parts.length === 2) return Number(parts[0]) * 100 + Number(parts[1])
        return 0
      }
      return parseDate(a.date) - parseDate(b.date)
    })

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

    // Today's sales = last item in daily data (most recent date)
    const lastDay = dailySalesData.length ? dailySalesData[dailySalesData.length - 1] : null
    const todaySales = toNumber(src.todaySales || src.today?.sales || lastDay?.sales || 0)
    const todayOrders = toNumber(src.todayOrders || src.today?.orders || lastDay?.orders || 0)

    // Calculate salesChange from last two days
    let salesChange = toNumber(src.salesChange || src.today?.change || 0)
    if (!salesChange && dailySalesData.length >= 2) {
      const prev = dailySalesData[dailySalesData.length - 2].sales
      const curr = dailySalesData[dailySalesData.length - 1].sales
      if (prev > 0) salesChange = Math.round(((curr - prev) / prev) * 1000) / 10
    }

    // Recent 7 days for mini chart — ensure sales are Numbers
    const recent = dailySalesData.slice(-7)
    const recentDailySales = recent.map((d, i) => ({
      ...d,
      sales: Number(d.sales) || 0,
      isToday: i === recent.length - 1,
    }))

    // Product share
    const productSalesShare = (src.productShare || src.productSalesShare || []).map((d, i) => ({
      name: d.name || d.product,
      value: toNumber(d.value || d.share || d.percentage),
      amount: toNumber(d.amount || d.sales || 0),
      color: ['#2A3B32', '#4A6355', '#7A9B88', '#8EBAA4'][i % 4],
    }))

    console.log('[API MAP] sales output:', { todaySales, todayOrders, salesChange, recentDays: recentDailySales.length })

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
    console.log('[API MAP] inventory input:', apiData)

    // API may return { nDelivery: [...] } or flat array
    let items = []
    if (Array.isArray(apiData)) {
      items = apiData
    } else if (apiData.nDelivery) {
      items = Array.isArray(apiData.nDelivery) ? apiData.nDelivery : []
    } else {
      items = apiData.data || apiData.items || apiData.nDeliveryStock || []
    }
    const src = Array.isArray(apiData) ? {} : apiData

    const nDeliveryStock = items.map(d => {
      const stockQty = toNumber(d.stock_quantity ?? d.stock ?? d.quantity ?? 0)
      const dailyQty = toNumber(d.daily_sales ?? d.daily ?? d.dailySales ?? 0)
      const daysLeft = dailyQty > 0 ? Math.round((stockQty / dailyQty) * 10) / 10 : (stockQty > 0 ? 999 : 0)
      return {
        sku: d.sku || d.id || d.product_id,
        name: d.name || d.productName || d.product_name,
        stock: stockQty,
        daily: dailyQty,
        daysLeft: toNumber(d.daysLeft || d.remainDays || d.days_left || daysLeft),
        status: d.status || (stockQty === 0 ? '품절' : toNumber(d.daysLeft || daysLeft) <= 3 ? '긴급' : toNumber(d.daysLeft || daysLeft) <= 7 ? '주의' : '정상'),
        channel: d.channel || '',
      }
    })

    const easyAdminStock = (src.easyAdminStock || src.easyAdmin || []).map(d => ({
      sku: d.sku || d.id,
      stock: toNumber(d.stock || d.quantity),
    }))

    // N배송 품절 count: items where stock_quantity = 0
    const outOfStockCount = nDeliveryStock.filter(d => d.stock === 0).length

    // Restock alerts: items with low stock or out of stock
    const lowStock = nDeliveryStock.filter(d => d.daysLeft <= 7 || d.stock === 0)
    const restockAlerts = (src.restockAlerts || src.alerts || lowStock).map(d => ({
      sku: d.sku || d.id,
      name: d.name || d.productName || d.product_name,
      daysLeft: toNumber(d.daysLeft || d.remainDays || d.days_left || 0),
      needed: toNumber(d.needed || d.requiredQty || 0),
      urgency: d.urgency || (d.stock === 0 || toNumber(d.daysLeft) <= 3 ? '긴급' : '주의'),
    }))

    // dangerItems = out of stock count (stock_quantity=0)
    const dangerItems = outOfStockCount || restockAlerts.filter(d => d.daysLeft <= 5).length
    const inventoryGauge = {
      totalSKU: nDeliveryStock.length,
      dangerItems,
      dangerList: (outOfStockCount > 0
        ? nDeliveryStock.filter(d => d.stock === 0).slice(0, 3)
        : restockAlerts.slice(0, 3)
      ).map(d => ({ name: d.name, daysLeft: d.daysLeft })),
      alertText: dangerItems > 0 ? `${dangerItems}개 품목 N배송 품절 예상` : '재고 안정',
    }

    console.log('[API MAP] inventory output:', { totalSKU: nDeliveryStock.length, outOfStockCount, dangerItems })

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
    console.log('[API MAP] orders input:', apiData)
    const data = Array.isArray(apiData) ? { items: apiData } : apiData
    const items = data.items || []

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

    // Calculate unanswered count from multiple sources
    let unansweredCount = 0

    if (unansweredCS.length > 0) {
      unansweredCount = unansweredCS.length
    } else if (csStatusData.length > 0) {
      unansweredCount = csStatusData.find(d => d.name === '미답변')?.value || 0
    } else if (items.length > 0) {
      // Calculate from raw order items: count orders with unanswered/pending CS status
      unansweredCount = items.filter(d => {
        const status = (d.cs_status || d.status || '').toLowerCase()
        return status === '미답변' || status === 'unanswered' || status === 'pending'
      }).length
    }

    // If we have items but no csStatusData, build it from items
    let finalCsStatusData = csStatusData
    if (csStatusData.length === 0 && items.length > 0) {
      const statusMap = {}
      items.forEach(d => {
        const status = d.cs_status || d.status || '기타'
        statusMap[status] = (statusMap[status] || 0) + 1
      })
      const colors = { '답변완료': '#4A6355', '처리중': '#7A9B88', '미답변': '#C45C5C' }
      finalCsStatusData = Object.entries(statusMap).map(([name, value]) => ({
        name,
        value,
        color: colors[name] || '#7A9B88',
      }))
    }

    const totalCS = finalCsStatusData.reduce((sum, d) => sum + d.value, 0)

    console.log('[API MAP] orders output:', { totalCS, unansweredCount })

    return {
      csStatusData: finalCsStatusData.length ? finalCsStatusData : null,
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
    console.log('[API MAP] ranking input:', apiData)
    const items = Array.isArray(apiData) ? apiData : apiData.data || []
    const mapped = items.map(d => ({
      ...d,
      rank: toNumber(d.rank),
      today_sales: toNumber(d.today_sales),
      est_daily_revenue: toNumber(d.est_daily_revenue),
      weekly_sales: toNumber(d.weekly_sales),
      est_weekly_revenue: toNumber(d.est_weekly_revenue),
      total_reviews: toNumber(d.total_reviews),
    }))
    console.log('[API MAP] ranking output:', mapped.length, 'items')
    return mapped
  } catch (e) {
    console.warn('[API] Ranking data mapping failed:', e)
    return null
  }
}

// Competitors data: group by brand_name, with number conversion
export function mapCompetitorsData(apiData) {
  if (!apiData) return null
  try {
    console.log('[API MAP] competitors input:', apiData)

    let brands = []

    if (Array.isArray(apiData)) {
      // Check if it's flat daily records that need grouping by brand_name
      if (apiData.length > 0 && apiData[0].brand_name && !apiData[0].daily_data) {
        // Flat records: group by brand_name
        const brandMap = {}
        apiData.forEach(d => {
          const name = d.brand_name
          if (!brandMap[name]) {
            brandMap[name] = {
              brand_name: name,
              is_dcurvin: d.is_dcurvin || name.toLowerCase().includes('dcurvin') || name.toLowerCase().includes('디커빈'),
              daily_data: [],
            }
          }
          brandMap[name].daily_data.push({
            date: formatDateKST(d.date) || d.date,
            est_daily_revenue: toNumber(d.est_daily_revenue || d.revenue || d.daily_revenue || 0),
            today_sales: toNumber(d.today_sales || d.sales || 0),
          })
        })
        brands = Object.values(brandMap)
        // Sort daily_data by date within each brand
        brands.forEach(b => {
          b.daily_data.sort((a, b2) => {
            const pa = (a.date || '').split('/').map(Number)
            const pb = (b2.date || '').split('/').map(Number)
            return (pa[0] * 100 + (pa[1] || 0)) - (pb[0] * 100 + (pb[1] || 0))
          })
        })
      } else {
        // Already grouped by brand
        brands = apiData.map(brand => ({
          ...brand,
          daily_data: (brand.daily_data || []).map(d => ({
            ...d,
            date: formatDateKST(d.date) || d.date,
            est_daily_revenue: toNumber(d.est_daily_revenue || d.revenue),
          })),
        }))
      }
    }

    console.log('[API MAP] competitors output:', brands.length, 'brands')
    return brands.length ? brands : apiData
  } catch (e) {
    console.warn('[API] Competitors data mapping failed:', e)
    return null
  }
}

export { formatDateKST, formatCurrency, toNumber }
