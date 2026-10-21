import { Link, Navigate, useParams } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import { BOARDS, canWriteBoard, formatFieldValue } from '../utils/board'
import { formatDate } from '../utils/dateUtil'
import { getPosts, isAdActive } from '../service/postService'
import { AdBadge } from '../comp/ListingCard'
import { countComments } from '../service/commentService'
import { Card, LinkButton, PageHeader, StatusBadge } from '../comp/ui'

export default function BoardListPage() {
  const { board } = useParams()
  const info = BOARDS[board]
  const user = useAuthStore((s) => s.user)
  if (!info) return <Navigate to="/" replace />

  const posts = getPosts(info.type)
  const columns = info.listColumns.map((key) => info.fields.find((f) => f.key === key))
  // 비로그인은 글쓰기 클릭 시 로그인으로 이동, 로그인 회원은 작성 권한이 있을 때만 노출
  const showWrite = !user || canWriteBoard(info, user)

  return (
    <div>
      <PageHeader
        title={info.label}
        desc={info.desc}
        action={showWrite && <LinkButton to={`/${board}/new`}>{info.writeLabel ?? '글쓰기'}</LinkButton>}
      />
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="w-16 px-4 py-3 font-medium">번호</th>
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
                  등록된 게시글이 없습니다.
                </td>
              </tr>
            )}
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-400">{post.id}</td>
                <td className="px-4 py-3">
                  {info.ads && isAdActive(post) && <AdBadge className="mr-1.5" />}
                  <Link to={`/${board}/${post.id}`} className="font-medium text-slate-800 hover:text-indigo-600">
                    {post.title}
                  </Link>
                  {info.comments && countComments(post.id) > 0 && (
                    <span className="ml-1.5 text-xs font-semibold text-indigo-600">[{countComments(post.id)}]</span>
                  )}
                </td>
                {columns.map((col) => (
                  <td key={col.key} className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {col.key === 'status' && post.status ? (
                      <StatusBadge status={post.status} />
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
    </div>
  )
}
