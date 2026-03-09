import { motion } from 'framer-motion'

export default function Card({ title, children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm ${className}`}
    >
      {title && (
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      <div className="p-5">{children}</div>
    </motion.div>
  )
}
