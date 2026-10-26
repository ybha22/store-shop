import { Link } from 'react-router-dom'
import { BOARDS, CATEGORIES, CATEGORY_ICONS, formatFieldValue } from '../utils/board'
import { formatDate } from '../utils/dateUtil'
import { getAdListings, getLatestPosts, getUrgentListings } from '../service/postService'
import { Card, LinkButton } from '../comp/ui'
import SearchBar from '../comp/SearchBar'
import ListingCard, { AdBadge, UrgentBadge } from '../comp/ListingCard'
import ListingCarousel from '../comp/ListingCarousel'

function SectionTitle({ title, desc, to, controls }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">{title}</h2>
        {desc && <p className="mt-1 text-sm text-slate-500">{desc}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {to && (
          <Link to={to} className="text-sm text-slate-500 hover:text-indigo-600">
            더보기 →
          </Link>
        )}
        {controls}
      </div>
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

// 앱 다운로드 배너 (모의 버전: 스토어 링크 대신 안내 메시지)
function AppBanner() {
  const notReady = () => window.alert('상가ON 앱은 출시 준비 중입니다. 조금만 기다려 주세요!')
  return (
    <div className="flex shrink-0 items-center gap-4 rounded-2xl bg-white/15 p-4 ring-1 ring-white/25 backdrop-blur lg:w-72">
      <div className="flex h-14 w-10 shrink-0 flex-col items-center justify-between rounded-lg border-2 border-white/80 bg-white/10 py-1">
        <span className="h-0.5 w-3 rounded bg-white/80" />
        <span className="text-[10px] font-bold">
          <span className="text-amber-300">ON</span>
        </span>
        <span className="h-1 w-1 rounded-full bg-white/80" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold">상가ON 앱 다운로드</p>
        <p className="mt-0.5 text-xs text-indigo-100">새 매물 알림을 앱으로 받아보세요</p>
        <div className="mt-2 flex gap-1.5">
          <button onClick={notReady} className="rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-semibold hover:bg-black">
            App Store
          </button>
          <button onClick={notReady} className="rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-semibold hover:bg-black">
            Google Play
          </button>
        </div>
      </div>
    </div>
  )
}

// 업종 바로가기 (클릭 시 해당 업종 매물 검색)
function CategoryShortcuts() {
  return (
    <section className="grid grid-cols-3 gap-3 sm:grid-cols-6">
      {CATEGORIES.map((c) => (
        <Link
          key={c}
          to={`/search?category=${encodeURIComponent(c)}`}
          className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white py-4 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-2xl transition-colors group-hover:bg-indigo-100">
            {CATEGORY_ICONS[c]}
          </span>
          <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600">{c}</span>
        </Link>
      ))}
    </section>
  )
}

export default function HomePage() {
  const adListings = getAdListings()
  const urgentListings = getUrgentListings()
  const latest = getLatestPosts('TRANSFER', 6)
  const vacancyFields = BOARDS.vacancy.fields
  const field = (fields, key) => fields.find((f) => f.key === key)

  return (
    <div className="space-y-12">
      <section className="rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 px-6 py-10 text-white sm:px-10 sm:py-14">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold leading-snug tracking-tight sm:text-3xl">
              내 가게를 넘길 때도, 새 가게를 찾을 때도
              <br />
              상가<span className="text-amber-300">ON</span>에서 시작하세요
            </h1>
            <p className="mt-2 text-sm text-indigo-100">지역과 점포명으로 양도 매물을 바로 검색할 수 있습니다.</p>
          </div>
          <AppBanner />
        </div>
        <div className="mt-6 rounded-2xl bg-white/95 p-3 shadow-xl">
          <SearchBar large />
        </div>
      </section>

      <CategoryShortcuts />

      <section>
        {adListings.length === 0 ? (
          <>
            <SectionTitle title={<>프리미엄 매물 <AdBadge /></>} desc="상단노출 서비스를 이용 중인 추천 매물입니다." to="/search" />
            <Card className="flex flex-col items-center gap-3 py-12 text-center">
              <p className="text-sm text-slate-500">현재 상단노출 중인 매물이 없습니다.</p>
              <LinkButton to="/transfer/new" variant="secondary">매물 등록하고 상단노출 신청하기</LinkButton>
            </Card>
          </>
        ) : (
          <ListingCarousel
            posts={adListings}
            renderControls={(controls) => (
              <SectionTitle
                title={<>프리미엄 매물 <AdBadge /></>}
                desc={`상단노출 서비스를 이용 중인 추천 매물 ${adListings.length}개입니다.`}
                to="/search"
                controls={controls}
              />
            )}
          />
        )}
      </section>

      {urgentListings.length > 0 && (
        <section>
          <ListingCarousel
            posts={urgentListings}
            renderControls={(controls) => (
              <SectionTitle
                title={<>급매 매물 <UrgentBadge /></>}
                desc="빠르게 양도를 원하는 매물입니다. 조건이 좋은 매물을 놓치지 마세요."
                to="/search"
                controls={controls}
              />
            )}
          />
        </section>
      )}

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
