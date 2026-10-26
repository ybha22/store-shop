import { useCallback, useEffect, useRef, useState } from 'react'
import ListingCard from './ListingCard'

// 한 줄 가로 슬라이드 (PC 3개 / 태블릿 2개 / 모바일 1개씩 보임)
// 좌우 버튼은 부모가 원하는 위치에 두도록 renderControls로 전달
export default function ListingCarousel({ posts, renderControls }) {
  const trackRef = useRef(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const updateButtons = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    updateButtons()
    window.addEventListener('resize', updateButtons)
    return () => window.removeEventListener('resize', updateButtons)
  }, [updateButtons, posts.length])

  // 보이는 너비만큼(한 페이지) 이동
  const slide = (dir) => {
    const el = trackRef.current
    el.scrollBy({ left: dir * (el.clientWidth + 20), behavior: 'smooth' })
  }

  return (
    <>
      {renderControls(
        <div className="flex gap-1.5">
          <SlideButton label="이전" disabled={!canPrev} onClick={() => slide(-1)}>‹</SlideButton>
          <SlideButton label="다음" disabled={!canNext} onClick={() => slide(1)}>›</SlideButton>
        </div>,
      )}
      <div
        ref={trackRef}
        onScroll={updateButtons}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {posts.map((post) => (
          <div
            key={post.id}
            className="w-full shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
          >
            <ListingCard post={post} />
          </div>
        ))}
      </div>
    </>
  )
}

function SlideButton({ label, disabled, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-xl leading-none text-slate-600 shadow-sm transition-colors hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600"
    >
      {children}
    </button>
  )
}
