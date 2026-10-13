import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './comp/Layout'
import RequireAuth from './comp/RequireAuth'
import LoginPage from './pages/LoginPage'
import BoardListPage from './pages/BoardListPage'
import BoardDetailPage from './pages/BoardDetailPage'
import BoardFormPage from './pages/BoardFormPage'
import MemberListPage from './pages/MemberListPage'
import MemberFormPage from './pages/MemberFormPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<Layout />}>
          {/* 비로그인 접근 가능: 게시글 목록 */}
          <Route path="/:board" element={<BoardListPage />} />
          {/* 로그인 필요 */}
          <Route path="/members" element={<RequireAuth><MemberListPage /></RequireAuth>} />
          <Route path="/members/new" element={<RequireAuth adminOnly><MemberFormPage /></RequireAuth>} />
          <Route path="/members/:id/edit" element={<RequireAuth adminOnly><MemberFormPage /></RequireAuth>} />
          <Route path="/:board/new" element={<RequireAuth><BoardFormPage /></RequireAuth>} />
          <Route path="/:board/:id" element={<RequireAuth><BoardDetailPage /></RequireAuth>} />
          <Route path="/:board/:id/edit" element={<RequireAuth><BoardFormPage /></RequireAuth>} />
        </Route>
        <Route path="*" element={<Navigate to="/transfer" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
