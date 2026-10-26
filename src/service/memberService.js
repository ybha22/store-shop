import { KEYS, load, save, nextId } from '../utils/storage'

const SEED_ADMIN = {
  userId: 'admin',
  password: 'admin1234',
  name: '관리자',
  role: 'ADMIN',
}

function getAll() {
  let members = load(KEYS.MEMBERS, null)
  if (!members || members.length === 0) {
    const now = new Date().toISOString()
    members = [{ id: 1, ...SEED_ADMIN, createdAt: now, updatedAt: now }]
    save(KEYS.MEMBERS, members)
  }
  return members
}

export function stripPassword({ password, ...rest }) {
  return rest
}

export function login(userId, password) {
  const member = getAll().find((m) => m.userId === userId && m.password === password)
  if (!member) throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.')
  return stripPassword(member)
}

export function getMembers() {
  return getAll().map(stripPassword)
}

export function getMember(id) {
  const member = getAll().find((m) => m.id === Number(id))
  return member ? stripPassword(member) : null
}

export function createMember({ userId, password, name, role, phone = null, email = null }) {
  const members = getAll()
  if (members.some((m) => m.userId === userId)) {
    throw new Error('이미 사용 중인 아이디입니다.')
  }
  const now = new Date().toISOString()
  const member = { id: nextId(members), userId, password, name, role, phone, email, createdAt: now, updatedAt: now }
  save(KEYS.MEMBERS, [...members, member])
  return stripPassword(member)
}

// 회원가입 (모의 버전: 사용자 구분으로만 가입)
export function signup({ userId, password, name, phone, email }) {
  return createMember({ userId, password, name, role: 'USER', phone, email })
}

export function updateMember(id, { password, name, role }) {
  const members = getAll()
  const target = members.find((m) => m.id === Number(id))
  if (!target) throw new Error('회원을 찾을 수 없습니다.')
  const updated = {
    ...target,
    name,
    role,
    password: password ? password : target.password,
    updatedAt: new Date().toISOString(),
  }
  save(KEYS.MEMBERS, members.map((m) => (m.id === updated.id ? updated : m)))
  return stripPassword(updated)
}

export function deleteMember(id) {
  save(KEYS.MEMBERS, getAll().filter((m) => m.id !== Number(id)))
}
