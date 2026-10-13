import { Link, Navigate, useParams } from 'react-router-dom'
import { BOARDS } from '../utils/board'
import { formatDate } from '../utils/dateUtil'
import { getPosts } from '../service/postService'
import { Card, LinkButton, PageHeader } from '../comp/ui'

export default function BoardListPage() {
  const { board } = useParams()
  const info = BOARDS[board]
  if (!info) return <Navigate to="/transfer" replace />

  const posts = getPosts(info.type)

  return (
    <div>
      <PageHeader
        title={info.label}
        desc={info.desc}
        action={<LinkButton to={`/${board}/new`}>글쓰기</LinkButton>}
      />
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="w-16 px-4 py-3 font-medium">번호</th>
              <th className="px-4 py-3 font-medium">제목</th>
              <th className="w-28 px-4 py-3 font-medium">글쓴이</th>
              <th className="w-20 px-4 py-3 text-right font-medium">조회</th>
              <th className="w-28 px-4 py-3 font-medium">등록일</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-16 text-center text-slate-400">
                  등록된 게시글이 없습니다.
                </td>
              </tr>
            )}
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-400">{post.id}</td>
                <td className="px-4 py-3">
                  <Link to={`/${board}/${post.id}`} className="font-medium text-slate-800 hover:text-indigo-600">
                    {post.title}
                  </Link>
                </td>
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
