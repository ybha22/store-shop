const pad = (n) => String(n).padStart(2, '0')

export function formatDate(iso) {
  if (!iso) return '-'
  const d = new Date(iso)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function formatDateTime(iso) {
  if (!iso) return '-'
  const d = new Date(iso)
  return `${formatDate(iso)} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
