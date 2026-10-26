import { Link } from 'react-router-dom'
import { ROLES } from '../utils/board'

const VARIANTS = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50',
  danger: 'bg-white text-rose-600 border border-rose-200 hover:bg-rose-50',
}

const base =
  'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50'

export function Button({ variant = 'primary', className = '', ...props }) {
  return <button className={`${base} ${VARIANTS[variant]} ${className}`} {...props} />
}

export function LinkButton({ variant = 'primary', className = '', ...props }) {
  return <Link className={`${base} ${VARIANTS[variant]} ${className}`} {...props} />
}

export function Card({ className = '', children }) {
  return <div className={`rounded-2xl border border-slate-200 bg-white ${className}`}>{children}</div>
}

export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  )
}

export const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100 disabled:text-slate-500'

export function PageHeader({ title, desc, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        {desc && <p className="mt-1 text-sm text-slate-500">{desc}</p>}
      </div>
      {action}
    </div>
  )
}

const ROLE_STYLES = {
  ADMIN: 'bg-indigo-50 text-indigo-700',
  REALTOR: 'bg-emerald-50 text-emerald-700',
  USER: 'bg-slate-100 text-slate-600',
}

export function RoleBadge({ role }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_STYLES[role] ?? ROLE_STYLES.USER}`}>
      {ROLES[role] ?? ROLES.USER}
    </span>
  )
}

const STATUS_STYLES = {
  판매중: 'bg-emerald-50 text-emerald-700',
  예약중: 'bg-amber-50 text-amber-700',
  판매완료: 'bg-slate-100 text-slate-500',
  거래가능: 'bg-emerald-50 text-emerald-700',
  계약중: 'bg-amber-50 text-amber-700',
  거래완료: 'bg-slate-100 text-slate-500',
}

export function StatusBadge({ status }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status] ?? STATUS_STYLES.판매완료}`}>
      {status}
    </span>
  )
}

export function Logo({ className = '' }) {
  return (
    <span className={`font-bold tracking-tight text-slate-900 ${className}`}>
      상가<span className="text-indigo-600">ON</span>
    </span>
  )
}
