export const KEYS = {
  MEMBERS: 'storeshop_members',
  POSTS: 'storeshop_posts',
  SESSION: 'storeshop_session',
}

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function remove(key) {
  localStorage.removeItem(key)
}

export function nextId(list) {
  return list.reduce((max, item) => Math.max(max, item.id), 0) + 1
}
