import React from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { setAuthToken, useDashboardStore } from '../../context/DashboardStore'

const nav = [
  { to: '/dashboard/properties', label: 'Properties' },
  { to: '/dashboard/testimonials', label: 'Testimonials' },
  { to: '/dashboard/locations', label: 'Locations / Areas' },
  { to: '/dashboard/featured', label: 'Featured Properties' },
  { to: '/dashboard/developers', label: 'Developers / Promoters' },
  { to: '/dashboard/download-leads', label: 'Download Leads' },
  { to: '/dashboard/contact', label: 'Contact Info' },
  { to: '/dashboard/social', label: 'Social Media' },
]

export default function DashboardLayout() {
  const navigate = useNavigate()
  const { resetToDefaults } = useDashboardStore()

  const handleLogout = () => {
    setAuthToken(null)
    navigate('/dashboard/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex">
      <aside className="w-56 sm:w-64 bg-[#262626] text-white shrink-0 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <h1 className="font-bold text-lg">Next Prime</h1>
          <p className="text-xs text-white/70">Dashboard</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {nav.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  isActive ? 'bg-[#B8862E] text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <a href="/" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-white/70 hover:text-white cursor-pointer">
            View site →
          </a>
          <button
            type="button"
            onClick={() => window.confirm('Reset all CMS data to defaults?') && resetToDefaults()}
            className="w-full mt-2 px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 cursor-pointer"
          >
            Reset to defaults
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full mt-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white cursor-pointer"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  )
}
