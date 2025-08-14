import * as THREE from 'three'
import { BLOOM_INTENSITY, BLOOM_RADIUS, BLOOM_THRESHOLD, TRAILS_DAMP } from '../constants'

/**
 * PostFX Type
 * - composer: 모든 후처리 패스를 관리하는 EffectComposer
 * - bloom: 화면의 발광 영역을 강조하는 Bloom 효과
 * - trailsPass: 물체 이동 시 잔상을 남기는 Afterimage 효과
 */
export type PostFX = {
  composer: any
  bloom: any
  trailsPass: any
}

/**
 * 후처리(Postprocessing) 초기화 함수
 *
 * 특징:
 * 1. three/examples 모듈을 동적 import → 초기 번들 크기 절감
 * 2. 렌더러 크기에 맞춰 각 패스(RenderPass, Bloom, Afterimage) 초기화
 * 3. 실패 시 null 반환 (런타임 에러 방지)
 *
 * @param renderer WebGLRenderer 인스턴스
 * @param scene 렌더링할 Scene 객체
 * @param camera 렌더링할 Camera 객체
 * @returns PostFX 객체 또는 null
 */
export async function createPostprocessing(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
): Promise<PostFX | null> {
  try {
    // Dynamic import
    const [{ EffectComposer }, { RenderPass }, { UnrealBloomPass }, { AfterimagePass }] =
      await Promise.all([
        import('three/examples/jsm/postprocessing/EffectComposer.js'),
        import('three/examples/jsm/postprocessing/RenderPass.js'),
        import('three/examples/jsm/postprocessing/UnrealBloomPass.js'),
        import('three/examples/jsm/postprocessing/AfterimagePass.js'),
      ])

    // composer 초기화 및 사이즈 설정
    const composer = new EffectComposer(renderer)
    const sz = renderer.getSize(new THREE.Vector2())
    composer.setSize(sz.x, sz.y)

    // Bloom 효과 (강도, 반경, 임계값)
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(sz.x, sz.y),
      BLOOM_INTENSITY,
      BLOOM_RADIUS,
      BLOOM_THRESHOLD,
    )

    // 잔상 효과 (Afterimage)
    const trailsPass = new AfterimagePass()
    trailsPass.uniforms['damp'].value = TRAILS_DAMP

    // 후처리 패스 순서 등록
    composer.addPass(new RenderPass(scene, camera))
    composer.addPass(bloom)
    composer.addPass(trailsPass)
    return { composer, bloom, trailsPass }
  } catch (e) {
    console.warn('Postprocessing unavailable:', e)
    return null
  }
}
