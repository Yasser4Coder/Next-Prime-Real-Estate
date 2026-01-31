import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { setAuthToken } from '../../context/DashboardStore'
import * as api from '../../api/client'

const DEFAULT_PASSWORD = 'admin123'
const DEFAULT_USER = 'admin'
const useApi = () => !!import.meta.env.VITE_API_URL

export default function Login() {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard/properties'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (useApi()) {
      setLoading(true)
      try {
        await api.login(user || 'admin', password)
        toast.success('Signed in successfully')
        navigate(from, { replace: true })
      } catch (err) {
        const msg = err.message || 'Invalid credentials'
        setError(msg)
        toast.error(msg)
      } finally {
        setLoading(false)
      }
    } else {
      if (password === DEFAULT_PASSWORD && (user === DEFAULT_USER || !user.trim())) {
        setAuthToken('logged-in')
        navigate(from, { replace: true })
      } else {
        const msg = 'Invalid credentials. Default: admin / admin123'
        setError(msg)
        toast.error(msg)
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-[#e1e1e1] p-6 sm:p-8">
        <h1 className="text-xl font-bold text-[#262626] mb-1">Dashboard</h1>
        <p className="text-sm text-[#717171] mb-6">Next Prime Real Estate</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="user" className="block text-sm font-medium text-[#262626] mb-1">Username</label>
            <input
              id="user"
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="admin"
              className="w-full px-4 py-2.5 rounded-xl border border-[#e1e1e1] text-[#262626] focus:border-[#B8862E] focus:ring-2 focus:ring-[#B8862E]/20 outline-none"
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#262626] mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-[#e1e1e1] text-[#262626] focus:border-[#B8862E] focus:ring-2 focus:ring-[#B8862E]/20 outline-none"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#B8862E] text-white font-medium hover:bg-[#A67C2A] transition-colors cursor-pointer disabled:opacity-70"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-4 text-xs text-[#999]">
          {useApi() ? 'Use your dashboard email and password.' : 'Default: admin / admin123'}
        </p>
      </div>
    </div>
  )
}
