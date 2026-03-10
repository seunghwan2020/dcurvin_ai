// Exchange Rate Service — CNY→KRW via open.er-api.com
// 7-day history cached in localStorage, refreshed once daily

import { useState, useEffect, useCallback } from 'react'

const ER_API_URL = 'https://open.er-api.com/v6/latest/CNY'
const STORAGE_KEY = 'dcurvin_exchange_rate'
const ONE_DAY = 24 * 60 * 60 * 1000

const FALLBACK_RATE = 195.0

function getTodayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function getDateLabel(dateStr) {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

function loadCache() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveCache(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // localStorage full or unavailable
  }
}

async function fetchCurrentRate() {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 8000)
  try {
    const res = await fetch(ER_API_URL, { signal: controller.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    const krw = json?.rates?.KRW
    if (typeof krw !== 'number' || krw <= 0) throw new Error('Invalid KRW rate')
    return krw
  } finally {
    clearTimeout(timer)
  }
}

// Get cached data + fetch if needed, updating 7-day history
async function getExchangeData() {
  const cache = loadCache() || { history: [], lastFetchDate: null }
  const today = getTodayStr()

  // Already fetched today → return cache
  if (cache.lastFetchDate === today && cache.history.length > 0) {
    return buildResult(cache)
  }

  // Need to fetch
  try {
    const rate = await fetchCurrentRate()

    // Add today's rate if not already present
    const history = cache.history.filter(h => h.date !== today)
    history.push({ date: today, rate: Math.round(rate * 100) / 100 })

    // Keep only last 7 days
    const sorted = history.sort((a, b) => a.date.localeCompare(b.date)).slice(-7)

    const newCache = { history: sorted, lastFetchDate: today, currentRate: rate }
    saveCache(newCache)
    return buildResult(newCache)
  } catch (e) {
    console.warn('[ExchangeRate] Fetch failed:', e.message)
    // Return cache if available, else fallback
    if (cache.history.length > 0) {
      return buildResult(cache)
    }
    return buildFallback()
  }
}

function buildResult(cache) {
  const history = cache.history
  const current = cache.currentRate || history[history.length - 1]?.rate || FALLBACK_RATE
  const previous = history.length >= 2 ? history[history.length - 2].rate : current
  const change = previous > 0 ? Math.round(((current - previous) / previous) * 10000) / 100 : 0
  const direction = current >= previous ? 'up' : 'down'

  const weekly = history.map(h => ({
    date: getDateLabel(h.date),
    rate: h.rate,
  }))

  return {
    label: '위안화 (CNY→KRW)',
    current: Math.round(current * 10) / 10,
    previous: Math.round(previous * 10) / 10,
    change: Math.abs(change),
    direction,
    weekly,
    isLive: true,
  }
}

function buildFallback() {
  const today = new Date()
  const weekly = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today.getTime() - (6 - i) * ONE_DAY)
    return {
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      rate: FALLBACK_RATE + (Math.random() - 0.5) * 3,
    }
  })

  return {
    label: '위안화 (CNY→KRW)',
    current: FALLBACK_RATE,
    previous: FALLBACK_RATE,
    change: 0,
    direction: 'up',
    weekly,
    isLive: false,
  }
}

// React hook
export function useExchangeRate() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getExchangeData()
      setData(result)
    } catch {
      setData(buildFallback())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { data, loading, refresh }
}
