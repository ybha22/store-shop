import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES } from '../utils/board'
import { Button, inputClass } from './ui'

// 지역 / 점포명 / 업종으로 매물 검색 → /search?region=&name=&category=
export default function SearchBar({ initial = {}, large = false }) {
  const navigate = useNavigate()
  const [region, setRegion] = useState(initial.region ?? '')
  const [name, setName] = useState(initial.name ?? '')
  const [category, setCategory] = useState(initial.category ?? '')

  const handleSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (region.trim()) params.set('region', region.trim())
    if (name.trim()) params.set('name', name.trim())
    if (category) params.set('category', category)
    const qs = params.toString()
    navigate(`/search${qs ? `?${qs}` : ''}`)
  }

  const size = large ? 'py-3 text-base' : ''

  return (
    <form onSubmit={handleSubmit} className="grid gap-2 sm:grid-cols-[1fr_1fr_160px_auto]">
      <input
        className={`${inputClass} ${size}`}
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        placeholder="지역 (예: 강남구, 수원)"
      />
      <input
        className={`${inputClass} ${size}`}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="점포명"
      />
      <select className={`${inputClass} ${size}`} value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">업종 전체</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <Button type="submit" className={`px-6 ${size}`}>검색</Button>
    </form>
  )
}
