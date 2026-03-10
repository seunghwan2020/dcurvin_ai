import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchAllDashboardData, mapSalesData, mapInventoryData, mapOrdersData, mapProductsData, mapRankingData, mapCompetitorsData } from '../data/api'

const REFRESH_INTERVAL = 5 * 60 * 1000 // 5 minutes

// Shared cache so all components use the same data
let sharedCache = null
let sharedFetchPromise = null
let lastFetchTime = 0
const listeners = new Set()

function notifyListeners() {
  listeners.forEach(fn => fn())
}

async function doFetch() {
  if (sharedFetchPromise) return sharedFetchPromise
  sharedFetchPromise = fetchAllDashboardData()
  try {
    const raw = await sharedFetchPromise
    sharedCache = {
      raw,
      sales: mapSalesData(raw.sales),
      inventory: mapInventoryData(raw.inventory),
      orders: mapOrdersData(raw.orders),
      products: mapProductsData(raw.products),
      ranking: mapRankingData(raw.ranking),
      competitors: mapCompetitorsData(raw.competitors),
      fetchedAt: raw.fetchedAt,
      hasAnyData: raw.hasAnyData,
    }
    lastFetchTime = Date.now()
    notifyListeners()
    return sharedCache
  } finally {
    sharedFetchPromise = null
  }
}

export function useApiData() {
  const [data, setData] = useState(sharedCache)
  const [loading, setLoading] = useState(!sharedCache)
  const [error, setError] = useState(null)
  const intervalRef = useRef(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await doFetch()
      setData(result)
    } catch (e) {
      console.warn('[API] Fetch failed, using fallback:', e.message)
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const onUpdate = () => setData({ ...sharedCache })
    listeners.add(onUpdate)

    if (!sharedCache || Date.now() - lastFetchTime > REFRESH_INTERVAL) {
      refresh()
    }

    intervalRef.current = setInterval(refresh, REFRESH_INTERVAL)

    return () => {
      listeners.delete(onUpdate)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [refresh])

  return { data, loading, error, refresh }
}

// Convenience hooks for specific team data
export function useSalesData() {
  const { data, loading, error, refresh } = useApiData()
  return { data: data?.sales || null, loading, error, refresh }
}

export function useInventoryData() {
  const { data, loading, error, refresh } = useApiData()
  return { data: data?.inventory || null, loading, error, refresh }
}

export function useOrdersData() {
  const { data, loading, error, refresh } = useApiData()
  return { data: data?.orders || null, loading, error, refresh }
}

export function useProductsData() {
  const { data, loading, error, refresh } = useApiData()
  return { data: data?.products || null, loading, error, refresh }
}

export function useRankingData() {
  const { data, loading, error, refresh } = useApiData()
  return { data: data?.ranking || null, loading, error, refresh }
}

export function useCompetitorsData() {
  const { data, loading, error, refresh } = useApiData()
  return { data: data?.competitors || null, loading, error, refresh }
}
