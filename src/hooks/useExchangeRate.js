// Exchange Rate Service — CNY→KRW
// Dual API fallback + 7-day localStorage cache + last update time

import { useState, useEffect, useCallback } from 'react'

const ER_APIS = [
  'https://api.exchangerate-api.com/v4/latest/CNY',
  'https://open.er-api.com/v6/latest/CNY',
]
const STORAGE_KEY = 'dcurvin_exchange_rate'
const ONE_DAY = 24 * 60 * 60 * 1000
const FALLBACK_RATE = 213.61

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
  } catch { /* ignore */ }
}

async function tryFetchRate(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 6000)
  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    const krw = json?.rates?.KRW
    if (typeof krw !== 'number' || krw <= 0) throw new Error('Invalid KRW rate')
    return krw
  } finally {
    clearTimeout(timer)
  }
}

// Try APIs in order: 1차 → 2차 → fallback
async function fetchCurrentRate() {
  for (const url of ER_APIS) {
    try {
      return { rate: await tryFetchRate(url), source: url, success: true }
    } catch (e) {
      console.warn(`[ExchangeRate] ${url} failed:`, e.message)
    }
  }
  return { rate: FALLBACK_RATE, source: null, success: false }
}

async function getExchangeData() {
  const cache = loadCache() || { history: [], lastFetchDate: null, lastUpdateTime: null }
  const today = getTodayStr()

  // Already fetched today → return cache
  if (cache.lastFetchDate === today && cache.history.length > 0) {
    return buildResult(cache)
  }

  // Fetch from API
  const { rate, source, success } = await fetchCurrentRate()

  const history = cache.history.filter(h => h.date !== today)
  history.push({ date: today, rate: Math.round(rate * 100) / 100 })
  const sorted = history.sort((a, b) => a.date.localeCompare(b.date)).slice(-7)

  const newCache = {
    history: sorted,
    lastFetchDate: today,
    currentRate: rate,
    lastUpdateTime: new Date().toISOString(),
    source,
    fetchSuccess: success,
  }
  saveCache(newCache)
  return buildResult(newCache)
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

  // Format last update time
  let lastUpdateLabel = ''
  if (cache.lastUpdateTime) {
    const t = new Date(cache.lastUpdateTime)
    lastUpdateLabel = `${t.getMonth() + 1}/${t.getDate()} ${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0')} 업데이트`
  }

  return {
    label: '위안화 (CNY→KRW)',
    current: Math.round(current * 10) / 10,
    previous: Math.round(previous * 10) / 10,
    change: Math.abs(change),
    direction,
    weekly,
    isLive: cache.fetchSuccess !== false,
    lastUpdateLabel,
    fetchFailed: cache.fetchSuccess === false,
  }
}

export function useExchangeRate() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getExchangeData()
      setData(result)
    } catch {
      setData({
        label: '위안화 (CNY→KRW)',
        current: FALLBACK_RATE,
        previous: FALLBACK_RATE,
        change: 0,
        direction: 'up',
        weekly: [],
        isLive: false,
        lastUpdateLabel: '업데이트 실패',
        fetchFailed: true,
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { data, loading, refresh }
}
