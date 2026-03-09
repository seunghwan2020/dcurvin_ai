import { motion } from 'framer-motion'

export default function Card({ title, children, className = '', delay = 0, icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`bg-white/70 backdrop-blur-2xl rounded-3xl border border-white/80 shadow-[0_2px_20px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.02)] ${className}`}
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-100/60">
          <h3 className="text-[13px] font-semibold text-gray-800 flex items-center gap-2">
            {icon && <span>{icon}</span>}
            {title}
          </h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </motion.div>
  )
}
