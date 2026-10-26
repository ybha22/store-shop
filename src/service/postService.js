import { KEYS, load, save, nextId } from '../utils/storage'
import { placeholderImage, unsplashImage } from '../utils/imageUtil'
import { matchRegion } from '../utils/board'
import { deleteCommentsByPost } from './commentService'

// 매물(TRANSFER) 테스트 데이터 - 모두 프리미엄(상단노출) 상태로 생성, 사진은 Unsplash 무료 이미지
const LISTING_SEEDS = [
  ['강남역 도보 3분 1층 카페 양도', '강남 블루문 카페', '서울 강남구 역삼동', '카페', 5000, 450, 8000, 20, '1층', 3200, 900, 2, 90,
    ['1501339847302-ac426a4a7cbb', '1554118811-1e0d58224f24', '1495474472287-4d71bcdd2085']],
  ['홍대 상권 배달 치킨집 (매출 안정)', '홍대 바삭치킨', '서울 마포구 서교동', '음식점', 3000, 300, 5000, 15, '1층', 3500, 1000, 0, 85,
    ['1569058242253-92a9c755a0ec', '1626082927389-6cd097cdc6ec', '1562967914-608f82629710']],
  ['성수동 감성 와인바 양도합니다', '성수 루프탑 와인바', '서울 성동구 성수동', '주점', 4000, 380, 6000, 28, '2층', 2800, 700, 1, 80,
    ['1514933651103-005eec06c04b', '1510812431401-41d2bd2722f3', '1566417713940-fe7c737a9ef2']],
  ['판교 오피스가 샐러드 전문점', '판교 그린보울', '경기 성남시 분당구 삼평동', '음식점', 3000, 250, 3500, 18, '1층', 2400, 650, 3, 75,
    ['1546069901-ba9599a7e63c', '1512621776951-a57141f2eefd', '1540420773420-3366772f4999']],
  ['수원역 인근 무인 아이스크림 할인점', '수원 아이스월드', '경기 수원시 팔달구', '판매업', 1000, 120, 1500, 12, '1층', 900, 350, 0, 70,
    ['1501443762994-82bd5dace89a', '1497034825429-c343d7c6a68f', '1576506295286-5cda18df43e7']],
  ['부산 서면 네일샵 시설 그대로 양도', '서면 핑크네일', '부산 부산진구 부전동', '서비스업', 1000, 110, 1800, 10, '3층', 1100, 450, 0, 65,
    ['1519014816548-bf5fe059798b', '1604654894610-df63bc536371', '1610992015732-2449b76344bc']],
  ['연남동 수제버거 맛집 양도 (웨이팅 매장)', '연남 그릴하우스', '서울 마포구 연남동', '음식점', 3000, 280, 7000, 16, '1층', 4000, 1100, 0, 60,
    ['1550547660-d9450f859349', '1568901346375-23c9450c58cd', '1571091718767-18b5b1457add']],
  ['이태원 화덕피자 펍 양도', '이태원 나폴리펍', '서울 용산구 이태원동', '주점', 5000, 420, 9000, 30, '1층', 4500, 1200, 1, 55,
    ['1574071318508-1cdbab80d002', '1513104890138-7c749659a591', '1436076863939-06870fe779c2']],
  ['대전 둔산동 베이커리 카페 양도', '둔산 브레드랩', '대전 서구 둔산동', '카페', 3000, 260, 4500, 25, '1층', 3000, 850, 4, 50,
    ['1517433670267-08bbd4be890f', '1509440159596-0249088772ff', '1555507036-ab1f4038808a']],
  ['광주 상무지구 헤어살롱 양도', '상무 헤어아뜰리에', '광주 서구 치평동', '서비스업', 2000, 200, 3000, 22, '2층', 2200, 700, 2, 45,
    ['1521590832167-7bcbfaa6381f', '1560066984-138dadb4c035', '1562322140-8baeececf3df']],
  ['대구 동성로 회전초밥 매장 양도', '동성로 스시하루', '대구 중구 동성로', '음식점', 4000, 350, 6500, 27, '1층', 3800, 950, 0, 40,
    ['1579871494447-9811cf80d66c', '1553621042-f6e147245754', '1611143669185-af224c5e3252']],
].map(([title, storeName, region, category, deposit, monthlyRent, premium, area, floor, monthlySales, monthlyProfit, parking, adDays, photoIds]) => ({
  seedKey: 'LISTING_V3',
  boardType: 'TRANSFER',
  title: `[테스트] ${title}`,
  content: `${region}에 위치한 ${category} 매물입니다.
시설 및 집기 일체 포함 양도하며, 인수인계 지원해 드립니다.
자세한 사항은 문의 주세요.`,
  storeName, region, category, deposit, monthlyRent, premium, area, floor, monthlySales, monthlyProfit, parking, adDays,
  photos: photoIds.map(unsplashImage),
}))

// LISTING_V3 생성 시 교체되는 이전 버전의 매물 테스트 글 제목
const OLD_LISTING_SEED_TITLES = [
  '[테스트] 강남역 도보 3분 카페 양도합니다',
  '[테스트] 홍대 상권 치킨집 양도 (매출 안정)',
  ...LISTING_SEEDS.slice(0, 6).map((p) => p.title),
]

const FAQ_SEEDS = [
  ['회원', '회원가입은 어떻게 하나요?', '상단의 [회원가입] 버튼을 눌러 아이디, 비밀번호, 이름, 연락처, 이메일을 입력하면 바로 가입됩니다.\n건물주/부동산 회원 전환은 운영자에게 문의해 주세요.'],
  ['매물', '매물은 누구나 등록할 수 있나요?', '로그인한 회원이라면 누구나 [매물 등록] 메뉴에서 매물을 등록할 수 있습니다.\n점포명, 지역, 사진 3장은 필수 입력 항목입니다.'],
  ['매물', '등록한 매물은 어디에 노출되나요?', '등록한 매물은 [매물 검색]과 메인 화면의 [최신 매물]에 노출됩니다.\n지역·점포명·업종으로 검색할 수 있습니다.'],
  ['상단노출', '프리미엄(상단노출)은 무엇인가요?', '유료 상단노출을 신청하면 메인 화면 프리미엄 영역과 매물 검색 결과 상단에 매물이 노출됩니다.\n매물 상세 화면 하단에서 7일/15일/30일 상품을 선택해 신청할 수 있습니다. (현재는 모의 결제)'],
  ['빈 공실', '빈 공실은 누가 올릴 수 있나요?', '빈 공실 게시판은 건물주/부동산 회원과 운영자만 등록할 수 있습니다.\n일반 회원은 지역·제목·보증금·월세 조건으로 검색해 볼 수 있습니다.'],
  ['기타', '앱도 있나요?', '현재 상가ON 앱은 준비 중입니다. 출시되면 메인 화면의 앱 다운로드 배너에서 받으실 수 있습니다.'],
].map(([category, title, content]) => ({ boardType: 'FAQ', title, content, category, colors: [] }))

const SEED_POSTS = [
  ...LISTING_SEEDS,
  ...FAQ_SEEDS,
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
  return SEED_POSTS.filter((p) => seedKeyOf(p) === key).map(({ colors, photos, seedKey, adDays, ...post }, i) => ({
    id: startId + i,
    ...post,
    images: photos ?? colors.map((color, n) => placeholderImage(post.storeName ?? `테스트 사진 ${n + 1}`, color)),
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
    if (pending.includes('LISTING_V3')) {
      posts = posts.filter(
        (p) => !(p.boardType === 'TRANSFER' && p.writerId === 'admin' && OLD_LISTING_SEED_TITLES.includes(p.title)),
      )
    }
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

// 매물 검색: 지역은 대표 지역(시/도) 일치, 점포명은 부분 일치, 업종은 일치. 상단노출 매물 우선 정렬
export function searchListings({ region = '', name = '', category = '' } = {}) {
  const n = name.trim().toLowerCase()
  return getAll()
    .filter((p) => p.boardType === 'TRANSFER')
    .filter((p) => matchRegion(p.region, region))
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
