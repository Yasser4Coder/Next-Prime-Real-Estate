import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getAuthToken } from '../../context/DashboardStore'

export default function ProtectedRoute({ children }) {
  const location = useLocation()
  const token = getAuthToken()
  if (!token) {
    return <Navigate to="/dashboard/login" state={{ from: location }} replace />
  }
  return children
}
