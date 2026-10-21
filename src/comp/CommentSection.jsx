import { useState } from 'react'
import useAuthStore from '../stores/authStore'
import { formatDateTime } from '../utils/dateUtil'
import { canDeleteComment, createComment, deleteComment, getComments } from '../service/commentService'
import { Button, Card, inputClass } from './ui'

export default function CommentSection({ postId }) {
  const user = useAuthStore((s) => s.user)
  const [comments, setComments] = useState(() => getComments(postId))
  const [content, setContent] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!content.trim()) return
    createComment(postId, content.trim(), user)
    setContent('')
    setComments(getComments(postId))
  }

  const handleDelete = (id) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return
    deleteComment(id)
    setComments(getComments(postId))
  }

  return (
    <Card className="mt-6 p-6">
      <h2 className="mb-4 text-sm font-semibold text-slate-800">
        댓글 <span className="text-indigo-600">{comments.length}</span>
      </h2>
      {comments.length === 0 ? (
        <p className="py-4 text-sm text-slate-400">첫 댓글을 남겨보세요.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {comments.map((c) => (
            <li key={c.id} className="py-3">
              <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                <span>
                  <span className="font-medium text-slate-700">{c.writerName}</span>
                  <span className="ml-2">{formatDateTime(c.createdAt)}</span>
                </span>
                {canDeleteComment(c, user) && (
                  <button onClick={() => handleDelete(c.id)} className="hover:text-rose-600">
                    삭제
                  </button>
                )}
              </div>
              <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-700">{c.content}</p>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          className={inputClass}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글을 입력하세요"
          maxLength={500}
        />
        <Button type="submit" className="shrink-0">등록</Button>
      </form>
    </Card>
  )
}
