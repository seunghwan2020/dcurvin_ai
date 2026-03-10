// Ranking & Competitors API hooks
import { useState, useEffect, useCallback, useRef } from 'react'

const BASE_URL = 'https://primary-production-44bb2.up.railway.app/webhook/dcurvin-dashboard'
const REFRESH_INTERVAL = 5 * 60 * 1000 // 5 minutes

async function fetchWithTimeout(url, timeoutMs = 10000) {
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

// ── Ranking Hook ──
export function useRankingData() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const intervalRef = useRef(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const json = await fetchWithTimeout(`${BASE_URL}?type=ranking`)
      if (json?.success && Array.isArray(json.data)) {
        setData(json.data)
      } else if (Array.isArray(json)) {
        setData(json)
      } else {
        throw new Error('Invalid ranking response')
      }
    } catch (e) {
      console.warn('[Ranking] Fetch failed:', e.message)
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
    intervalRef.current = setInterval(refresh, REFRESH_INTERVAL)
    return () => clearInterval(intervalRef.current)
  }, [refresh])

  return { data, loading, error, refresh }
}

// ── Competitors Hook ──
export function useCompetitorsData() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const intervalRef = useRef(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const json = await fetchWithTimeout(`${BASE_URL}?type=competitors`)
      if (json?.success && json.data) {
        setData(json.data)
      } else if (Array.isArray(json)) {
        setData(json)
      } else if (json?.data) {
        setData(json.data)
      } else {
        throw new Error('Invalid competitors response')
      }
    } catch (e) {
      console.warn('[Competitors] Fetch failed:', e.message)
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
    intervalRef.current = setInterval(refresh, REFRESH_INTERVAL)
    return () => clearInterval(intervalRef.current)
  }, [refresh])

  return { data, loading, error, refresh }
}

// ── Formatting helpers ──

// Format revenue to 만원 unit: 4950000 → "495만원"
export function formatManwon(value) {
  const num = typeof value === 'string' ? Number(value.replace(/[^0-9.-]/g, '')) : Number(value)
  if (!num || isNaN(num)) return '0원'
  if (num >= 100000000) return `${(num / 100000000).toFixed(1)}억원`
  if (num >= 10000) return `${Math.round(num / 10000)}만원`
  return `${num.toLocaleString()}원`
}

// Rank badge
export function getRankBadge(rank) {
  if (rank === 1) return { emoji: '🥇', color: '#D4A017' }
  if (rank === 2) return { emoji: '🥈', color: '#A0A0A0' }
  if (rank === 3) return { emoji: '🥉', color: '#CD7F32' }
  return { emoji: '', color: '#7A9B88' }
}
