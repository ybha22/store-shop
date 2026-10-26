import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import { BOARDS, applyFilters, canWriteBoard, formatFieldValue, listingNo } from '../utils/board'
import { formatDate } from '../utils/dateUtil'
import { getPosts, isAdActive } from '../service/postService'
import { AdBadge, UrgentBadge } from '../comp/ListingCard'
import Pagination from '../comp/Pagination'
import { usePage } from '../utils/usePage'
import { countComments } from '../service/commentService'
import { Card, LinkButton, PageHeader, StatusBadge } from '../comp/ui'
import BoardFilter from '../comp/BoardFilter'
import FaqList from '../comp/FaqList'

const PAGE_SIZE = 10

export default function BoardListPage() {
  const { board } = useParams()
  const info = BOARDS[board]
  const user = useAuthStore((s) => s.user)
  const [params] = useSearchParams()
  if (!info) return <Navigate to="/" replace />

  const posts = applyFilters(getPosts(info.type), info.filters, Object.fromEntries(params))
  const { page, totalPages, items } = usePage(posts, PAGE_SIZE)
  const columns = info.listColumns.map((key) => info.fields.find((f) => f.key === key))
  // 비로그인은 글쓰기 클릭 시 로그인으로 이동, 로그인 회원은 작성 권한이 있을 때만 노출
  // (자주묻는 질문은 운영자 전용이라 비로그인에게 노출하지 않음)
  const showWrite = user ? canWriteBoard(info, user) : info.display !== 'faq'

  return (
    <div>
      <PageHeader
        title={info.label}
        desc={info.desc}
        action={showWrite && <LinkButton to={`/${board}/new`}>{info.writeLabel ?? '글쓰기'}</LinkButton>}
      />
      {info.display === 'faq' ? (
        <FaqList key={board} board={board} posts={posts} categories={info.fields[0].options} />
      ) : (
      <>
      {info.filters && <BoardFilter key={board} filters={info.filters} />}
      {info.filters && (
        <p className="mb-3 text-sm text-slate-500">
          검색 결과 <span className="font-semibold text-indigo-600">{posts.length}</span>건
        </p>
      )}
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className={`${info.ads ? 'w-24' : 'w-16'} px-4 py-3 font-medium`}>{info.ads ? '매물번호' : '번호'}</th>
              <th className="px-4 py-3 font-medium">제목</th>
              {columns.map((col) => (
                <th key={col.key} className="whitespace-nowrap px-4 py-3 font-medium">{col.label}</th>
              ))}
              <th className="w-28 px-4 py-3 font-medium">글쓴이</th>
              <th className="w-20 px-4 py-3 text-right font-medium">조회</th>
              <th className="w-28 px-4 py-3 font-medium">등록일</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && (
              <tr>
                <td colSpan={5 + columns.length} className="px-4 py-16 text-center text-slate-400">
                  {params.size > 0 ? '조건에 맞는 게시글이 없습니다.' : '등록된 게시글이 없습니다.'}
                </td>
              </tr>
            )}
            {items.map((post) => (
              <tr key={post.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-400">{info.ads ? listingNo(post) : post.id}</td>
                <td className="px-4 py-3">
                  {info.ads && isAdActive(post) && <AdBadge className="mr-1.5" />}
                  {post.urgent && post.dealStatus !== '거래완료' && <UrgentBadge className="mr-1.5" />}
                  <Link to={`/${board}/${post.id}`} className="font-medium text-slate-800 hover:text-indigo-600">
                    {post.title}
                  </Link>
                  {info.comments && countComments(post.id) > 0 && (
                    <span className="ml-1.5 text-xs font-semibold text-indigo-600">[{countComments(post.id)}]</span>
                  )}
                </td>
                {columns.map((col) => (
                  <td key={col.key} className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {col.badge ? (
                      <StatusBadge status={post[col.key] ?? col.default} />
                    ) : (
                      formatFieldValue(col, post[col.key])
                    )}
                  </td>
                ))}
                <td className="px-4 py-3 text-slate-600">{post.writerName}</td>
                <td className="px-4 py-3 text-right text-slate-500">{post.views}</td>
                <td className="px-4 py-3 text-slate-500">{formatDate(post.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Pagination page={page} totalPages={totalPages} />
      </>
      )}
    </div>
  )
}
