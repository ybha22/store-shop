export const SITE_NAME = '상가ON'

export const ROLES = {
  ADMIN: '운영자',
  REALTOR: '건물주/부동산',
  USER: '사용자',
}

export const CATEGORIES = ['카페', '음식점', '주점', '판매업', '서비스업', '기타']

// 대표 지역(시/도). aliases: 지역 텍스트가 이 값으로 시작하면 해당 지역으로 판단
export const REGIONS = [
  { value: '서울', aliases: ['서울'] },
  { value: '부산', aliases: ['부산'] },
  { value: '대구', aliases: ['대구'] },
  { value: '인천', aliases: ['인천'] },
  { value: '광주', aliases: ['광주광역시', '광주 '] },
  { value: '대전', aliases: ['대전'] },
  { value: '울산', aliases: ['울산'] },
  { value: '세종', aliases: ['세종'] },
  { value: '경기', aliases: ['경기'] },
  { value: '강원', aliases: ['강원'] },
  { value: '충북', aliases: ['충북', '충청북도'] },
  { value: '충남', aliases: ['충남', '충청남도'] },
  { value: '전북', aliases: ['전북', '전라북도'] },
  { value: '전남', aliases: ['전남', '전라남도'] },
  { value: '경북', aliases: ['경북', '경상북도'] },
  { value: '경남', aliases: ['경남', '경상남도'] },
  { value: '제주', aliases: ['제주'] },
]

// 대표 지역 값이면 시/도 일치, 그 외(직접 입력 등)는 부분 일치
export function matchRegion(text, value) {
  if (!value) return true
  const region = String(text ?? '').trim()
  const def = REGIONS.find((r) => r.value === value)
  if (!def) return region.toLowerCase().includes(value.trim().toLowerCase())
  return def.aliases.some((a) => `${region} `.startsWith(a))
}

// 유료 상단노출 상품 (모의 결제)
export const AD_PLANS = [
  { days: 7, price: 30000 },
  { days: 15, price: 50000 },
  { days: 30, price: 90000 },
]

// 필드 type: money | number | text | date | select | checkbox
export const BOARDS = {
  transfer: {
    type: 'TRANSFER',
    label: '매물 등록',
    desc: '양도할 점포 매물을 등록하는 공간입니다. 등록된 매물은 매물 검색에 노출됩니다.',
    fields: [
      { key: 'storeName', label: '점포명', type: 'text', placeholder: '예: 강남 OO카페', required: true },
      { key: 'region', label: '지역', type: 'text', placeholder: '예: 서울 강남구 역삼동', required: true },
      { key: 'category', label: '업종', type: 'select', options: CATEGORIES },
      { key: 'deposit', label: '보증금', type: 'money', unit: '만원' },
      { key: 'monthlyRent', label: '월세', type: 'money', unit: '만원' },
      { key: 'premium', label: '권리금', type: 'money', unit: '만원' },
      { key: 'area', label: '면적', type: 'number', unit: '평' },
      { key: 'floor', label: '층수', type: 'text', placeholder: '1층 / 지하1층' },
      { key: 'monthlySales', label: '월매출', type: 'money', unit: '만원' },
      { key: 'monthlyProfit', label: '월수익', type: 'money', unit: '만원' },
      { key: 'parking', label: '주차가능대수', type: 'number', unit: '대' },
    ],
    images: { count: 3, required: true },
    listColumns: ['region', 'category', 'premium'],
    ads: true,
    writeLabel: '매물 등록하기',
  },
  vacancy: {
    type: 'VACANCY',
    label: '빈 공실',
    desc: '건물주·부동산에서 올리는 빈 상가 공실 정보입니다.',
    writeRoles: ['ADMIN', 'REALTOR'],
    writeDeniedMessage: '빈 공실은 건물주/부동산 회원만 등록할 수 있습니다.',
    fields: [
      { key: 'writerType', label: '글쓴이 구분', type: 'select', options: ['건물주', '부동산'] },
      { key: 'contact', label: '연락처', type: 'text', placeholder: '010-0000-0000' },
      { key: 'region', label: '주소(지역)', type: 'text', placeholder: '서울 강남구 역삼동' },
      { key: 'floor', label: '층수', type: 'text', placeholder: '1층 / 지하1층' },
      { key: 'area', label: '평수', type: 'number', unit: '평' },
      { key: 'floorPremium', label: '바닥권리금', type: 'money', unit: '만원' },
      { key: 'deposit', label: '보증금', type: 'money', unit: '만원' },
      { key: 'monthlyRent', label: '월세', type: 'money', unit: '만원' },
      { key: 'maintenanceFee', label: '관리비', type: 'money', unit: '만원' },
      { key: 'parking', label: '주차가능대수', type: 'number', unit: '대' },
      { key: 'moveInDate', label: '입주가능일', type: 'text', placeholder: '즉시 / 2026-12-01' },
    ],
    images: { count: 3, required: true },
    listColumns: ['region', 'area', 'deposit', 'monthlyRent'],
    // 목록 맞춤 검색 조건 (region: 대표 지역 선택 / text: 부분 일치 / range: 금액 구간, 만원 단위, max 미포함)
    filters: [
      { key: 'region', label: '지역', type: 'region' },
      { key: 'title', label: '제목', type: 'text', placeholder: '제목 검색' },
      {
        key: 'deposit',
        label: '보증금',
        type: 'range',
        ranges: [
          { label: '1,000만원 미만', min: 0, max: 1000 },
          { label: '1,000~3,000만원', min: 1000, max: 3000 },
          { label: '3,000~5,000만원', min: 3000, max: 5000 },
          { label: '5,000만원 이상', min: 5000, max: null },
        ],
      },
      {
        key: 'monthlyRent',
        label: '월세',
        type: 'range',
        ranges: [
          { label: '100만원 미만', min: 0, max: 100 },
          { label: '100~300만원', min: 100, max: 300 },
          { label: '300~500만원', min: 300, max: 500 },
          { label: '500만원 이상', min: 500, max: null },
        ],
      },
    ],
  },
  market: {
    type: 'MARKET',
    label: '집기 중고거래',
    desc: '폐업·정리 매장의 집기와 장비를 저렴하게 사고파는 공간입니다.',
    fields: [
      { key: 'status', label: '판매상태', type: 'select', options: ['판매중', '예약중', '판매완료'], default: '판매중', required: true },
      { key: 'price', label: '가격', type: 'money', unit: '원' },
      { key: 'negotiable', label: '가격협의', type: 'checkbox', text: '가격협의 가능' },
      { key: 'condition', label: '상품상태', type: 'select', options: ['상', '중', '하'] },
      { key: 'region', label: '거래지역', type: 'text', placeholder: '경기 성남시' },
    ],
    images: { count: 3, required: true },
    listColumns: ['status', 'price', 'region'],
  },
  community: {
    type: 'COMMUNITY',
    label: '커뮤니티',
    desc: '사장님들끼리 자유롭게 정보를 나누는 공간입니다.',
    fields: [],
    images: { count: 3, required: false },
    listColumns: [],
    comments: true,
  },
  faq: {
    type: 'FAQ',
    label: '자주묻는 질문',
    desc: '상가ON 이용 중 자주 묻는 질문을 모았습니다. 질문을 누르면 답변이 열립니다.',
    writeRoles: ['ADMIN'],
    writeDeniedMessage: '자주묻는 질문은 운영자만 등록할 수 있습니다.',
    writeLabel: '질문 등록',
    titleLabel: '질문',
    contentLabel: '답변',
    fields: [
      { key: 'category', label: '분류', type: 'select', options: ['회원', '매물', '상단노출', '빈 공실', '기타'], default: '회원', required: true },
    ],
    images: { count: 0, required: false },
    listColumns: [],
    display: 'faq',
  },
}

// 헤더 메뉴 (매물 검색은 게시판이 아닌 검색 화면)
export const NAV_MENUS = [
  { to: '/transfer', label: BOARDS.transfer.label },
  { to: '/search', label: '매물 검색' },
  { to: '/vacancy', label: BOARDS.vacancy.label },
  { to: '/market', label: BOARDS.market.label },
  { to: '/community', label: BOARDS.community.label },
  { to: '/faq', label: BOARDS.faq.label },
]

// 게시판 목록 맞춤 검색 (URL 쿼리 값 기준)
export function applyFilters(posts, filters = [], values = {}) {
  return filters.reduce((list, f) => {
    const value = values[f.key]
    if (!value) return list
    if (f.type === 'region') return list.filter((p) => matchRegion(p[f.key], value))
    if (f.type === 'text') {
      const q = value.trim().toLowerCase()
      return list.filter((p) => String(p[f.key] ?? '').toLowerCase().includes(q))
    }
    const range = f.ranges[Number(value)]
    if (!range) return list
    return list.filter((p) => {
      const n = p[f.key]
      if (n === null || n === undefined) return false
      return n >= range.min && (range.max === null || n < range.max)
    })
  }, posts)
}

export function canWriteBoard(info, user) {
  if (!user) return false
  return !info.writeRoles || info.writeRoles.includes(user.role)
}

export function formatFieldValue(field, value) {
  if (field.type === 'checkbox') return value ? '가능' : '불가'
  if (value === null || value === undefined || value === '') return '-'
  if (field.type === 'money' || field.type === 'number') {
    return `${Number(value).toLocaleString()}${field.unit ?? ''}`
  }
  return String(value)
}
