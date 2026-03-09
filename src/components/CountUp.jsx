import { useState, useEffect, useRef } from 'react'

export default function CountUp({ end, duration = 1200, prefix = '', suffix = '', decimals = 0 }) {
  const [value, setValue] = useState(0)
  const ref = useRef()
  useEffect(() => {
    const start = performance.now()
    const animate = (now) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(eased * end)
      if (p < 1) ref.current = requestAnimationFrame(animate)
    }
    ref.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(ref.current)
  }, [end, duration])
  const display = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString()
  return <>{prefix}{display}{suffix}</>
}
