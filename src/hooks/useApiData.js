import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchAllDashboardData, mapSalesData, mapInventoryData, mapOrdersData, mapProductsData } from '../data/api'

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
    // Subscribe to shared state updates
    const onUpdate = () => setData({ ...sharedCache })
    listeners.add(onUpdate)

    // Initial fetch if no cache or stale
    if (!sharedCache || Date.now() - lastFetchTime > REFRESH_INTERVAL) {
      refresh()
    }

    // Auto-refresh every 5 minutes
    intervalRef.current = setInterval(refresh, REFRESH_INTERVAL)

    return () => {
      listeners.delete(onUpdate)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [refresh])

  return { data, loading, error, refresh }
}

// Convenience hooks for specific team data
export function useSalesData(fallback) {
  const { data, loading, error, refresh } = useApiData()
  return {
    data: data?.sales || null,
    fallback,
    loading,
    error,
    refresh,
    // Helper: get value with fallback
    get: (key) => data?.sales?.[key] ?? fallback?.[key] ?? null,
  }
}

export function useInventoryData(fallback) {
  const { data, loading, error, refresh } = useApiData()
  return {
    data: data?.inventory || null,
    fallback,
    loading,
    error,
    refresh,
    get: (key) => data?.inventory?.[key] ?? fallback?.[key] ?? null,
  }
}

export function useOrdersData(fallback) {
  const { data, loading, error, refresh } = useApiData()
  return {
    data: data?.orders || null,
    fallback,
    loading,
    error,
    refresh,
    get: (key) => data?.orders?.[key] ?? fallback?.[key] ?? null,
  }
}

export function useProductsData(fallback) {
  const { data, loading, error, refresh } = useApiData()
  return {
    data: data?.products || null,
    fallback,
    loading,
    error,
    refresh,
    get: (key) => data?.products?.[key] ?? fallback?.[key] ?? null,
  }
}
