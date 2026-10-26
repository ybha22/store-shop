import { useState } from 'react'
import useAuthStore from '../stores/authStore'
import { deletePost } from '../service/postService'
import { Button, Card, LinkButton } from './ui'

// 자주묻는 질문: 아코디언 형태 (질문 클릭 시 답변 펼침), 로그인 없이 열람 가능
export default function FaqList({ board, posts: initialPosts, categories }) {
  const user = useAuthStore((s) => s.user)
  const isAdmin = user?.role === 'ADMIN'
  const [posts, setPosts] = useState(() => [...initialPosts].sort((a, b) => a.id - b.id))
  const [openId, setOpenId] = useState(null)
  const [category, setCategory] = useState('')

  const visible = category ? posts.filter((p) => p.category === category) : posts

  const handleDelete = (id) => {
    if (!window.confirm('질문을 삭제하시겠습니까?')) return
    deletePost(id)
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {['', ...categories].map((c) => (
          <button
            key={c || 'all'}
            onClick={() => setCategory(c)}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
              category === c
                ? 'border-indigo-500 bg-indigo-50 font-semibold text-indigo-700'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {c || '전체'}
          </button>
        ))}
      </div>
      <Card className="divide-y divide-slate-100">
        {visible.length === 0 && <p className="py-16 text-center text-sm text-slate-400">등록된 질문이 없습니다.</p>}
        {visible.map((post) => {
          const open = openId === post.id
          return (
            <div key={post.id}>
              <button
                onClick={() => setOpenId(open ? null : post.id)}
                className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-slate-50"
              >
                <span className="text-lg font-bold text-indigo-600">Q</span>
                {post.category && (
                  <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">{post.category}</span>
                )}
                <span className="flex-1 font-medium text-slate-800">{post.title}</span>
                <span className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
              </button>
              {open && (
                <div className="flex gap-3 bg-slate-50/70 px-5 py-4">
                  <span className="text-lg font-bold text-slate-400">A</span>
                  <div className="flex-1">
                    <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700">{post.content}</p>
                    {isAdmin && (
                      <div className="mt-3 flex gap-2">
                        <LinkButton to={`/${board}/${post.id}/edit`} variant="secondary" className="px-3 py-1.5">수정</LinkButton>
                        <Button variant="danger" className="px-3 py-1.5" onClick={() => handleDelete(post.id)}>삭제</Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </Card>
    </div>
  )
}
