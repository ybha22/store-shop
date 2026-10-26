import { Link } from 'react-router-dom'
import { NAV_MENUS } from '../utils/board'
import { Logo } from './ui'

// 모의 버전용 푸터 (회사 정보는 예시 값)
export default function Footer() {
  const notReady = (name) => () => window.alert(`${name}은(는) 모의 버전에서 제공하지 않습니다.`)

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <Logo className="text-xl" />
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              점포 양도·양수, 빈 공실, 집기 중고거래까지
              <br />
              사장님을 위한 상가 정보 플랫폼
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <div>
              <p className="mb-3 font-semibold text-slate-800">서비스</p>
              <ul className="space-y-2 text-slate-500">
                {NAV_MENUS.slice(0, 4).map((m) => (
                  <li key={m.to}>
                    <Link to={m.to} className="hover:text-indigo-600">{m.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-3 font-semibold text-slate-800">고객지원</p>
              <ul className="space-y-2 text-slate-500">
                <li><Link to="/faq" className="hover:text-indigo-600">자주묻는 질문</Link></li>
                <li><Link to="/community" className="hover:text-indigo-600">커뮤니티</Link></li>
                <li><button onClick={notReady('1:1 문의')} className="hover:text-indigo-600">1:1 문의</button></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 font-semibold text-slate-800">고객센터</p>
              <p className="text-lg font-bold text-slate-800">0000-0000</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                평일 09:00 ~ 18:00
                <br />
                (점심 12:00 ~ 13:00, 주말·공휴일 휴무)
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-100 pt-6 text-xs">
          <button onClick={notReady('이용약관')} className="text-slate-500 hover:text-indigo-600">이용약관</button>
          <button onClick={notReady('개인정보처리방침')} className="font-semibold text-slate-700 hover:text-indigo-600">
            개인정보처리방침
          </button>
          <button onClick={notReady('위치기반서비스 이용약관')} className="text-slate-500 hover:text-indigo-600">
            위치기반서비스 이용약관
          </button>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-slate-400">
          상호: 상가ON(모의) · 대표: 홍길동 · 사업자등록번호: 000-00-00000 · 통신판매업신고: 제0000-서울-0000호
          <br />
          주소: 서울특별시 OO구 OO로 00 · 이메일: help@example.com
        </p>
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          ※ 본 사이트는 모의(테스트)용으로 제작되었으며, 실제 매물 거래 및 결제가 이루어지지 않습니다.
        </p>
        <p className="mt-4 text-xs text-slate-400">© 2026 상가ON. All rights reserved.</p>
      </div>
    </footer>
  )
}
