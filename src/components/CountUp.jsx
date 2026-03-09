import { useState, useEffect, useRef } from 'react'

export default function CountUp({ end, duration = 1500, prefix = '', suffix = '', format = true }) {
  const [value, setValue] = useState(0)
  const ref = useRef()

  useEffect(() => {
    const startTime = performance.now()
    const animate = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * end))
      if (progress < 1) {
        ref.current = requestAnimationFrame(animate)
      }
    }
    ref.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(ref.current)
  }, [end, duration])

  const formatted = format ? value.toLocaleString() : value
  return <>{prefix}{formatted}{suffix}</>
}
