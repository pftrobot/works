import * as THREE from 'three'

/**
 * ENTITIES
 * */

// Main Cube
export const CUBE_SIZE = 1.3
export const CUBE_COLOR = 0xf5c064
export const CUBE_TRANSMISSION = 0.1
export const CUBE_THICKNESS = 0.5
export const CUBE_ROUGHNESS = 0.3
export const CUBE_METALNESS = 0.1
export const CUBE_CLEARCOAT = 0.8
export const CUBE_CLEARCOAT_ROUGHNESS = 0.2
export const CUBE_IOR = 1.4
export const CUBE_REFLECTIVITY = 0.5
export const CUBE_ENVMAP_INTENSITY = 0.7
export const CUBE_EMISSIVE_INTENSITY = 0.1

export const WIREFRAME_COLOR = 0xffb347

// Glow Cube
export const GLOW_CUBE_SIZE = 1.46
export const GLOW_CUBE_SIDE = THREE.BackSide

// ScanBar
export const SCANBAR_WIDTH = 2
export const SCANBAR_HEIGHT = 0.16
export const SCANBAR_SEGMENTS_W = 32
export const SCANBAR_SEGMENTS_H = 1
export const SCANBAR_COLOR = 0xc5a46a
export const SCANBAR_SPECULAR = 0xf5e9c4
export const SCANBAR_SHININESS = 68
export const SCANBAR_OPACITY = 1.0
export const SCANBAR_SIDE = THREE.DoubleSide
export const SCANBAR_Z = 1.8

// Particles
export const PARTICLE_BASE_RADIUS = 6
export const PARTICLE_RADIUS_VARIATION = 5
export const PARTICLE_COLOR_SET = [
  [1.0, 0.95, 0.8],
  [0.96, 0.75, 0.39],
  [0.72, 0.52, 0.04],
]
export const PARTICLE_RENDER_ORDER = 1000
export const PARTICLE_BLEND_MODE = THREE.AdditiveBlending
export const PARTICLE_SIZE_SCALE_START = 3.2
export const PARTICLE_SIZE_SCALE_END = 0.6

// Shockwave
export const SHOCKWAVE_INNER_RADIUS = 0.18
export const SHOCKWAVE_OUTER_RADIUS = 0.2
export const SHOCKWAVE_SEGMENTS = 64
export const SHOCKWAVE_COLOR = 0xf5c064
export const SHOCKWAVE_BLEND_MODE = THREE.AdditiveBlending
export const SHOCKWAVE_SIDE = THREE.DoubleSide
export const SHOCKWAVE_ROTATION_X = -Math.PI / 2
export const SHOCKWAVE_RENDER_ORDER = 1100

/**
 * UTILS
 * */

// Easing
export const EASE_OUT_BACK_S = 1.70158

// Luminance 변환
export const LUMINANCE_DEFAULT_THRESHOLD = 0
export const LUMINANCE_BRIGHTNESS_MULTIPLIER = 1.15

// Scanbar Texture
export const SCANBAR_CANVAS_WIDTH = 256
export const SCANBAR_CANVAS_HEIGHT = 32
export const SCANBAR_RADIUS = 14
export const SCANBAR_GRADIENT_COLORS = [
  { stop: 0.0, color: 'rgba(255,245,200,0.98)' },
  { stop: 0.18, color: 'rgba(255,230,100,1.00)' },
  { stop: 0.5, color: 'rgba(255,180,0,1.00)' },
  { stop: 0.82, color: 'rgba(255,200,50,1.00)' },
  { stop: 1.0, color: 'rgba(255,245,200,0.98)' },
]
export const SCANBAR_EDGE_GRADIENT = [
  { stop: 0, color: 'rgba(255,255,255,0.19)' },
  { stop: 0.12, color: 'rgba(255,255,255,0)' },
  { stop: 0.88, color: 'rgba(255,255,255,0)' },
  { stop: 1, color: 'rgba(255,255,255,0.19)' },
]

// Circle Texture (파티클용)
export const CIRCLE_TEXTURE_DEFAULT_SIZE = 256
export const CIRCLE_OUTER_GLOW = [
  { stop: 0, color: 'rgba(255,215,100,0.3)' },
  { stop: 0.2, color: 'rgba(255,200,80,0.2)' },
  { stop: 0.5, color: 'rgba(255,180,60,0.1)' },
  { stop: 1, color: 'rgba(255,160,40,0)' },
]
export const CIRCLE_MID_GLOW = [
  { stop: 0, color: 'rgba(255,235,150,0.6)' },
  { stop: 0.4, color: 'rgba(255,215,100,0.3)' },
  { stop: 1, color: 'rgba(255,195,80,0)' },
]
export const CIRCLE_CORE_GRAD = [
  { stop: 0, color: 'rgba(255,255,255,1)' },
  { stop: 0.3, color: 'rgba(255,245,200,0.9)' },
  { stop: 0.7, color: 'rgba(255,225,150,0.5)' },
  { stop: 1, color: 'rgba(255,205,100,0)' },
]

/**
 * Postprocessing
 * */
// Bloom 효과
export const BLOOM_INTENSITY = 0.7
export const BLOOM_RADIUS = 0.9
export const BLOOM_THRESHOLD = 0.2

// Afterimage 잔상 강도 (낮을수록 강함)
export const TRAILS_DAMP = 0.8

/**
 * AnimationController
 * */
// Rotation
export const ROTATION_SPEED = 0.0125

// Shockwave
export const SHOCKWAVE_START_SCALE = 0.6
export const SHOCKWAVE_END_SCALE = 6.6
export const SHOCKWAVE_START_OPACITY = 0.9
export const SHOCKWAVE_DURATION = 600

// Camera Zoom
export const CAMERA_START_Z = 5
export const CAMERA_END_Z = 3.2
export const CUBE_ZOOM_SCALE = 0.6
export const GLOW_SCALE_MULTIPLIER = 1.1
