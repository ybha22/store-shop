const MAX_SIZE = 800
const QUALITY = 0.7

// 업로드 이미지를 축소/압축하여 dataURL로 변환 (localStorage 용량 절약)
export function compressImage(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('이미지 파일만 첨부할 수 있습니다.'))
      return
    }
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('이미지를 읽을 수 없습니다.'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('이미지를 읽을 수 없습니다.'))
      img.onload = () => {
        const scale = Math.min(1, MAX_SIZE / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', QUALITY))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

// 테스트 게시글용 플레이스홀더 이미지
export function placeholderImage(label, color) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
<rect width="800" height="600" fill="${color}"/>
<text x="400" y="315" font-family="sans-serif" font-size="44" font-weight="bold" fill="white" text-anchor="middle">${label}</text>
</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

// 테스트 매물용 Unsplash 무료 이미지
export function unsplashImage(photoId) {
  return `https://images.unsplash.com/photo-${photoId}?w=800&q=70&fit=crop`
}
