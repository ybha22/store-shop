import { Link } from 'react-router-dom'
import { formatMoney } from '../utils/numberUtil'
import { isAdActive } from '../service/postService'

const num = (v) => (v === null || v === undefined ? '-' : Number(v).toLocaleString())

export function AdBadge({ className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-bold text-amber-950 ${className}`}>
      프리미엄
    </span>
  )
}

export default function ListingCard({ post }) {
  const ad = isAdActive(post)
  const sizeInfo = [post.area != null && `${post.area}평`, post.floor].filter(Boolean).join(' · ')

  return (
    <Link
      to={`/transfer/${post.id}`}
      className={`group block overflow-hidden rounded-2xl border bg-white transition hover:-translate-y-0.5 hover:shadow-lg ${
        ad ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {post.images?.[0] ? (
          <img src={post.images[0]} alt={post.storeName ?? post.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">사진 없음</div>
        )}
        {ad && <AdBadge className="absolute left-3 top-3 shadow" />}
        {post.category && (
          <span className="absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-0.5 text-xs font-medium text-white">
            {post.category}
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="truncate text-xs text-slate-400">{post.region ?? '지역 미입력'}</p>
        <h3 className="mt-0.5 truncate font-semibold text-slate-900">{post.storeName ?? post.title}</h3>
        <p className="mt-0.5 truncate text-xs text-slate-500">{post.title}</p>
        <div className="mt-3 flex items-end justify-between gap-2 border-t border-slate-100 pt-3">
          <div className="text-xs text-slate-500">
            <p>보증금/월세</p>
            <p className="mt-0.5 font-medium text-slate-700">
              {num(post.deposit)} / {num(post.monthlyRent)}
            </p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p>권리금</p>
            <p className="mt-0.5 text-sm font-bold text-indigo-600">{formatMoney(post.premium)}</p>
          </div>
        </div>
        {sizeInfo && <p className="mt-2 text-xs text-slate-400">{sizeInfo}</p>}
      </div>
    </Link>
  )
}
