import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import { BOARDS, canWriteBoard } from '../utils/board'
import { toNumberOrNull } from '../utils/numberUtil'
import { compressImage } from '../utils/imageUtil'
import { canEditPost, createPost, getPost, updatePost } from '../service/postService'
import { Button, Card, Field, LinkButton, PageHeader, inputClass } from '../comp/ui'

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

function FieldInput({ field, value, onChange }) {
  switch (field.type) {
    case 'money':
    case 'number':
      return <NumberInput value={value} onChange={onChange} unit={field.unit} placeholder="선택" />
    case 'select':
      return (
        <select className={inputClass} value={value} onChange={(e) => onChange(e.target.value)}>
          {!field.required && <option value="">선택</option>}
          {field.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )
    case 'checkbox':
      return (
        <label className="flex h-[38px] cursor-pointer items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            className="h-4 w-4 accent-indigo-600"
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
          />
          {field.text}
        </label>
      )
    default:
      return (
        <input
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder ?? '선택'}
        />
      )
  }
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

function initialValue(field, original) {
  const v = original?.[field.key]
  if (field.type === 'checkbox') return !!v
  if (v === null || v === undefined) return field.default ?? ''
  return String(v)
}

function toSaveValue(field, value) {
  if (field.type === 'checkbox') return !!value
  if (field.type === 'money' || field.type === 'number') return toNumberOrNull(value)
  const text = String(value).trim()
  return text === '' ? null : text
}

export default function BoardFormPage() {
  const { board, id } = useParams()
  const info = BOARDS[board]
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const isEdit = !!id
  const original = isEdit ? getPost(id) : null
  const imageCount = info?.images.count ?? 0

  const [title, setTitle] = useState(original?.title ?? '')
  const [content, setContent] = useState(original?.content ?? '')
  const [values, setValues] = useState(() =>
    Object.fromEntries((info?.fields ?? []).map((f) => [f.key, initialValue(f, original)])),
  )
  const [images, setImages] = useState(() => {
    const list = original?.images ?? []
    return Array.from({ length: imageCount }, (_, i) => list[i] ?? null)
  })
  const [error, setError] = useState('')

  if (!info) return <Navigate to="/" replace />
  if (isEdit && (!original || original.boardType !== info.type)) {
    return <p className="py-16 text-center text-slate-500">게시글을 찾을 수 없습니다.</p>
  }
  if (isEdit && !canEditPost(original, user)) {
    return <p className="py-16 text-center text-slate-500">본인이 작성한 글만 수정할 수 있습니다.</p>
  }
  if (!isEdit && !canWriteBoard(info, user)) {
    return <p className="py-16 text-center text-slate-500">{info.writeDeniedMessage}</p>
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
    const missing = info.fields.filter(
      (f) => f.required && f.type !== 'checkbox' && String(values[f.key] ?? '').trim() === '',
    )
    if (missing.length > 0) {
      setError(`${missing.map((f) => f.label).join(', ')}을(를) 입력해 주세요.`)
      return
    }
    if (info.images.required && images.some((img) => !img)) {
      setError(`사진 ${imageCount}장을 모두 첨부해 주세요.`)
      return
    }
    const data = {
      title: title.trim(),
      content,
      images: images.filter(Boolean),
      ...Object.fromEntries(info.fields.map((f) => [f.key, toSaveValue(f, values[f.key])])),
    }
    try {
      const saved = isEdit ? updatePost(id, data) : createPost(info.type, data, user)
      navigate(info.display === 'faq' ? `/${board}` : `/${board}/${saved.id}`, { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <PageHeader title={`${info.label} ${isEdit ? '글 수정' : '글쓰기'}`} />
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label={info.titleLabel ?? '제목'}>
            <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} />
          </Field>
          {info.fields.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-3">
              {info.fields.map((field) => (
                <Field key={field.key} label={field.required && field.type === 'text' ? `${field.label} *` : field.label}>
                  <FieldInput
                    field={field}
                    value={values[field.key]}
                    onChange={(v) => setValues((prev) => ({ ...prev, [field.key]: v }))}
                  />
                </Field>
              ))}
            </div>
          )}
          {imageCount > 0 && (
            <div>
              <p className="mb-1.5 text-sm font-medium text-slate-700">
                사진첨부 {info.images.required && <span className="text-rose-500">*</span>}
                <span className="ml-2 font-normal text-slate-400">
                  {info.images.required ? `${imageCount}장 필수` : `선택 (최대 ${imageCount}장)`}
                </span>
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
          )}
          <Field label={info.contentLabel ?? '내용'}>
            <textarea
              className={`${inputClass} min-h-64 resize-y leading-relaxed`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Field>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <LinkButton to={isEdit && info.display !== 'faq' ? `/${board}/${id}` : `/${board}`} variant="secondary">취소</LinkButton>
            <Button type="submit">{isEdit ? '수정' : '등록'}</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
