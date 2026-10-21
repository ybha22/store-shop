import { useSearchParams } from 'react-router-dom'
import { searchListings } from '../service/postService'
import { Card, PageHeader } from '../comp/ui'
import SearchBar from '../comp/SearchBar'
import ListingCard from '../comp/ListingCard'

export default function SearchPage() {
  const [params] = useSearchParams()
  const query = {
    region: params.get('region') ?? '',
    name: params.get('name') ?? '',
    category: params.get('category') ?? '',
  }
  const results = searchListings(query)
  const keywords = [query.region, query.name, query.category].filter(Boolean)

  return (
    <div>
      <PageHeader title="매물 검색" desc="지역과 점포명으로 양도 매물을 찾아보세요." />
      <Card className="mb-6 p-4">
        {/* key로 URL 변경 시 입력값 초기화 */}
        <SearchBar key={params.toString()} initial={query} />
      </Card>
      <p className="mb-4 text-sm text-slate-500">
        {keywords.length > 0 && <span className="font-medium text-slate-700">'{keywords.join(' · ')}' </span>}
        검색 결과 <span className="font-semibold text-indigo-600">{results.length}</span>건
      </p>
      {results.length === 0 ? (
        <Card className="py-20 text-center text-slate-400">조건에 맞는 매물이 없습니다.</Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((post) => (
            <ListingCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
