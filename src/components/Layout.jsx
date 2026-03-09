import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: '종합 현황', icon: '📊' },
  { to: '/sales', label: '매출 분석', icon: '💰' },
  { to: '/inventory', label: '재고 현황', icon: '📦' },
  { to: '/orders', label: '주문/CS', icon: '🎧' },
]

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white px-6 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight">D.CURVIN AI</h1>
          <span className="text-xs bg-accent text-primary px-2 py-0.5 rounded-full font-semibold">DASHBOARD</span>
        </div>
        <span className="text-sm text-blue-200">2026년 3월 9일 (일)</span>
      </header>

      {/* Nav */}
      <nav className="bg-white border-b border-border px-6">
        <div className="flex gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-secondary hover:text-primary hover:border-primary/30'
                }`
              }
            >
              <span className="mr-1.5">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 p-6 max-w-[1400px] w-full mx-auto">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-text-secondary py-3 border-t border-border">
        D.CURVIN AI Dashboard &copy; 2026 &middot; Powered by AI Analytics
      </footer>
    </div>
  )
}
