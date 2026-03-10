// Ranking & Competitors formatting helpers
// Data fetching is now handled by useApiData (unified 6-endpoint fetch)

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
