import * as THREE from 'three'
import * as CONST from '../constants'

/* Easing */
// 초반에 천천히, 끝으로 갈수록 빠르게
export const easeInCubic = (t: number) => t * t * t
// 초반에 빠르게, 끝으로 갈수록 천천히
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
// s 값이 클수록 더 튕김
export const easeOutBack = (t: number, s = CONST.EASE_OUT_BACK_S) =>
  1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2)
export const clamp01 = (t: number) => THREE.MathUtils.clamp(t, 0, 1)

// RGB → Gray scale
export function toLuminanceCanvasTexture(
  tex: THREE.Texture,
  opt: { invert?: boolean; threshold?: number } = {},
) {
  const { invert = false, threshold = CONST.LUMINANCE_DEFAULT_THRESHOLD } = opt
  const img = tex.image as HTMLImageElement | HTMLCanvasElement
  const c = document.createElement('canvas')
  c.width = img.width
  c.height = img.height
  const ctx = c.getContext('2d')!
  ctx.drawImage(img, 0, 0, c.width, c.height)
  const data = ctx.getImageData(0, 0, c.width, c.height)
  const d = data.data
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i],
      g = d[i + 1],
      b = d[i + 2]
    let L = 0.2126 * r + 0.7152 * g + 0.0722 * b
    L = Math.min(255, L * CONST.LUMINANCE_BRIGHTNESS_MULTIPLIER)
    if (threshold > 0) L = L > threshold ? 255 : 0
    if (invert) L = 255 - L
    d[i] = d[i + 1] = d[i + 2] = L
  }
  ctx.putImageData(data, 0, 0)
  const out = new THREE.CanvasTexture(c)
  out.colorSpace = THREE.SRGBColorSpace
  return out
}

// 스캔바 재질
export function makeScanbarTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = CONST.SCANBAR_CANVAS_WIDTH
  canvas.height = CONST.SCANBAR_CANVAS_HEIGHT
  const ctx = canvas.getContext('2d')!
  const radius = CONST.SCANBAR_RADIUS,
    w = canvas.width,
    h = canvas.height

  const grad = ctx.createLinearGradient(0, 0, 0, h)
  CONST.SCANBAR_GRADIENT_COLORS.forEach(({ stop, color }) => grad.addColorStop(stop, color))

  ctx.beginPath()
  ctx.moveTo(radius, 0)
  ctx.lineTo(w - radius, 0)
  ctx.quadraticCurveTo(w, 0, w, radius)
  ctx.lineTo(w, h - radius)
  ctx.quadraticCurveTo(w, h, w - radius, h)
  ctx.lineTo(radius, h)
  ctx.quadraticCurveTo(0, h, 0, h - radius)
  ctx.lineTo(0, radius)
  ctx.quadraticCurveTo(0, 0, radius, 0)
  ctx.closePath()
  ctx.fillStyle = grad
  ctx.fill()

  const edgeGrad = ctx.createLinearGradient(0, 0, 0, h)
  CONST.SCANBAR_EDGE_GRADIENT.forEach(({ stop, color }) => edgeGrad.addColorStop(stop, color))
  ctx.globalCompositeOperation = 'lighter'
  ctx.fillStyle = edgeGrad
  ctx.fillRect(0, 0, w, h)
  ctx.globalCompositeOperation = 'source-over'

  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

// 파티클 재질
export function makeCircleTexture(size = CONST.CIRCLE_TEXTURE_DEFAULT_SIZE) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const r = size / 2

  const outerGlow = ctx.createRadialGradient(r, r, 0, r, r, r)
  CONST.CIRCLE_OUTER_GLOW.forEach(({ stop, color }) => outerGlow.addColorStop(stop, color))
  ctx.fillStyle = outerGlow
  ctx.fillRect(0, 0, size, size)

  const midGlow = ctx.createRadialGradient(r, r, r * 0.1, r, r, r * 0.6)
  CONST.CIRCLE_MID_GLOW.forEach(({ stop, color }) => midGlow.addColorStop(stop, color))
  ctx.fillStyle = midGlow
  ctx.beginPath()
  ctx.arc(r, r, r * 0.6, 0, Math.PI * 2)
  ctx.fill()

  const coreGrad = ctx.createRadialGradient(r, r, 0, r, r, r * 0.3)
  CONST.CIRCLE_CORE_GRAD.forEach(({ stop, color }) => coreGrad.addColorStop(stop, color))
  ctx.fillStyle = coreGrad
  ctx.beginPath()
  ctx.arc(r, r, r * 0.3, 0, Math.PI * 2)
  ctx.fill()

  const tex = new THREE.CanvasTexture(canvas)
  tex.magFilter = THREE.LinearFilter
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.generateMipmaps = true
  return tex
}
