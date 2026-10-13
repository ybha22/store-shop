import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import { BOARDS } from '../utils/board'
import { formatDateTime } from '../utils/dateUtil'
import { formatCount, formatMoney } from '../utils/numberUtil'
import { canEditPost, deletePost, increaseViews } from '../service/postService'
import { Button, Card, LinkButton } from '../comp/ui'

export default function BoardDetailPage() {
  const { board, id } = useParams()
  const info = BOARDS[board]
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const [post, setPost] = useState(undefined)

  useEffect(() => {
    setPost(increaseViews(id))
  }, [id])

  if (!info) return <Navigate to="/transfer" replace />
  if (post === undefined) return null
  if (!post || post.boardType !== info.type) {
    return <p className="py-16 text-center text-slate-500">게시글을 찾을 수 없습니다.</p>
  }

  const handleDelete = () => {
    if (!window.confirm('게시글을 삭제하시겠습니까?')) return
    deletePost(post.id)
    navigate(`/${board}`)
  }

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-indigo-600">{info.label}</p>
      <Card>
        <div className="border-b border-slate-100 p-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{post.title}</h1>
          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-500">
            <div className="flex gap-1.5"><dt>글쓴이</dt><dd className="text-slate-700">{post.writerName}</dd></div>
            <div className="flex gap-1.5"><dt>조회수</dt><dd className="text-slate-700">{post.views}</dd></div>
            <div className="flex gap-1.5"><dt>등록일</dt><dd className="text-slate-700">{formatDateTime(post.createdAt)}</dd></div>
            <div className="flex gap-1.5"><dt>수정일</dt><dd className="text-slate-700">{formatDateTime(post.updatedAt)}</dd></div>
          </dl>
        </div>
        <dl className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 text-center">
          {[
            ['권리금', formatMoney(post.premium)],
            ['월세', formatMoney(post.monthlyRent)],
            ['주차가능대수', formatCount(post.parking, '대')],
          ].map(([label, value]) => (
            <div key={label} className="px-2 py-4">
              <dt className="text-xs text-slate-400">{label}</dt>
              <dd className="mt-1 font-semibold text-slate-800">{value}</dd>
            </div>
          ))}
        </dl>
        {post.images?.length > 0 && (
          <div className="grid grid-cols-1 gap-3 border-b border-slate-100 p-6 sm:grid-cols-3">
            {post.images.map((src, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-slate-200">
                <img src={src} alt={`사진 ${i + 1}`} className="aspect-[4/3] w-full object-cover" />
              </div>
            ))}
          </div>
        )}
        <div className="min-h-48 whitespace-pre-wrap break-words p-6 leading-relaxed text-slate-700">
          {post.content}
        </div>
      </Card>
      <div className="mt-6 flex flex-wrap justify-between gap-2">
        <LinkButton to={`/${board}`} variant="secondary">목록</LinkButton>
        {canEditPost(post, user) && (
          <div className="flex gap-2">
            <LinkButton to={`/${board}/${post.id}/edit`} variant="secondary">수정</LinkButton>
            <Button variant="danger" onClick={handleDelete}>삭제</Button>
          </div>
        )}
      </div>
    </div>
  )
}
