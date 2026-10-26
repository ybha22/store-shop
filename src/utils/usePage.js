import { useSearchParams } from 'react-router-dom'

// URL의 page 쿼리(1부터) 기준으로 목록을 자르는 헬퍼
export function usePage(list, size) {
  const [params] = useSearchParams()
  const totalPages = Math.max(1, Math.ceil(list.length / size))
  const page = Math.min(Math.max(1, Number(params.get('page')) || 1), totalPages)
  return { page, totalPages, items: list.slice((page - 1) * size, page * size) }
}
