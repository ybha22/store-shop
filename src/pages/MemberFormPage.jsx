import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import { createMember, getMember, updateMember } from '../service/memberService'
import { Button, Card, Field, LinkButton, PageHeader, inputClass } from '../comp/ui'

export default function MemberFormPage() {
  const { id } = useParams()
  const isEdit = !!id
  const original = isEdit ? getMember(id) : null
  const user = useAuthStore((s) => s.user)
  const refresh = useAuthStore((s) => s.refresh)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    userId: original?.userId ?? '',
    password: '',
    name: original?.name ?? '',
    role: original?.role ?? 'USER',
  })
  const [error, setError] = useState('')

  if (isEdit && !original) {
    return <p className="py-16 text-center text-slate-500">회원을 찾을 수 없습니다.</p>
  }

  const change = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    const userId = form.userId.trim()
    const name = form.name.trim()
    if (!userId || !name || (!isEdit && !form.password)) {
      setError(isEdit ? '이름을 입력해 주세요.' : '아이디, 비밀번호, 이름을 모두 입력해 주세요.')
      return
    }
    try {
      if (isEdit) {
        const saved = updateMember(id, { password: form.password, name, role: form.role })
        if (saved.userId === user.userId) refresh(saved)
      } else {
        createMember({ userId, password: form.password, name, role: form.role })
      }
      navigate('/members', { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-xl">
      <PageHeader title={isEdit ? '회원 수정' : '회원 등록'} />
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="아이디">
            <input className={inputClass} value={form.userId} onChange={change('userId')} disabled={isEdit} />
          </Field>
          <Field label={isEdit ? '비밀번호 (변경 시에만 입력)' : '비밀번호'}>
            <input type="password" className={inputClass} value={form.password} onChange={change('password')} />
          </Field>
          <Field label="이름">
            <input className={inputClass} value={form.name} onChange={change('name')} />
          </Field>
          <Field label="구분">
            <div className="flex gap-2">
              {[
                ['USER', '사용자'],
                ['ADMIN', '운영자'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm({ ...form, role: value })}
                  className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    form.role === value
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </Field>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <LinkButton to="/members" variant="secondary">취소</LinkButton>
            <Button type="submit">{isEdit ? '수정' : '등록'}</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
