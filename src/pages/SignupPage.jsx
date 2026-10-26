import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import { signup } from '../service/memberService'
import { Button, Card, Field, Logo, inputClass } from '../comp/ui'

const FIELDS = [
  { key: 'userId', label: '아이디', placeholder: '영문/숫자 4자 이상' },
  { key: 'password', label: '비밀번호', type: 'password', placeholder: '4자 이상' },
  { key: 'passwordConfirm', label: '비밀번호 확인', type: 'password' },
  { key: 'name', label: '이름' },
  { key: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000' },
  { key: 'email', label: '이메일', type: 'email', placeholder: 'example@email.com' },
]

export default function SignupPage() {
  const user = useAuthStore((s) => s.user)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const [form, setForm] = useState(Object.fromEntries(FIELDS.map((f) => [f.key, ''])))
  const [error, setError] = useState('')

  if (user) return <Navigate to="/" replace />

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim()]))
    const empty = FIELDS.find((f) => !data[f.key])
    if (empty) return setError(`${empty.label}을(를) 입력해 주세요.`)
    if (!/^[A-Za-z0-9]{4,}$/.test(data.userId)) return setError('아이디는 영문/숫자 4자 이상으로 입력해 주세요.')
    if (data.password.length < 4) return setError('비밀번호는 4자 이상 입력해 주세요.')
    if (data.password !== data.passwordConfirm) return setError('비밀번호가 일치하지 않습니다.')
    if (!/^\S+@\S+\.\S+$/.test(data.email)) return setError('이메일 형식이 올바르지 않습니다.')
    try {
      signup(data)
      login(data.userId, data.password)
      window.alert(`${data.name}님, 상가ON 회원가입을 환영합니다!`)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link to="/"><Logo className="text-3xl" /></Link>
          <p className="mt-2 text-sm text-slate-500">회원가입</p>
        </div>
        <Card className="p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {FIELDS.map((f) => (
              <Field key={f.key} label={f.label}>
                <input
                  type={f.type ?? 'text'}
                  className={inputClass}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                />
              </Field>
            ))}
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <Button type="submit" className="w-full py-2.5">가입하기</Button>
          </form>
        </Card>
        <p className="mt-6 text-center text-sm text-slate-500">
          이미 회원이신가요? <Link to="/login" className="font-medium text-indigo-600 hover:underline">로그인</Link>
        </p>
      </div>
    </div>
  )
}
