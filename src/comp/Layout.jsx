import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import { LinkButton, RoleBadge } from './ui'

const menuClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm transition-colors ${
    isActive ? 'bg-indigo-50 font-semibold text-indigo-700' : 'text-slate-600 hover:text-slate-900'
  }`

export default function Layout() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-6">
            <NavLink to="/transfer" className="text-lg font-bold tracking-tight text-slate-900">
              Store<span className="text-indigo-600">Shop</span>
            </NavLink>
            <nav className="flex gap-1">
              <NavLink to="/transfer" className={menuClass}>가게양도</NavLink>
              <NavLink to="/takeover" className={menuClass}>가게양수</NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <NavLink to="/members" className={menuClass}>회원관리</NavLink>
            {user ? (
              <>
                <span className="hidden items-center gap-2 text-slate-600 sm:flex">
                  <span className="font-medium text-slate-800">{user.name}</span>
                  <RoleBadge role={user.role} />
                </span>
                <button onClick={handleLogout} className="text-slate-500 hover:text-slate-900">
                  로그아웃
                </button>
              </>
            ) : (
              <LinkButton to="/login" state={{ from: location.pathname }} className="px-3 py-1.5">
                로그인
              </LinkButton>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
