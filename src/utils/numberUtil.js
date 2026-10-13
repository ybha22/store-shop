export function formatMoney(value) {
  if (value === null || value === undefined || value === '') return '-'
  return `${Number(value).toLocaleString()}만원`
}

export function formatCount(value, unit) {
  if (value === null || value === undefined || value === '') return '-'
  return `${Number(value).toLocaleString()}${unit}`
}

export function toNumberOrNull(value) {
  if (value === '' || value === null || value === undefined) return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}
