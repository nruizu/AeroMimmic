import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { BIRDS } from '../data/mockData'

const PARTICLE_COUNT = 1500
const CURVE_SAMPLES = 140
const SIDE_LINES = 4
const LENGTH_SCALE = 0.35
const RADIUS_SCALE = 0.4

function getBeakParams(birdId) {
  const b = BIRDS[birdId]
  const scaled = b.beakProfile.map(([x, y]) => [x * LENGTH_SCALE, y * RADIUS_SCALE])
  const totalLen = scaled[scaled.length - 1][0]
  const maxRad = Math.max(...scaled.map(([, r]) => r))
  const offset = totalLen / 2
  return { scaled, totalLen, maxRad, offset, turb: b.turbulenceFactor }
}

function getRadiusAt(x, scaled) {
  if (x <= scaled[0][0]) return scaled[0][1]
  if (x >= scaled[scaled.length - 1][0]) return 0
  for (let i = 0; i < scaled.length - 1; i++) {
    if (x >= scaled[i][0] && x <= scaled[i + 1][0]) {
      const t = (x - scaled[i][0]) / (scaled[i + 1][0] - scaled[i][0])
      return scaled[i][1] + (scaled[i + 1][1] - scaled[i][1]) * t
    }
  }
  return 0
}

function generateStreamline(yStart, side, params) {
  const { scaled, totalLen, offset, turb } = params
  const pts = []
  for (let wx = -3.2; wx <= 3.2; wx += 0.06) {
    const rrx = offset - wx
    const rLocal = getRadiusAt(Math.max(0, Math.min(rrx, totalLen)), scaled)
    const surface = rLocal * 1.2
    let y = yStart * side

    if (rrx > -0.3 && rrx < totalLen + 0.3) {
      const infl = Math.min(1, Math.max(0, 1 - Math.abs(rrx - totalLen * 0.4) / (totalLen * 0.6 + 0.2)))
      if (Math.abs(y) < surface + 0.02) {
        y = (surface + 0.02 + Math.max(0, yStart - surface) * (1 - infl * 0.85)) * side
      }
      const accelPull = infl * Math.min(0.25, yStart * 0.4) * side
      y += accelPull
    }

    if (rrx < -0.05 && rrx > -0.5) {
      const preInfl = (-rrx - 0.05) / 0.45
      const prePull = preInfl * turb * 0.04 * side
      y += prePull
    }

    if (rrx > totalLen + 0.15) {
      const wakeX = rrx - totalLen - 0.15
      const decay = Math.exp(-wakeX * 1.2)
      const osc = Math.sin(wakeX * 5 + Math.abs(side) * 2) * turb * 0.18 * decay
      y += osc * side
    }

    pts.push(new THREE.Vector3(wx, y, 0))
  }
  return pts
}

function generateControlPoints(birdId) {
  const params = getBeakParams(birdId)
  const lines = []
  for (let side of [-1, 1]) {
    for (let i = 1; i <= SIDE_LINES; i++) {
      const t = i / (SIDE_LINES + 1)
      const yStart = 0.02 + t * (params.maxRad * 3.0 + 0.3)
      lines.push(generateStreamline(yStart, side, params))
    }
  }
  return lines
}

function sampleCurves(controlPoints) {
  return controlPoints.map((pts) => {
    const curve = new THREE.CatmullRomCurve3(pts)
    const samples = []
    for (let i = 0; i < CURVE_SAMPLES; i++) {
      samples.push(curve.getPoint(i / (CURVE_SAMPLES - 1)))
    }
    return samples
  })
}

function getFlowLineColor(turb, speed, idx) {
  const heat = Math.min(1, turb * 0.7 + (speed / 240) * 0.25 + (idx % SIDE_LINES) / SIDE_LINES * 0.2)
  if (heat < 0.45) {
    return new THREE.Color().setHSL(0.56 - heat * 0.15, 0.75, 0.5 + heat * 0.3)
  }
  return new THREE.Color().setHSL(0.56 - 0.45 * 0.15 - (heat - 0.45) * 0.55, 0.85, 0.5)
}

function BeakModel({ birdId }) {
  const meshRef = useRef(null)
  const bird = BIRDS[birdId]

  const { geometry, offset } = useMemo(() => {
    const profile = bird.beakProfile
    const pts = profile.map(([x, y]) => new THREE.Vector2(y * RADIUS_SCALE, x * LENGTH_SCALE))
    const geo = new THREE.LatheGeometry(pts, 32)
    geo.computeVertexNormals()
    const len = profile[profile.length - 1][0] * LENGTH_SCALE
    return { geometry: geo, offset: len / 2 }
  }, [birdId])

  return (
    <mesh ref={meshRef} geometry={geometry} position={[offset, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
      <meshPhysicalMaterial
        color={bird.color}
        metalness={0.0}
        roughness={0.15}
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
        envMapIntensity={0.8}
        depthWrite={false}
      />
    </mesh>
  )
}

function FlowLines({ birdId, speed }) {
  const controlPoints = useMemo(() => generateControlPoints(birdId), [birdId])
  const curves = useMemo(() => sampleCurves(controlPoints), [controlPoints])
  const turb = BIRDS[birdId].turbulenceFactor

  const lines = useMemo(() => {
    return curves.map((samples, idx) => {
      const pts = samples.map((p) => new THREE.Vector3(p.x, p.y, p.z))
      const geo = new THREE.BufferGeometry().setFromPoints(pts)
      const color = getFlowLineColor(turb, speed, idx)
      return { geo, color, idx, side: idx < SIDE_LINES ? -1 : 1 }
    })
  }, [curves, turb, speed])

  return (
    <group>
      {lines.map((l) => (
        <line key={l.idx} geometry={l.geo}>
          <lineBasicMaterial
            color={l.color}
            transparent
            opacity={0.15 + (1 - (l.idx % SIDE_LINES) / SIDE_LINES) * 0.2}
          />
        </line>
      ))}
    </group>
  )
}

function ParticleSystem({ birdId, speed }) {
  const pointsRef = useRef(null)
  const particleData = useRef(null)
  const bird = BIRDS[birdId]
  const turb = bird.turbulenceFactor
  const params = getBeakParams(birdId)

  const controlPoints = useMemo(() => generateControlPoints(birdId), [birdId])
  const curves = useMemo(() => sampleCurves(controlPoints), [controlPoints])
  const totalLines = curves.length

  const { geometry } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const colors = new Float32Array(PARTICLE_COUNT * 3)
    const info = new Float32Array(PARTICLE_COUNT * 3)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const lineIdx = Math.floor(Math.random() * totalLines)
      const progress = Math.random()
      const samples = curves[lineIdx] || curves[0]
      const sIdx = Math.floor(progress * (CURVE_SAMPLES - 1))
      const p = samples[Math.min(sIdx, CURVE_SAMPLES - 1)] || new THREE.Vector3(0, 0, 0)

      pos[i * 3] = p.x
      pos[i * 3 + 1] = p.y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.1

      const c = getFlowLineColor(turb, speed, lineIdx)
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b

      info[i * 3] = lineIdx
      info[i * 3 + 1] = progress
      info[i * 3 + 2] = (Math.random() - 0.5) * 0.06
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    particleData.current = info
    return { geometry: geo }
  }, [curves, turb, speed])

  useFrame((state, delta) => {
    if (!pointsRef.current || !particleData.current) return
    const time = state.clock.getElapsedTime()
    const positions = pointsRef.current.geometry.attributes.position.array
    const info = particleData.current
    const speedFactor = speed / 240

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      let lineIdx = Math.round(info[i * 3])
      lineIdx = Math.min(lineIdx, totalLines - 1)
      let progress = info[i * 3 + 1]
      const lateralOff = info[i * 3 + 2]

      const samples = curves[lineIdx]
      if (!samples || samples.length < 2) continue

      const sIdxNow = Math.floor(progress * (CURVE_SAMPLES - 1))
      const idx0 = Math.min(sIdxNow, CURVE_SAMPLES - 1)
      const pNow = samples[idx0]
      const rrx = pNow ? params.offset - pNow.x : params.offset

      const rLocal = getRadiusAt(Math.max(0, Math.min(rrx, params.totalLen)), params.scaled)
      const nearSurface = rLocal > 0.01 && Math.abs(pNow ? pNow.y : 0) < rLocal * 2.5
      const accel = nearSurface ? 1.6 : 1.0

      const advance = -speedFactor * delta * 0.4 * accel
      progress += advance

      if (progress <= 0) {
        progress = 1.0
        lineIdx = Math.floor(Math.random() * totalLines)
        info[i * 3 + 2] = (Math.random() - 0.5) * 0.06
      }

      const sIdx = Math.floor(progress * (CURVE_SAMPLES - 1))
      const frac = (progress * (CURVE_SAMPLES - 1)) - sIdx
      const idxA = Math.min(sIdx, CURVE_SAMPLES - 1)
      const idxB = Math.min(sIdx + 1, CURVE_SAMPLES - 1)
      const pA = samples[idxA]
      const pB = samples[idxB]

      const rrxB = pA ? params.offset - pA.x : params.offset
      const wakeFactor = rrxB > params.totalLen + 0.2
        ? Math.min(1, Math.exp(-(rrxB - params.totalLen - 0.2) * 1.5))
        : 0
      const turbNoise = (Math.sin(i * 2.1 + progress * 25 + time * 2.5) * 0.5) * turb * 0.18 * (0.3 + wakeFactor * 0.7)

      positions[i * 3] = pA.x + (pB.x - pA.x) * frac
      positions[i * 3 + 1] = pA.y + (pB.y - pA.y) * frac + lateralOff + turbNoise
      positions[i * 3 + 2] = (pA.z + (pB.z - pA.z) * frac) + (Math.sin(i + time * 1.5) * 0.5) * turb * 0.04

      info[i * 3] = lineIdx
      info[i * 3 + 1] = progress
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.75}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function TurbulenceViz({ birdId }) {
  const meshRef = useRef(null)
  const bird = BIRDS[birdId]
  const turb = bird.turbulenceFactor
  const count = 80

  const params = getBeakParams(birdId)
  const wakeCenterX = params.offset - params.totalLen - 0.3

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const spread = 0.2 + Math.random() * 0.8
      const angle = Math.random() * Math.PI * 2
      const xOff = Math.random() * 1.5
      pos[i * 3] = wakeCenterX + xOff
      pos[i * 3 + 1] = Math.cos(angle) * spread
      pos[i * 3 + 2] = Math.sin(angle) * spread
    }
    return pos
  }, [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const pos = meshRef.current.geometry.attributes.position.array
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      const speed_ = 1 + Math.sin(i * 0.5) * 0.5
      const r = 0.15 + turb * 0.4
      pos[i * 3] = wakeCenterX + (i / count) * 1.8 + Math.sin(t * speed_ + i * 0.7) * turb * 0.15
      pos[i * 3 + 1] = Math.sin(t * speed_ * 1.3 + i) * r
      pos[i * 3 + 2] = Math.cos(t * speed_ * 1.1 + i * 0.7) * r
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  if (turb < 0.15) return null

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} itemSize={3} array={positions} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={bird.colorSecondary}
        transparent
        opacity={turb * 0.45}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

function GridFloor() {
  return (
    <group>
      <gridHelper args={[8, 20, '#1a1a3e', '#0f0f2a']} position={[0, -0.5, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.52, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial color="#060614" />
      </mesh>
    </group>
  )
}

export default function SimulationCanvas({ birdId, speed }) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden">
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 1.8, 5.5]} fov={38} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 6, 4]} intensity={0.9} />
        <directionalLight position={[-3, 1, -4]} intensity={0.25} color="#0077b6" />

        <BeakModel birdId={birdId} />
        <FlowLines birdId={birdId} speed={speed} />
        <ParticleSystem birdId={birdId} speed={speed} />
        <TurbulenceViz birdId={birdId} />
        <GridFloor />

        <OrbitControls
          enableZoom
          enablePan={false}
          minDistance={2}
          maxDistance={10}
          maxPolarAngle={Math.PI / 2.1}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  )
}
