import { motion } from 'framer-motion'

export default function Card({ title, children, className = '', delay = 0, icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`bg-white/80 backdrop-blur-xl rounded-2xl border shadow-[0_1px_12px_rgba(42,59,50,0.04)] ${className}`}
      style={{ borderColor: 'rgba(198,213,204,0.5)' }}
    >
      {title && (
        <div className="px-5 py-3.5 border-b" style={{ borderColor: 'rgba(198,213,204,0.4)' }}>
          <h3 className="text-[14px] font-semibold flex items-center gap-2" style={{ color: '#2A3B32' }}>
            {icon && <span>{icon}</span>}
            {title}
          </h3>
        </div>
      )}
      <div className="p-5">{children}</div>
    </motion.div>
  )
}
