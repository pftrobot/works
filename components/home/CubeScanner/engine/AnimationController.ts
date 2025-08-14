import * as THREE from 'three'
import { CubeRig, ScanBar, Particles, Shockwave } from './entities'
import { createPostprocessing } from './postprocessing'
import { easeInCubic, easeOutBack, easeOutCubic, clamp01 } from './utils'
import { CubeScannerConfig, DefaultConfig, Phase } from '../types'
import {
  ROTATION_SPEED,
  SHOCKWAVE_START_SCALE,
  SHOCKWAVE_END_SCALE,
  SHOCKWAVE_START_OPACITY,
  SHOCKWAVE_DURATION,
  CAMERA_START_Z,
  CAMERA_END_Z,
  CUBE_ZOOM_SCALE,
  GLOW_SCALE_MULTIPLIER,
} from '../constants'

export class AnimationController {
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000)
  private renderer: THREE.WebGLRenderer

  private cube!: CubeRig
  private scanBar!: ScanBar
  private particles!: Particles
  private shock!: Shockwave

  private postfx: Awaited<ReturnType<typeof createPostprocessing>> | null = null

  private phase: Phase = 'cube_appearing'
  private clock = new THREE.Clock()
  private rafId = 0
  private done = false

  // 타임라인 타임스탬프(각 구간 시작 시 ms 기록)
  private cubeAppearStart = 0
  private scanHoldStart = 0
  private scanDisappearStart = 0
  private scanHolding = false
  private scanDisappearing = false
  private gatherAndAlignStart = 0
  private afterFlashFadeStart = 0
  private waitStart = 0
  private zoomOutStart = 0

  private startQuat = new THREE.Quaternion()
  private targetQuat = new THREE.Quaternion().identity()

  private flashFired = false
  private rotationSpeed = ROTATION_SPEED

  private onEnterFullscreen?: () => void
  private onFlash?: (on: boolean, durationMs: number) => void
  private onComplete?: () => void

  private cfg: CubeScannerConfig

  constructor(
    host: HTMLElement,
    patternSrc: string,
    cfg: Partial<CubeScannerConfig> = {},
    hooks: {
      onEnterFullscreen?: () => void
      onFlash?: (on: boolean, durationMs: number) => void
      onComplete?: () => void
    } = {},
  ) {
    this.cfg = { ...DefaultConfig, ...cfg }
    this.onEnterFullscreen = hooks.onEnterFullscreen
    this.onFlash = hooks.onFlash
    this.onComplete = hooks.onComplete

    // renderer 초기화 및 DOM 부착
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setClearColor(0x111111, 1)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.sortObjects = true
    host.appendChild(this.renderer.domElement)

    // camera
    this.camera.position.z = CAMERA_START_Z
    this.camera.lookAt(0, 0, 0)

    // entity 구성
    this.cube = new CubeRig(this.scene, this.renderer)
    this.cube.loadPatternAlpha(patternSrc, this.renderer)
    this.scanBar = new ScanBar(this.scene, this.cfg.SCAN_START_Y)
    this.particles = new Particles(
      this.scene,
      this.cfg.PARTICLE_COUNT,
      this.cfg.PARTICLE_SIZE_START,
    )
    this.shock = new Shockwave(this.scene)

    // 조명
    this.scene.add(new THREE.AmbientLight(0x4a3829, 0.4))
    const dir = new THREE.DirectionalLight(0xffd700, 1.8)
    dir.position.set(3, 3, 3)
    dir.castShadow = true
    this.scene.add(dir)
    const dir2 = new THREE.DirectionalLight(0xff8c42, 1.0)
    dir2.position.set(-2, 2, -2)
    this.scene.add(dir2)
    const point = new THREE.PointLight(0xf5c064, 1.5, 10)
    point.position.set(0, 0, 4)
    this.scene.add(point)
    const back = new THREE.DirectionalLight(0xffb347, 0.8)
    back.position.set(0, -2, -3)
    this.scene.add(back)

    createPostprocessing(this.renderer, this.scene, this.camera).then((v) => (this.postfx = v))

    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  }

  private handleResize = () => {
    const canvas = this.renderer.domElement
    const host = canvas.parentElement!
    const inOverlay = !!host.closest('#cube-overlay-root')
    const w = inOverlay ? window.innerWidth : host.clientWidth || 600
    const h = inOverlay ? window.innerHeight : host.clientHeight || 600
    this.renderer.setSize(w, h)
    this.postfx?.composer?.setSize(w, h)
    ;(this.postfx as any)?.bloom?.setSize?.(w, h)
    ;(this.postfx as any)?.trailsPass?.setSize?.(w, h)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  /* 렌더 루프 시작 */
  start() {
    this.rafId = requestAnimationFrame(this.animate)
  }

  /* 모든 리소스 cleanup 및 DOM 에서 분리 */
  dispose(host?: HTMLElement) {
    cancelAnimationFrame(this.rafId)
    window.removeEventListener('resize', this.handleResize)
    try {
      this.postfx?.composer?.dispose?.()
      this.postfx?.bloom?.dispose?.()
      this.postfx?.trailsPass?.dispose?.()
    } catch {}
    this.renderer.dispose()
    this.cube.dispose()
    this.scanBar.dispose()
    this.particles.dispose()
    this.shock.dispose()
    if (host) {
      const el = this.renderer.domElement
      if (el && el.parentElement === host) host.removeChild(el)
    }
  }

  /**
   * 메인 루프
   * - phase 별로 타임라인 진행
   * - 큐브 등장 -> 큐브 스캔 -> 파티클 수렴 -> 큐브 정렬 -> 줌아웃
   */
  private animate = () => {
    this.rafId = requestAnimationFrame(this.animate)
    const ms = this.clock.getElapsedTime() * 1000
    const s = ms * 0.001

    // Config
    const {
      CUBE_APPEAR_DURATION,
      SCAN_HOLD_BEFORE_DISAPPEAR,
      SCAN_DISAPPEAR_DURATION,
      SCANBAR_SPEED,
      SCAN_END_Y,
      PARTICLE_PREFADE_MARGIN,
      PARTICLE_START_Y,
      PARTICLE_VISIBLE_OPACITY,
      PARTICLE_GATHER_MS,
      ALIGN_DURATION_MS,
      SHAKE_START_THRESHOLD,
      SHAKE_INTENSITY,
      SHAKE_FREQUENCY,
      CONVERGE_WHOOSH_START,
      CONVERGE_SNAP_AT,
      WAIT_AFTER_ALIGN_MS,
      PARTICLE_FADE_AFTER_FLASH_MS,
      ZOOM_OUT_DURATION_MS,
      FLASH_DURATION_MS,
    } = this.cfg

    // 1) 등장
    if (this.phase === 'cube_appearing') {
      if (this.cubeAppearStart === 0) this.cubeAppearStart = ms
      const t = clamp01((ms - this.cubeAppearStart) / CUBE_APPEAR_DURATION)
      const op = easeOutCubic(t)
      const pop = easeOutBack(t, 1.2)
      this.cube.cubeMat.opacity = 0.3 * op
      this.cube.wfMat.opacity = 0.8 * op
      this.cube.glowMat.opacity = 0.05 * op
      const startScale = 0.6,
        target = 1.0
      this.cube.cube.scale.setScalar(startScale + (target - startScale) * pop)
      this.scanBar.mesh.scale.x = easeOutCubic(t)
      if (t >= 1) this.phase = 'rotating'
    }

    // 2) 회전 + 스캔바 하강
    if (this.phase === 'rotating') {
      const cube = this.cube.cube
      cube.rotation.x += this.rotationSpeed
      cube.rotation.y += this.rotationSpeed * 0.7
      cube.rotation.z += this.rotationSpeed * 0.5

      if (!this.scanHolding && !this.scanDisappearing) this.scanBar.mesh.position.y -= SCANBAR_SPEED
      if (
        this.scanBar.mesh.position.y <= SCAN_END_Y &&
        !this.scanHolding &&
        !this.scanDisappearing
      ) {
        this.scanHolding = true
        this.scanHoldStart = ms
      }

      // 파티클 투명도 사전 부스팅
      if (
        this.scanBar.mesh.position.y <= PARTICLE_START_Y + PARTICLE_PREFADE_MARGIN &&
        this.particles.uniforms.uOpacity.value < PARTICLE_VISIBLE_OPACITY
      ) {
        this.particles.uniforms.uOpacity.value = Math.min(
          PARTICLE_VISIBLE_OPACITY,
          this.particles.uniforms.uOpacity.value + 0.12,
        )
      }

      // 수렴 시작 트리거
      if (this.scanBar.mesh.position.y <= PARTICLE_START_Y + PARTICLE_PREFADE_MARGIN) {
        this.phase = 'gathering_and_aligning'
        this.gatherAndAlignStart = ms
        this.particles.uniforms.uOpacity.value = Math.max(
          this.particles.uniforms.uOpacity.value,
          PARTICLE_VISIBLE_OPACITY * 0.85,
        )
        this.startQuat.copy(this.cube.cube.quaternion)
        // 스캔바 수축 (페이드랑 같이)
        this.scanDisappearing = true
        this.scanDisappearStart = ms
      }
    }

    // 2-1) 스캔바 hold → 수축 시작
    if (this.scanHolding && this.phase === 'rotating') {
      const holdT = (ms - this.scanHoldStart) / SCAN_HOLD_BEFORE_DISAPPEAR
      if (!this.scanDisappearing) {
        const shrinkT = Math.min(holdT / 0.5, 1)
        this.scanBar.mesh.scale.x = 1 - shrinkT
        if (shrinkT >= 1) {
          this.scanHolding = false
          this.scanDisappearing = true
          this.scanDisappearStart = ms
        }
      }
    }

    // 2-2) 스캔바 페이드아웃
    if (this.scanDisappearing && this.scanDisappearStart > 0) {
      const disappearT = Math.min((ms - this.scanDisappearStart) / SCAN_DISAPPEAR_DURATION, 1)
      const e = easeOutCubic(disappearT)
      this.scanBar.mesh.scale.x = 0
      this.scanBar.mat.opacity = 0.8 * (1 - e)
      if (disappearT >= 1) {
        this.scanBar.mesh.visible = false
        this.scanDisappearing = false
      }
    }

    // 3) 파티클 수렴 + 큐브 정렬/미세 흔들림
    if (this.phase === 'gathering_and_aligning') {
      const t = clamp01((ms - this.gatherAndAlignStart) / PARTICLE_GATHER_MS)
      // 수렴 곡선: 초반 완만 → 후반 가속
      const w0 = CONVERGE_WHOOSH_START
      const conv =
        t < w0
          ? 0.65 * Math.pow(t / w0, 3)
          : 0.65 + 0.35 * (1 - Math.pow(2, -10 * ((t - w0) / (1 - w0))))
      const swirlAmp = THREE.MathUtils.lerp(1.2, 0.0, conv)
      this.particles.uniforms.uSizeScale.value = THREE.MathUtils.lerp(3.2, 0.425, conv)
      const willFlash = !this.flashFired && conv >= CONVERGE_SNAP_AT

      // 포지션 업데이트(초기 스냅샷 → 중심으로)
      const arr = this.particles.geo.attributes.position.array as Float32Array
      const sizes = this.particles.geo.attributes.size.array as Float32Array
      for (let i = 0; i < this.cfg.PARTICLE_COUNT; i++) {
        const i3 = i * 3
        const x0 = this.particles.initialPositions[i3]
        const y0 = this.particles.initialPositions[i3 + 1]
        const z0 = this.particles.initialPositions[i3 + 2]
        const sseed = this.particles.seed[i]
        const sx = Math.sin(s * 2.0 + sseed) * swirlAmp
        const sy = Math.cos(s * 2.2 + sseed) * swirlAmp * 0.6
        const sz = Math.sin(s * 1.8 + sseed) * swirlAmp
        const k = 1 - conv
        arr[i3] = x0 * k + sx * k
        arr[i3 + 1] = y0 * k + sy * k
        arr[i3 + 2] = z0 * k + sz * k
        if (willFlash) {
          // 스냅 직전 살짝 수축감
          arr[i3] *= 0.2
          arr[i3 + 1] *= 0.2
          arr[i3 + 2] *= 0.2
        }
        sizes[i] = this.particles.initialSizes[i]
      }
      this.particles.geo.attributes.position.needsUpdate = true
      this.particles.geo.attributes.size.needsUpdate = true

      // 큐브 정렬(슬러프) + 마지막 구간 흔들림
      const tAlign = clamp01((ms - this.gatherAndAlignStart) / ALIGN_DURATION_MS)
      const baseQuat = new THREE.Quaternion().slerpQuaternions(
        this.startQuat,
        this.targetQuat,
        easeOutCubic(tAlign),
      )
      if (tAlign > SHAKE_START_THRESHOLD && tAlign < 0.95) {
        const shakeTime = ms * (SHAKE_FREQUENCY * 0.001)
        const shakeIntensity =
          SHAKE_INTENSITY *
          (1 - ((tAlign - SHAKE_START_THRESHOLD) / (0.95 - SHAKE_START_THRESHOLD)) * 0.7)
        const shakeQuat = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(
            (Math.sin(shakeTime * 1.3) + Math.random() - 0.5) * shakeIntensity,
            (Math.cos(shakeTime * 1.7) + Math.random() - 0.5) * shakeIntensity,
            (Math.sin(shakeTime * 2.1) + Math.random() - 0.5) * shakeIntensity,
          ),
        )
        this.cube.cube.quaternion.multiplyQuaternions(baseQuat, shakeQuat)
      } else {
        this.cube.cube.quaternion.copy(baseQuat)
      }

      // 스냅 타이밍: 플래시/쇼크웨이브 트리거
      if (willFlash && !this.flashFired) {
        this.flashFired = true
        this.onFlash?.(true, FLASH_DURATION_MS)
        setTimeout(() => this.onFlash?.(false, FLASH_DURATION_MS), FLASH_DURATION_MS)
        this.shock.mesh.visible = true
        this.shock.mesh.scale.set(0.6, 0.6, 0.6)
        this.shock.mat.opacity = 0.9
        this.shock.start = ms
      }

      if (tAlign >= 1) {
        this.waitStart = ms
        this.phase = 'waiting'
      }
    }

    // 3-1) 쇼크웨이브 감쇠
    if (this.shock.mesh.visible) {
      const sd = (ms - this.shock.start) / SHOCKWAVE_DURATION
      if (sd >= 1) {
        this.shock.mesh.visible = false
        this.shock.mat.opacity = 0
      } else {
        const e = easeOutCubic(sd)
        const scale = SHOCKWAVE_START_SCALE + e * SHOCKWAVE_END_SCALE
        this.shock.mesh.scale.set(scale, scale, scale)
        this.shock.mat.opacity = SHOCKWAVE_START_OPACITY * (1 - e)
      }
    }

    // 4) 대기/파티클 페이드아웃 → 풀스크린 전환
    if (this.phase === 'waiting') {
      const waitT = (ms - this.waitStart) / WAIT_AFTER_ALIGN_MS
      if (this.afterFlashFadeStart === 0) this.afterFlashFadeStart = ms
      const offT = (ms - this.afterFlashFadeStart) / PARTICLE_FADE_AFTER_FLASH_MS
      this.particles.uniforms.uOpacity.value = Math.max(
        0,
        this.cfg.PARTICLE_VISIBLE_OPACITY * (1 - offT),
      )
      if (waitT >= 1) {
        this.zoomOutStart = ms
        this.onEnterFullscreen?.() // 포털 전환(오버레이 리사이즈 대응)
        requestAnimationFrame(() => window.dispatchEvent(new Event('resize')))
        this.phase = 'zooming_out'
      }
    }

    // 5) 줌아웃 → 완료
    if (this.phase === 'zooming_out') {
      const t = clamp01((ms - this.zoomOutStart) / ZOOM_OUT_DURATION_MS)
      const e = easeInCubic(t)

      this.camera.position.z = THREE.MathUtils.lerp(CAMERA_START_Z, CAMERA_END_Z, e)
      this.camera.updateProjectionMatrix()
      const scale = 1.0 + e * CUBE_ZOOM_SCALE
      this.cube.cube.scale.setScalar(scale)
      this.cube.glowCube.scale.setScalar(GLOW_SCALE_MULTIPLIER * scale)

      const fade = 1.0 - e
      this.cube.cubeMat.opacity = 0.3 * fade
      this.cube.wfMat.opacity = 0.8 * fade
      this.cube.glowMat.opacity = 0.05 * fade

      // [추가] 줌아웃 종료 시 complete로 전환
      if (t >= 1) {
        this.phase = 'complete'
      }
    }

    // 중복 완료 콜백 방지
    if (this.phase === 'complete' && !this.done) {
      this.done = true
      this.onComplete?.()
      // cancelAnimationFrame(this.rafId) // 성능상 루프 정지시 추가
    }

    // 렌더: postfx가 준비되면 composer.render() 사용
    this.postfx?.composer
      ? this.postfx.composer.render()
      : this.renderer.render(this.scene, this.camera)
  }
}
