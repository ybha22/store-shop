import { useSearchParams } from 'react-router-dom'

// 페이지 번호 버튼 (다른 검색 조건 쿼리는 유지)
export default function Pagination({ page, totalPages }) {
  const [params, setParams] = useSearchParams()
  if (totalPages <= 1) return null

  const go = (p) => {
    const next = new URLSearchParams(params)
    if (p === 1) next.delete('page')
    else next.set('page', String(p))
    setParams(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const btn = 'flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm transition-colors'

  return (
    <nav className="mt-8 flex items-center justify-center gap-1" aria-label="페이지 이동">
      <button
        className={`${btn} text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent`}
        disabled={page === 1}
        onClick={() => go(page - 1)}
      >
        ‹ 이전
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => go(p)}
          className={`${btn} ${p === page ? 'bg-indigo-600 font-semibold text-white' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          {p}
        </button>
      ))}
      <button
        className={`${btn} text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent`}
        disabled={page === totalPages}
        onClick={() => go(page + 1)}
      >
        다음 ›
      </button>
    </nav>
  )
}
