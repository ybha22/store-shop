import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import { BOARDS } from '../utils/board'
import { toNumberOrNull } from '../utils/numberUtil'
import { compressImage } from '../utils/imageUtil'
import { canEditPost, createPost, getPost, updatePost } from '../service/postService'
import { Button, Card, Field, LinkButton, PageHeader, inputClass } from '../comp/ui'

const IMAGE_COUNT = 3

function NumberInput({ value, onChange, unit, placeholder }) {
  return (
    <div className="relative">
      <input
        type="number"
        min="0"
        className={`${inputClass} pr-14`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-slate-400">
        {unit}
      </span>
    </div>
  )
}

function ImageSlot({ index, src, onSelect, onRemove }) {
  if (src) {
    return (
      <div className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-200">
        <img src={src} alt={`사진 ${index + 1}`} className="h-full w-full object-cover" />
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white hover:bg-black/80"
        >
          삭제
        </button>
      </div>
    )
  }
  return (
    <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 transition-colors hover:border-indigo-300 hover:text-indigo-500">
      <span className="text-2xl leading-none">+</span>
      <span className="text-xs">사진 {index + 1}</span>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          onSelect(e.target.files[0])
          e.target.value = ''
        }}
      />
    </label>
  )
}

const toInput = (v) => (v === null || v === undefined ? '' : String(v))

export default function BoardFormPage() {
  const { board, id } = useParams()
  const info = BOARDS[board]
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const isEdit = !!id
  const original = isEdit ? getPost(id) : null

  const [title, setTitle] = useState(original?.title ?? '')
  const [content, setContent] = useState(original?.content ?? '')
  const [premium, setPremium] = useState(toInput(original?.premium))
  const [monthlyRent, setMonthlyRent] = useState(toInput(original?.monthlyRent))
  const [parking, setParking] = useState(toInput(original?.parking))
  const [images, setImages] = useState(() => {
    const list = original?.images ?? []
    return Array.from({ length: IMAGE_COUNT }, (_, i) => list[i] ?? null)
  })
  const [error, setError] = useState('')

  if (!info) return <Navigate to="/transfer" replace />
  if (isEdit && (!original || original.boardType !== info.type)) {
    return <p className="py-16 text-center text-slate-500">게시글을 찾을 수 없습니다.</p>
  }
  if (isEdit && !canEditPost(original, user)) {
    return <p className="py-16 text-center text-slate-500">본인이 작성한 글만 수정할 수 있습니다.</p>
  }

  const setImageAt = (index, value) => {
    setImages((prev) => prev.map((img, i) => (i === index ? value : img)))
  }

  const handleSelectImage = async (index, file) => {
    if (!file) return
    try {
      setImageAt(index, await compressImage(file))
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 모두 입력해 주세요.')
      return
    }
    if (images.some((img) => !img)) {
      setError(`사진 ${IMAGE_COUNT}장을 모두 첨부해 주세요.`)
      return
    }
    const data = {
      title: title.trim(),
      content,
      premium: toNumberOrNull(premium),
      monthlyRent: toNumberOrNull(monthlyRent),
      parking: toNumberOrNull(parking),
      images,
    }
    try {
      const saved = isEdit ? updatePost(id, data) : createPost(info.type, data, user)
      navigate(`/${board}/${saved.id}`, { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <PageHeader title={`${info.label} ${isEdit ? '글 수정' : '글쓰기'}`} />
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="제목">
            <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="권리금">
              <NumberInput value={premium} onChange={setPremium} unit="만원" placeholder="선택" />
            </Field>
            <Field label="월세">
              <NumberInput value={monthlyRent} onChange={setMonthlyRent} unit="만원" placeholder="선택" />
            </Field>
            <Field label="주차가능대수">
              <NumberInput value={parking} onChange={setParking} unit="대" placeholder="선택" />
            </Field>
          </div>
          <div>
            <p className="mb-1.5 text-sm font-medium text-slate-700">
              사진첨부 <span className="text-rose-500">*</span>
              <span className="ml-2 font-normal text-slate-400">{IMAGE_COUNT}장 필수</span>
            </p>
            <div className="grid grid-cols-3 gap-3">
              {images.map((src, i) => (
                <ImageSlot
                  key={i}
                  index={i}
                  src={src}
                  onSelect={(file) => handleSelectImage(i, file)}
                  onRemove={() => setImageAt(i, null)}
                />
              ))}
            </div>
          </div>
          <Field label="내용">
            <textarea
              className={`${inputClass} min-h-64 resize-y leading-relaxed`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Field>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <LinkButton to={isEdit ? `/${board}/${id}` : `/${board}`} variant="secondary">취소</LinkButton>
            <Button type="submit">{isEdit ? '수정' : '등록'}</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
