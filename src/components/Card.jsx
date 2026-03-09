export default function Card({ title, children, className = '' }) {
  return (
    <div className={`bg-card rounded-xl border border-border shadow-sm ${className}`}>
      {title && (
        <div className="px-5 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-text">{title}</h3>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  )
}
