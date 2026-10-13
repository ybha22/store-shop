import { KEYS, load, save, nextId } from '../utils/storage'
import { placeholderImage } from '../utils/imageUtil'

const SEED_POSTS = [
  {
    boardType: 'TRANSFER',
    title: '[테스트] 강남역 도보 3분 카페 양도합니다',
    content: '강남역 11번 출구 도보 3분 거리 1층 카페입니다.\n전용 20평, 좌석 30석이며 단골 고객이 많습니다.\n개인 사정으로 양도하며 집기 일체 포함입니다.',
    premium: 8000,
    monthlyRent: 450,
    parking: 2,
    colors: ['#6366f1', '#8b5cf6', '#0ea5e9'],
  },
  {
    boardType: 'TRANSFER',
    title: '[테스트] 홍대 상권 치킨집 양도 (매출 안정)',
    content: '홍대입구역 인근 배달 위주 치킨집입니다.\n월 평균 매출 3,500만원 수준이며 배달앱 리뷰 4.8점입니다.\n인수인계 2주 지원해 드립니다.',
    premium: 5000,
    monthlyRent: 300,
    parking: 0,
    colors: ['#f97316', '#ef4444', '#eab308'],
  },
  {
    boardType: 'TAKEOVER',
    title: '[테스트] 성수동 20평 내외 베이커리 자리 구합니다',
    content: '성수동 일대에서 베이커리 운영 가능한 매장을 찾습니다.\n전용 15~25평, 1층 선호합니다.\n권리금은 협의 가능합니다.',
    premium: 6000,
    monthlyRent: 400,
    parking: 1,
    colors: ['#10b981', '#14b8a6', '#22c55e'],
  },
  {
    boardType: 'TAKEOVER',
    title: '[테스트] 분당 학원가 무인 아이스크림 매장 인수 희망',
    content: '분당 학원가 인근 무인 아이스크림/문구 매장 인수를 희망합니다.\n운영 중인 매장이면 더 좋습니다.\n주차 가능한 곳 선호합니다.',
    premium: 2000,
    monthlyRent: 150,
    parking: 3,
    colors: ['#ec4899', '#f43f5e', '#a855f7'],
  },
]

function createSeedPosts() {
  const now = new Date().toISOString()
  return SEED_POSTS.map(({ colors, ...post }, i) => ({
    id: i + 1,
    ...post,
    images: colors.map((color, n) => placeholderImage(`테스트 사진 ${n + 1}`, color)),
    writerId: 'admin',
    writerName: '관리자',
    views: 0,
    createdAt: now,
    updatedAt: now,
  }))
}

function getAll() {
  let posts = load(KEYS.POSTS, null)
  if (posts === null) {
    posts = createSeedPosts()
    save(KEYS.POSTS, posts)
  }
  return posts
}

// localStorage 용량 초과 시 사용자에게 보여줄 메시지로 변환
function saveAll(posts) {
  try {
    save(KEYS.POSTS, posts)
  } catch {
    throw new Error('저장 공간이 부족합니다. 더 작은 사진을 첨부해 주세요.')
  }
}

export function getPosts(boardType) {
  return getAll()
    .filter((p) => p.boardType === boardType)
    .sort((a, b) => b.id - a.id)
}

export function getPost(id) {
  return getAll().find((p) => p.id === Number(id)) || null
}

export function increaseViews(id) {
  const posts = getAll()
  let found = null
  const next = posts.map((p) => {
    if (p.id !== Number(id)) return p
    found = { ...p, views: p.views + 1 }
    return found
  })
  save(KEYS.POSTS, next)
  return found
}

export function createPost(boardType, { title, content, premium, monthlyRent, parking, images }, writer) {
  const posts = getAll()
  const now = new Date().toISOString()
  const post = {
    id: nextId(posts),
    boardType,
    title,
    content,
    premium,
    monthlyRent,
    parking,
    images,
    writerId: writer.userId,
    writerName: writer.name,
    views: 0,
    createdAt: now,
    updatedAt: now,
  }
  saveAll([...posts, post])
  return post
}

export function updatePost(id, { title, content, premium, monthlyRent, parking, images }) {
  const posts = getAll()
  const target = posts.find((p) => p.id === Number(id))
  if (!target) throw new Error('게시글을 찾을 수 없습니다.')
  const updated = {
    ...target,
    title,
    content,
    premium,
    monthlyRent,
    parking,
    images,
    updatedAt: new Date().toISOString(),
  }
  saveAll(posts.map((p) => (p.id === updated.id ? updated : p)))
  return updated
}

export function deletePost(id) {
  save(KEYS.POSTS, getAll().filter((p) => p.id !== Number(id)))
}

export function canEditPost(post, user) {
  return !!user && (user.role === 'ADMIN' || post.writerId === user.userId)
}
