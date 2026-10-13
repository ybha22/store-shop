import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import { Button, Card, Field, inputClass } from '../comp/ui'

export default function LoginPage() {
  const user = useAuthStore((s) => s.user)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/transfer'
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (user) return <Navigate to={from} replace />

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!userId.trim() || !password) {
      setError('아이디와 비밀번호를 입력해 주세요.')
      return
    }
    try {
      login(userId.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Store<span className="text-indigo-600">Shop</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500">가게 양도·양수 정보 공유 서비스</p>
        </div>
        <Card className="p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="아이디">
              <input
                className={inputClass}
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                autoFocus
              />
            </Field>
            <Field label="비밀번호">
              <input
                type="password"
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <Button type="submit" className="w-full py-2.5">로그인</Button>
          </form>
        </Card>
        <p className="mt-6 text-center text-sm">
          <Link to="/transfer" className="text-slate-500 hover:text-indigo-600">← 게시글 둘러보기</Link>
        </p>
      </div>
    </div>
  )
}
