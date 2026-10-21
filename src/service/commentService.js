import { KEYS, load, save, nextId } from '../utils/storage'

function getAll() {
  return load(KEYS.COMMENTS, [])
}

export function getComments(postId) {
  return getAll()
    .filter((c) => c.postId === Number(postId))
    .sort((a, b) => a.id - b.id)
}

export function countComments(postId) {
  return getAll().filter((c) => c.postId === Number(postId)).length
}

export function createComment(postId, content, writer) {
  const comments = getAll()
  const comment = {
    id: nextId(comments),
    postId: Number(postId),
    content,
    writerId: writer.userId,
    writerName: writer.name,
    createdAt: new Date().toISOString(),
  }
  save(KEYS.COMMENTS, [...comments, comment])
  return comment
}

export function deleteComment(id) {
  save(KEYS.COMMENTS, getAll().filter((c) => c.id !== Number(id)))
}

export function deleteCommentsByPost(postId) {
  save(KEYS.COMMENTS, getAll().filter((c) => c.postId !== Number(postId)))
}

export function canDeleteComment(comment, user) {
  return !!user && (user.role === 'ADMIN' || comment.writerId === user.userId)
}
