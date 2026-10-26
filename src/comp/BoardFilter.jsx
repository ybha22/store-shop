import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { REGIONS } from '../utils/board'
import { Button, Card, inputClass } from './ui'

// 게시판 맞춤 검색 (대표 지역 선택 + 제목 텍스트 + 금액 구간 선택). 조건은 URL 쿼리에 저장
export default function BoardFilter({ filters }) {
  const [params, setParams] = useSearchParams()
  const [values, setValues] = useState(() => Object.fromEntries(filters.map((f) => [f.key, params.get(f.key) ?? ''])))

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = new URLSearchParams()
    for (const f of filters) {
      const v = String(values[f.key] ?? '').trim()
      if (v) next.set(f.key, v)
    }
    setParams(next)
  }

  const handleReset = () => {
    setValues(Object.fromEntries(filters.map((f) => [f.key, ''])))
    setParams(new URLSearchParams())
  }

  return (
    <Card className="mb-6 p-4">
      <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
        {filters.map((f) => (
          <label key={f.key} className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">{f.label}</span>
            {f.type === 'region' ? (
              <select
                className={inputClass}
                value={values[f.key]}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              >
                <option value="">전국</option>
                {REGIONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.value}</option>
                ))}
              </select>
            ) : f.type === 'range' ? (
              <select
                className={inputClass}
                value={values[f.key]}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              >
                <option value="">전체</option>
                {f.ranges.map((r, i) => (
                  <option key={r.label} value={i}>{r.label}</option>
                ))}
              </select>
            ) : (
              <input
                className={inputClass}
                value={values[f.key]}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                placeholder={f.placeholder}
              />
            )}
          </label>
        ))}
        <div className="flex items-end gap-2">
          <Button type="submit" className="flex-1 lg:flex-none">검색</Button>
          <Button type="button" variant="secondary" onClick={handleReset}>초기화</Button>
        </div>
      </form>
    </Card>
  )
}
