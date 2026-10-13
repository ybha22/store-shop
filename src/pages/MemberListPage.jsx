import { useState } from 'react'
import useAuthStore from '../stores/authStore'
import { formatDate } from '../utils/dateUtil'
import { deleteMember, getMembers } from '../service/memberService'
import { Button, Card, LinkButton, PageHeader, RoleBadge } from '../comp/ui'

export default function MemberListPage() {
  const user = useAuthStore((s) => s.user)
  const isAdmin = user.role === 'ADMIN'
  const [members, setMembers] = useState(getMembers)

  const handleDelete = (member) => {
    if (member.userId === user.userId) {
      window.alert('로그인 중인 본인 계정은 삭제할 수 없습니다.')
      return
    }
    if (!window.confirm(`'${member.name}(${member.userId})' 회원을 삭제하시겠습니까?`)) return
    deleteMember(member.id)
    setMembers(getMembers())
  }

  return (
    <div>
      <PageHeader
        title="회원관리"
        desc={isAdmin ? '회원을 등록하고 관리합니다.' : '등록된 회원 목록입니다.'}
        action={isAdmin && <LinkButton to="/members/new">회원 등록</LinkButton>}
      />
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="w-16 px-4 py-3 font-medium">번호</th>
              <th className="px-4 py-3 font-medium">아이디</th>
              <th className="px-4 py-3 font-medium">이름</th>
              <th className="w-24 px-4 py-3 font-medium">구분</th>
              <th className="w-28 px-4 py-3 font-medium">등록일</th>
              {isAdmin && <th className="w-36 px-4 py-3 text-right font-medium">관리</th>}
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-400">{m.id}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{m.userId}</td>
                <td className="px-4 py-3 text-slate-600">{m.name}</td>
                <td className="px-4 py-3"><RoleBadge role={m.role} /></td>
                <td className="px-4 py-3 text-slate-500">{formatDate(m.createdAt)}</td>
                {isAdmin && (
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <LinkButton to={`/members/${m.id}/edit`} variant="secondary" className="px-3 py-1.5">
                        수정
                      </LinkButton>
                      <Button variant="danger" className="px-3 py-1.5" onClick={() => handleDelete(m)}>
                        삭제
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
