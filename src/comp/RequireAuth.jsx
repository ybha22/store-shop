import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../stores/authStore'

export default function RequireAuth({ adminOnly = false, children }) {
  const user = useAuthStore((s) => s.user)
  const location = useLocation()
  // 로그인 후 원래 보려던 페이지로 돌아가도록 현재 경로 전달
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/members" replace />
  return children
}
