import { KEYS, load, save, nextId } from '../utils/storage'
import { placeholderImage } from '../utils/imageUtil'
import { deleteCommentsByPost } from './commentService'

// 매물(TRANSFER) 테스트 데이터 - adDays가 있으면 해당 기간 상단노출 상태로 생성
const LISTING_SEEDS = [
  ['강남역 도보 3분 1층 카페 양도', '강남 블루문 카페', '서울 강남구 역삼동', '카페', 5000, 450, 8000, 20, '1층', 3200, 900, 2, 30, ['#6366f1', '#8b5cf6', '#0ea5e9']],
  ['홍대 상권 배달 치킨집 (매출 안정)', '홍대 바삭치킨', '서울 마포구 서교동', '음식점', 3000, 300, 5000, 15, '1층', 3500, 1000, 0, 15, ['#f97316', '#ef4444', '#eab308']],
  ['성수동 감성 와인바 양도합니다', '성수 루프탑 와인바', '서울 성동구 성수동', '주점', 4000, 380, 6000, 28, '2층', 2800, 700, 1, 7, ['#7c3aed', '#a855f7', '#c026d3']],
  ['판교 오피스가 샐러드 전문점', '판교 그린보울', '경기 성남시 분당구 삼평동', '음식점', 3000, 250, 3500, 18, '1층', 2400, 650, 3, null, ['#10b981', '#14b8a6', '#22c55e']],
  ['수원역 인근 무인 아이스크림 할인점', '수원 아이스월드', '경기 수원시 팔달구', '판매업', 1000, 120, 1500, 12, '1층', 900, 350, 0, null, ['#ec4899', '#f43f5e', '#fb7185']],
  ['부산 서면 네일샵 시설 그대로 양도', '서면 핑크네일', '부산 부산진구 부전동', '서비스업', 1000, 110, 1800, 10, '3층', 1100, 450, 0, null, ['#0ea5e9', '#38bdf8', '#06b6d4']],
].map(([title, storeName, region, category, deposit, monthlyRent, premium, area, floor, monthlySales, monthlyProfit, parking, adDays, colors]) => ({
  seedKey: 'LISTING',
  boardType: 'TRANSFER',
  title: `[테스트] ${title}`,
  content: `${region}에 위치한 ${category} 매물입니다.
시설 및 집기 일체 포함 양도하며, 인수인계 지원해 드립니다.
자세한 사항은 문의 주세요.`,
  storeName, region, category, deposit, monthlyRent, premium, area, floor, monthlySales, monthlyProfit, parking, adDays, colors,
}))

const SEED_POSTS = [
  ...LISTING_SEEDS,
  {
    boardType: 'VACANCY',
    title: '[테스트] 역삼역 대로변 1층 상가 공실 (무권리)',
    content: '역삼역 3번 출구 대로변 1층 상가입니다.\n전면 유리, 층고 4m로 카페·쇼룸 추천드립니다.\n바닥권리금 없습니다.',
    writerType: '건물주',
    contact: '010-1234-5678',
    region: '서울 강남구 역삼동',
    floor: '1층',
    area: 25,
    floorPremium: 0,
    deposit: 5000,
    monthlyRent: 380,
    maintenanceFee: 30,
    parking: 2,
    moveInDate: '즉시',
    colors: ['#0ea5e9', '#38bdf8', '#0284c7'],
  },
  {
    boardType: 'VACANCY',
    title: '[테스트] 판교 오피스 상권 2층 상가 임대',
    content: '판교테크노밸리 오피스 밀집 지역 2층 상가입니다.\n점심 수요가 많아 식당·학원 추천합니다.\n엘리베이터 있습니다.',
    writerType: '부동산',
    contact: '031-123-4567',
    region: '경기 성남시 분당구 삼평동',
    floor: '2층',
    area: 42,
    floorPremium: 3000,
    deposit: 7000,
    monthlyRent: 520,
    maintenanceFee: 55,
    parking: 4,
    moveInDate: '2026-12-01',
    colors: ['#64748b', '#475569', '#94a3b8'],
  },
  {
    boardType: 'MARKET',
    title: '[테스트] 업소용 4도어 냉장고 판매합니다 (폐업)',
    content: '폐업으로 업소용 4도어 냉장고 판매합니다.\n2년 사용했고 냉기 잘 나옵니다.\n직접 가져가셔야 합니다.',
    status: '판매중',
    price: 650000,
    negotiable: true,
    condition: '상',
    region: '서울 마포구',
    colors: ['#14b8a6', '#0d9488', '#2dd4bf'],
  },
  {
    boardType: 'MARKET',
    title: '[테스트] 카페 에스프레소 머신 + 그라인더 세트',
    content: '2그룹 에스프레소 머신과 그라인더 세트입니다.\n정기 점검 받아왔고 사용감 조금 있습니다.',
    status: '예약중',
    price: 2800000,
    negotiable: false,
    condition: '중',
    region: '경기 수원시',
    colors: ['#a16207', '#ca8a04', '#854d0e'],
  },
  {
    boardType: 'COMMUNITY',
    title: '[테스트] 배달앱 수수료 줄이는 팁 공유합니다',
    content: '자체 주문 채널과 포장 할인을 같이 운영했더니 수수료 부담이 꽤 줄었어요.\n다른 사장님들은 어떻게 하시나요?',
    colors: [],
  },
  {
    boardType: 'COMMUNITY',
    title: '[테스트] 상가 임대차 계약 시 꼭 확인할 것들',
    content: '1. 등기부등본으로 소유자 확인\n2. 용도 확인 (업종 가능 여부)\n3. 원상복구 범위 특약\n4. 권리금 회수기회 보호 조항\n추가로 아시는 것 있으면 댓글 남겨주세요!',
    colors: ['#6366f1'],
  },
]

const DAY = 24 * 60 * 60 * 1000
const seedKeyOf = (p) => p.seedKey ?? p.boardType

function seedPostsFor(key, startId) {
  const now = new Date().toISOString()
  return SEED_POSTS.filter((p) => seedKeyOf(p) === key).map(({ colors, seedKey, adDays, ...post }, i) => ({
    id: startId + i,
    ...post,
    images: colors.map((color, n) => placeholderImage(post.storeName ?? `테스트 사진 ${n + 1}`, color)),
    adUntil: adDays ? new Date(Date.now() + adDays * DAY).toISOString() : null,
    writerId: 'admin',
    writerName: '관리자',
    views: 0,
    createdAt: now,
    updatedAt: now,
  }))
}

// 테스트 글은 seedKey(기본: 게시판 타입) 단위로 한 번만 생성 (새로 추가된 묶음만 추가)
function getAll() {
  let posts = load(KEYS.POSTS, null)
  let seeded = load(KEYS.SEEDED, null)
  if (seeded === null) {
    seeded = posts === null ? [] : ['TRANSFER', 'TAKEOVER']
  }
  posts = posts ?? []
  const keys = [...new Set(SEED_POSTS.map(seedKeyOf))]
  const pending = keys.filter((k) => !seeded.includes(k))
  if (pending.length > 0) {
    for (const key of pending) {
      posts = [...posts, ...seedPostsFor(key, nextId(posts))]
    }
    save(KEYS.POSTS, posts)
    save(KEYS.SEEDED, [...seeded, ...pending])
  }
  return posts
}

export function isAdActive(post) {
  return !!post.adUntil && new Date(post.adUntil).getTime() > Date.now()
}

const byLatest = (a, b) => b.id - a.id

// 매물 검색: 지역/점포명은 부분 일치, 업종은 일치. 상단노출 매물 우선 정렬
export function searchListings({ region = '', name = '', category = '' } = {}) {
  const r = region.trim().toLowerCase()
  const n = name.trim().toLowerCase()
  return getAll()
    .filter((p) => p.boardType === 'TRANSFER')
    .filter((p) => !r || (p.region ?? '').toLowerCase().includes(r))
    .filter((p) => !n || (p.storeName ?? '').toLowerCase().includes(n))
    .filter((p) => !category || p.category === category)
    .sort((a, b) => Number(isAdActive(b)) - Number(isAdActive(a)) || byLatest(a, b))
}

export function getAdListings() {
  return getAll().filter((p) => p.boardType === 'TRANSFER' && isAdActive(p)).sort(byLatest)
}

export function getLatestPosts(boardType, limit) {
  return getAll().filter((p) => p.boardType === boardType).sort(byLatest).slice(0, limit)
}

// 상단노출 신청 (모의 결제 완료 후 호출). 노출 중이면 남은 기간에 이어서 연장
export function applyAd(id, plan) {
  const posts = getAll()
  const target = posts.find((p) => p.id === Number(id))
  if (!target) throw new Error('게시글을 찾을 수 없습니다.')
  const base = isAdActive(target) ? new Date(target.adUntil).getTime() : Date.now()
  const updated = { ...target, adUntil: new Date(base + plan.days * DAY).toISOString() }
  save(KEYS.POSTS, posts.map((p) => (p.id === updated.id ? updated : p)))
  return updated
}

export function cancelAd(id) {
  const posts = getAll()
  let updated = null
  save(
    KEYS.POSTS,
    posts.map((p) => {
      if (p.id !== Number(id)) return p
      updated = { ...p, adUntil: null }
      return updated
    }),
  )
  return updated
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

// data: { title, content, images, ...게시판별 필드 }
export function createPost(boardType, data, writer) {
  const posts = getAll()
  const now = new Date().toISOString()
  const post = {
    ...data,
    id: nextId(posts),
    boardType,
    writerId: writer.userId,
    writerName: writer.name,
    views: 0,
    createdAt: now,
    updatedAt: now,
  }
  saveAll([...posts, post])
  return post
}

export function updatePost(id, data) {
  const posts = getAll()
  const target = posts.find((p) => p.id === Number(id))
  if (!target) throw new Error('게시글을 찾을 수 없습니다.')
  const updated = { ...target, ...data, updatedAt: new Date().toISOString() }
  saveAll(posts.map((p) => (p.id === updated.id ? updated : p)))
  return updated
}

export function deletePost(id) {
  save(KEYS.POSTS, getAll().filter((p) => p.id !== Number(id)))
  deleteCommentsByPost(id)
}

export function canEditPost(post, user) {
  return !!user && (user.role === 'ADMIN' || post.writerId === user.userId)
}
