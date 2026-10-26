import { useSearchParams } from 'react-router-dom'
import { LISTING_FILTERS, LISTING_SORTS } from '../utils/board'
import { searchListings } from '../service/postService'
import { Card, PageHeader, inputClass } from '../comp/ui'
import SearchBar from '../comp/SearchBar'
import ListingCard from '../comp/ListingCard'
import Pagination from '../comp/Pagination'
import { usePage } from '../utils/usePage'

const PAGE_SIZE = 9
const DETAIL_KEYS = LISTING_FILTERS.map((f) => f.key)

export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const query = Object.fromEntries(params)
  const results = searchListings(query)
  const { page, totalPages, items } = usePage(results, PAGE_SIZE)
  const keywords = [query.region, query.name, query.category].filter(Boolean)
  const hasDetail = DETAIL_KEYS.some((k) => params.get(k))

  // 상세 조건/정렬은 선택 즉시 적용 (페이지는 1로)
  const setParam = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('page')
    setParams(next)
  }

  const resetDetail = () => {
    const next = new URLSearchParams(params)
    DETAIL_KEYS.forEach((k) => next.delete(k))
    next.delete('page')
    setParams(next)
  }

  return (
    <div>
      <PageHeader title="매물 검색" desc="지역·점포명·업종과 상세 조건으로 양도 매물을 찾아보세요." />
      <Card className="mb-6 divide-y divide-slate-100">
        <div className="p-4">
          {/* key로 URL 변경 시 입력값 초기화 */}
          <SearchBar key={`${query.region}|${query.name}|${query.category}`} initial={query} baseParams={params} />
        </div>
        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-[repeat(5,1fr)_auto]">
          {LISTING_FILTERS.map((f) => (
            <label key={f.key} className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500">{f.label}</span>
              <select className={inputClass} value={query[f.key] ?? ''} onChange={(e) => setParam(f.key, e.target.value)}>
                <option value="">전체</option>
                {f.ranges.map((r, i) => (
                  <option key={r.label} value={i}>{r.label}</option>
                ))}
              </select>
            </label>
          ))}
          <div className="flex items-end">
            <button
              type="button"
              onClick={resetDetail}
              disabled={!hasDetail}
              className="h-[38px] w-full rounded-lg px-3 text-sm text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent"
            >
              조건 초기화
            </button>
          </div>
        </div>
      </Card>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {keywords.length > 0 && <span className="font-medium text-slate-700">'{keywords.join(' · ')}' </span>}
          검색 결과 <span className="font-semibold text-indigo-600">{results.length}</span>건
        </p>
        <select
          className={`${inputClass} w-auto`}
          value={query.sort ?? ''}
          onChange={(e) => setParam('sort', e.target.value)}
          aria-label="정렬"
        >
          {LISTING_SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {results.length === 0 ? (
        <Card className="py-20 text-center text-slate-400">조건에 맞는 매물이 없습니다.</Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((post) => (
            <ListingCard key={post.id} post={post} />
          ))}
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} />
    </div>
  )
}
