import { Link } from 'react-router-dom'
import { BOARDS, formatFieldValue } from '../utils/board'
import { formatDate } from '../utils/dateUtil'
import { getAdListings, getLatestPosts } from '../service/postService'
import { Card, LinkButton } from '../comp/ui'
import SearchBar from '../comp/SearchBar'
import ListingCard, { AdBadge } from '../comp/ListingCard'

function SectionTitle({ title, desc, to }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">{title}</h2>
        {desc && <p className="mt-1 text-sm text-slate-500">{desc}</p>}
      </div>
      {to && (
        <Link to={to} className="shrink-0 text-sm text-slate-500 hover:text-indigo-600">
          더보기 →
        </Link>
      )}
    </div>
  )
}

function MiniBoard({ boardKey, extra }) {
  const info = BOARDS[boardKey]
  const posts = getLatestPosts(info.type, 4)
  return (
    <Card className="p-5">
      <SectionTitle title={info.label} to={`/${boardKey}`} />
      {posts.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">등록된 글이 없습니다.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {posts.map((post) => (
            <li key={post.id}>
              <Link to={`/${boardKey}/${post.id}`} className="flex items-center gap-3 py-2.5 hover:text-indigo-600">
                {post.images?.[0] && (
                  <img src={post.images[0]} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-slate-800">{post.title}</span>
                  <span className="block truncate text-xs text-slate-400">{extra(post)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

export default function HomePage() {
  const adListings = getAdListings()
  const latest = getLatestPosts('TRANSFER', 6)
  const vacancyFields = BOARDS.vacancy.fields
  const field = (fields, key) => fields.find((f) => f.key === key)

  return (
    <div className="space-y-12">
      <section className="rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 px-6 py-10 text-white sm:px-10 sm:py-14">
        <h1 className="text-2xl font-bold leading-snug tracking-tight sm:text-3xl">
          내 가게를 넘길 때도, 새 가게를 찾을 때도
          <br />
          상가<span className="text-amber-300">ON</span>에서 시작하세요
        </h1>
        <p className="mt-2 text-sm text-indigo-100">지역과 점포명으로 양도 매물을 바로 검색할 수 있습니다.</p>
        <div className="mt-6 rounded-2xl bg-white/95 p-3 shadow-xl">
          <SearchBar large />
        </div>
      </section>

      <section>
        <SectionTitle
          title={<>프리미엄 매물 <AdBadge /></>}
          desc="상단노출 서비스를 이용 중인 추천 매물입니다."
          to="/search"
        />
        {adListings.length === 0 ? (
          <Card className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-sm text-slate-500">현재 상단노출 중인 매물이 없습니다.</p>
            <LinkButton to="/transfer/new" variant="secondary">매물 등록하고 상단노출 신청하기</LinkButton>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {adListings.map((post) => (
              <ListingCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionTitle title="최신 매물" desc="방금 등록된 양도 매물입니다." to="/search" />
        {latest.length === 0 ? (
          <Card className="py-12 text-center text-sm text-slate-400">등록된 매물이 없습니다.</Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((post) => (
              <ListingCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <MiniBoard
          boardKey="vacancy"
          extra={(p) =>
            [p.region, formatFieldValue(field(vacancyFields, 'area'), p.area), `월세 ${formatFieldValue(field(vacancyFields, 'monthlyRent'), p.monthlyRent)}`]
              .filter(Boolean)
              .join(' · ')
          }
        />
        <MiniBoard
          boardKey="market"
          extra={(p) =>
            [p.status, formatFieldValue(field(BOARDS.market.fields, 'price'), p.price), p.region, formatDate(p.createdAt)]
              .filter(Boolean)
              .join(' · ')
          }
        />
      </section>
    </div>
  )
}
