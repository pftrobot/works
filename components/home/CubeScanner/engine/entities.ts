import * as THREE from 'three'
import * as CONST from '@constants'
import { makeScanbarTexture, makeCircleTexture, toLuminanceCanvasTexture } from './utils'

/**
 * 메인 큐브
 * 큐브 + 와이어프레임 + 글로우 큐브
 */
export class CubeRig {
  public cube: THREE.Mesh
  public cubeMat: THREE.MeshPhysicalMaterial
  public wireframe: THREE.LineSegments
  public wfMat: THREE.LineBasicMaterial
  public glowCube: THREE.Mesh
  public glowMat: THREE.MeshBasicMaterial
  private patternTex: THREE.Texture | null = null

  constructor(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
    // 큐브 본체
    const cubeGeo = new THREE.BoxGeometry(CONST.CUBE_SIZE, CONST.CUBE_SIZE, CONST.CUBE_SIZE)
    this.cubeMat = new THREE.MeshPhysicalMaterial({
      color: CONST.CUBE_COLOR,
      transparent: true,
      opacity: 0,
      transmission: CONST.CUBE_TRANSMISSION,
      thickness: CONST.CUBE_THICKNESS,
      roughness: CONST.CUBE_ROUGHNESS,
      metalness: CONST.CUBE_METALNESS,
      clearcoat: CONST.CUBE_CLEARCOAT,
      clearcoatRoughness: CONST.CUBE_CLEARCOAT_ROUGHNESS,
      ior: CONST.CUBE_IOR,
      reflectivity: CONST.CUBE_REFLECTIVITY,
      envMapIntensity: CONST.CUBE_ENVMAP_INTENSITY,
      emissive: new THREE.Color(CONST.CUBE_COLOR),
      emissiveIntensity: CONST.CUBE_EMISSIVE_INTENSITY,
    })
    this.cube = new THREE.Mesh(cubeGeo, this.cubeMat)
    scene.add(this.cube)

    // 큐브 와이어프레임 (엣지 강조)
    const wfGeo = new THREE.EdgesGeometry(cubeGeo)
    this.wfMat = new THREE.LineBasicMaterial({
      color: CONST.WIREFRAME_COLOR,
      transparent: true,
      opacity: 0,
    })
    this.wireframe = new THREE.LineSegments(wfGeo, this.wfMat)
    this.cube.add(this.wireframe)

    // 글로우용 백사이드 큐브
    const glowGeo = new THREE.BoxGeometry(
      CONST.GLOW_CUBE_SIZE,
      CONST.GLOW_CUBE_SIZE,
      CONST.GLOW_CUBE_SIZE,
    )
    this.glowMat = new THREE.MeshBasicMaterial({
      color: CONST.CUBE_COLOR,
      transparent: true,
      opacity: 0,
      side: CONST.GLOW_CUBE_SIDE,
    })
    this.glowCube = new THREE.Mesh(glowGeo, this.glowMat)
    this.cube.add(this.glowCube)
  }

  // 큐브에 패턴 적용 (이미지를 흑백 변환 후 alphaMap)
  loadPatternAlpha(patternSrc: string, renderer: THREE.WebGLRenderer) {
    const loader = new THREE.TextureLoader()
    loader.load(patternSrc, (raw) => {
      const lum = toLuminanceCanvasTexture(raw, { invert: false, threshold: 120 })
      lum.wrapS = lum.wrapT = THREE.RepeatWrapping
      lum.anisotropy = renderer.capabilities.getMaxAnisotropy() // MEMO: 비스듬한 각도에서 지글거림 최소화. 모바일에서 성능저하시 낮추기
      this.cubeMat.alphaMap = lum
      this.cubeMat.transparent = true
      this.cubeMat.needsUpdate = true
      this.patternTex = lum
    })
  }

  // Clean up
  dispose() {
    ;(this.cube.geometry as THREE.BufferGeometry).dispose()
    this.cubeMat.dispose()
    this.wfMat.dispose()
    ;(this.wireframe.geometry as THREE.BufferGeometry).dispose()
    ;(this.glowCube.geometry as THREE.BufferGeometry).dispose()
    this.glowMat.dispose()
    this.patternTex?.dispose()
  }
}

/* 스캔바 */
export class ScanBar {
  public mesh: THREE.Mesh
  public mat: THREE.MeshPhongMaterial

  constructor(scene: THREE.Scene, scanStartY: number) {
    const geo = new THREE.PlaneGeometry(
      CONST.SCANBAR_WIDTH,
      CONST.SCANBAR_HEIGHT,
      CONST.SCANBAR_SEGMENTS_W,
      CONST.SCANBAR_SEGMENTS_H,
    )
    const tex = makeScanbarTexture()
    this.mat = new THREE.MeshPhongMaterial({
      color: CONST.SCANBAR_COLOR,
      specular: CONST.SCANBAR_SPECULAR,
      shininess: CONST.SCANBAR_SHININESS,
      transparent: true,
      opacity: CONST.SCANBAR_OPACITY,
      map: tex,
      side: CONST.SCANBAR_SIDE,
    })
    this.mesh = new THREE.Mesh(geo, this.mat)
    this.mesh.position.set(0, scanStartY, CONST.SCANBAR_Z)
    this.mesh.scale.x = 0
    scene.add(this.mesh)
  }

  // Cleanup
  dispose() {
    ;(this.mesh.geometry as THREE.BufferGeometry).dispose()
    this.mat.map?.dispose()
    this.mat.dispose()
  }
}

/* 파티클 그룹 */
export class Particles {
  public points: THREE.Points
  public geo: THREE.BufferGeometry
  public uniforms: {
    uMap: { value: THREE.Texture }
    uOpacity: { value: number }
    uSizeScale: { value: number }
  }
  public initialPositions: Float32Array
  public initialSizes: Float32Array
  public seed: Float32Array

  constructor(scene: THREE.Scene, count: number, sizeStart: number) {
    const circleTex = makeCircleTexture()
    const pGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    // 초기 위치/색/사이즈 샘플링
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const radius = CONST.PARTICLE_BASE_RADIUS + Math.random() * CONST.PARTICLE_RADIUS_VARIATION
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(1 - 2 * Math.random())
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) - 0.5
      positions[i3 + 2] = radius * Math.cos(phi)

      const sizeVariation = Math.random()
      sizes[i] =
        sizeVariation < 0.3
          ? sizeStart * 0.3
          : sizeVariation < 0.7
            ? sizeStart * 0.8
            : sizeStart * (1.2 + Math.random() * 0.8)

      // 황금 톤의 컬러 분포
      const c = Math.random()
      let colorIndex = c < 0.2 ? 0 : c < 0.6 ? 1 : 2
      const [r, g, b] = CONST.PARTICLE_COLOR_SET[colorIndex]
      colors[i3] = r
      colors[i3 + 1] = g
      colors[i3 + 2] = b
    }

    // 수렴 계산 재료들
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    pGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    ;(pGeo.attributes.position as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage)
    ;(pGeo.attributes.size as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage)

    this.initialPositions = positions.slice()
    this.initialSizes = sizes.slice()
    this.seed = new Float32Array(count)
    for (let i = 0; i < count; i++) this.seed[i] = Math.random() * Math.PI * 2

    this.uniforms = {
      uMap: { value: circleTex },
      uOpacity: { value: 0.0 },
      uSizeScale: { value: 1.0 },
    }

    // Shader로 미세 설정 (거리에 따라 크기 보정)
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: CONST.PARTICLE_BLEND_MODE,
      uniforms: this.uniforms,
      vertexShader: `
        uniform float uSizeScale;
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          float distAtten = 1.0 / max(0.0001, -mv.z);
          gl_PointSize = size * uSizeScale * distAtten * 320.0;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform sampler2D uMap;
        uniform float uOpacity;
        varying vec3 vColor;
        void main() {
          vec4 tex = texture2D(uMap, gl_PointCoord);
          float a = pow(tex.a, 1.35) * uOpacity;
          if (a < 0.02) discard;
          gl_FragColor = vec4(vColor * tex.rgb, a);
        }
      `,
    })

    const pts = new THREE.Points(pGeo, mat)
    pts.renderOrder = CONST.PARTICLE_RENDER_ORDER
    scene.add(pts)

    this.geo = pGeo
    this.points = pts
  }

  // Cleanup
  dispose() {
    ;(this.points.material as THREE.ShaderMaterial).uniforms.uMap.value.dispose?.()
    ;(this.points.material as THREE.Material).dispose()
    this.geo.dispose()
  }
}

/* 충격파 */
export class Shockwave {
  public mesh: THREE.Mesh
  public mat: THREE.MeshBasicMaterial
  public start = 0
  constructor(scene: THREE.Scene) {
    // 링형 (첫 번째 반지름, 두 번째 반지름, segment 수)
    const geo = new THREE.RingGeometry(
      CONST.SHOCKWAVE_INNER_RADIUS,
      CONST.SHOCKWAVE_OUTER_RADIUS,
      CONST.SHOCKWAVE_SEGMENTS,
    )
    this.mat = new THREE.MeshBasicMaterial({
      color: CONST.SHOCKWAVE_COLOR,
      transparent: true,
      opacity: 0,
      blending: CONST.SHOCKWAVE_BLEND_MODE,
      side: CONST.SHOCKWAVE_SIDE,
    })
    this.mesh = new THREE.Mesh(geo, this.mat)
    this.mesh.rotation.x = CONST.SHOCKWAVE_ROTATION_X
    this.mesh.visible = false
    this.mesh.renderOrder = CONST.SHOCKWAVE_RENDER_ORDER
    scene.add(this.mesh)
  }

  // Cleanup
  dispose() {
    ;(this.mesh.geometry as THREE.BufferGeometry).dispose()
    this.mat.dispose()
  }
}
