import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import { NAV_MENUS } from '../utils/board'
import { LinkButton, Logo, RoleBadge } from './ui'
import Footer from './Footer'

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
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 pt-3">
          <NavLink to="/">
            <Logo className="text-xl" />
          </NavLink>
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
              <>
                <LinkButton to="/signup" variant="secondary" className="px-3 py-1.5">
                  회원가입
                </LinkButton>
                <LinkButton to="/login" state={{ from: location.pathname }} className="px-3 py-1.5">
                  로그인
                </LinkButton>
              </>
            )}
          </div>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 py-2">
          {NAV_MENUS.map((menu) => (
            <NavLink key={menu.to} to={menu.to} className={(s) => `${menuClass(s)} shrink-0`}>
              {menu.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
