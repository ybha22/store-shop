import { useState } from 'react'
import useAuthStore from '../stores/authStore'
import { AD_PLANS } from '../utils/board'
import { formatDateTime } from '../utils/dateUtil'
import { applyAd, cancelAd, canEditPost, isAdActive } from '../service/postService'
import { Button, Card } from './ui'
import { AdBadge } from './ListingCard'

// 유료 상단노출 신청 (실제 결제 없이 모의 결제로 처리)
export default function AdPanel({ post, onChange }) {
  const user = useAuthStore((s) => s.user)
  const [plan, setPlan] = useState(null)
  const active = isAdActive(post)
  const isOwner = canEditPost(post, user)
  const isAdmin = user?.role === 'ADMIN'

  if (!isOwner && !active) return null

  const handlePay = () => {
    onChange(applyAd(post.id, plan))
    setPlan(null)
    window.alert(`상단노출이 적용되었습니다. (${plan.days}일)`)
  }

  const handleCancel = () => {
    if (!window.confirm('상단노출을 해제하시겠습니까?')) return
    onChange(cancelAd(post.id))
  }

  return (
    <Card className={`mt-6 p-6 ${active ? 'border-amber-300 bg-amber-50/40' : ''}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-semibold text-slate-900">
            상단노출 {active && <AdBadge />}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {active
              ? `${formatDateTime(post.adUntil)}까지 메인 화면과 매물 검색 상단에 노출됩니다.`
              : '메인 화면 프리미엄 영역과 매물 검색 결과 상단에 매물을 노출합니다.'}
          </p>
        </div>
        {active && isAdmin && (
          <Button variant="danger" onClick={handleCancel}>노출 해제</Button>
        )}
      </div>

      {isOwner && (
        <>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {AD_PLANS.map((p) => (
              <button
                key={p.days}
                type="button"
                onClick={() => setPlan(p)}
                className={`rounded-xl border p-4 text-center transition-colors ${
                  plan?.days === p.days
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 bg-white hover:border-indigo-300'
                }`}
              >
                <p className="text-sm font-semibold text-slate-800">{p.days}일</p>
                <p className="mt-1 text-sm text-indigo-600">{p.price.toLocaleString()}원</p>
              </button>
            ))}
          </div>
          {plan && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">결제 금액</span>
                <span className="text-lg font-bold text-slate-900">{plan.price.toLocaleString()}원</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                ※ 모의 결제입니다. 실제 결제는 이루어지지 않습니다.
                {active && ' 현재 노출 기간에 이어서 연장됩니다.'}
              </p>
              <div className="mt-3 flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setPlan(null)}>취소</Button>
                <Button onClick={handlePay}>{active ? '연장 결제하기' : '결제하기'}</Button>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  )
}
