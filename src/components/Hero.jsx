import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

const SEGMENTS = 48
const RING_COUNT = 16

const KINGFISHER_PROFILE = [
  [0, 0], [0.15, 0.003], [0.3, 0.008], [0.5, 0.015], [0.7, 0.025],
  [0.9, 0.037], [1.1, 0.05], [1.3, 0.065], [1.5, 0.082], [1.7, 0.1],
  [1.9, 0.118], [2.1, 0.136], [2.3, 0.155], [2.5, 0.174], [2.7, 0.194],
  [2.9, 0.214],
]

const SHINKANSEN_PROFILE = [
  [0, 0], [0.18, 0.028], [0.36, 0.062], [0.55, 0.1], [0.75, 0.14],
  [0.95, 0.18], [1.15, 0.215], [1.35, 0.245], [1.55, 0.27], [1.75, 0.288],
  [1.95, 0.3], [2.15, 0.305], [2.35, 0.308], [2.55, 0.31], [2.75, 0.31],
  [2.9, 0.31],
]

function profileToPoints(profile, lengthScale, radiusScale) {
  return profile.map(([x, y]) => new THREE.Vector2(y * radiusScale, x * lengthScale))
}

function MorphingNose() {
  const meshRef = useRef(null)
  const labelRef = useRef(null)

  const { geometry, posA, posB, posLive } = useMemo(() => {
    const LENGTH = 0.9
    const RADIUS = 1.6
    const ptsA = profileToPoints(KINGFISHER_PROFILE, LENGTH, RADIUS)
    const ptsB = profileToPoints(SHINKANSEN_PROFILE, LENGTH, RADIUS)
    const gA = new THREE.LatheGeometry(ptsA, SEGMENTS)
    const gB = new THREE.LatheGeometry(ptsB, SEGMENTS)

    const a = new Float32Array(gA.attributes.position.array)
    const b = new Float32Array(gB.attributes.position.array)

    const liveGeo = new THREE.LatheGeometry(ptsA, SEGMENTS)
    const live = liveGeo.attributes.position.array
    liveGeo.computeVertexNormals()

    gA.dispose()
    gB.dispose()

    return { geometry: liveGeo, posA: a, posB: b, posLive: live }
  }, [])

  const colorRef = useRef(new THREE.Color('#00b4d8'))

  useFrame((state) => {
    const t = (Math.sin(state.clock.elapsedTime * 0.45) + 1) / 2
    const eased = t * t * (3 - 2 * t)

    for (let i = 0; i < posLive.length; i++) {
      posLive[i] = posA[i] * (1 - eased) + posB[i] * eased
    }
    geometry.attributes.position.needsUpdate = true

    const cA = new THREE.Color('#00b4d8')
    const cB = new THREE.Color('#c0c8d0')
    colorRef.current.copy(cA).lerp(cB, eased)
    if (meshRef.current) {
      meshRef.current.material.color.copy(colorRef.current)
      meshRef.current.material.metalness = 0.25 + eased * 0.6
      meshRef.current.material.roughness = 0.45 - eased * 0.2
      meshRef.current.rotation.y += 0.003
    }
  })

  return (
    <group position={[0, -0.1, 0]}>
      <mesh
        ref={meshRef}
        geometry={geometry}
        rotation={[0, 0, Math.PI / 2]}
        position={[0.4, 0, 0]}
      >
        <meshPhysicalMaterial
          color="#00b4d8"
          metalness={0.25}
          roughness={0.4}
          envMapIntensity={1.4}
        />
      </mesh>

      <mesh ref={labelRef} position={[-1.2, 0, 0]}>
        <planeGeometry args={[0.001, 0.001]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  )
}

function HeroParticles() {
  const count = 400
  const meshRef = useRef(null)
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5
    }
    return pos
  }, [])
  const velocities = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 0.005,
      y: (Math.random() - 0.5) * 0.005,
    }))
  }, [])

  useFrame(() => {
    if (!meshRef.current) return
    const pos = meshRef.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      pos[i * 3] += velocities[i].x
      pos[i * 3 + 1] += velocities[i].y
      if (Math.abs(pos[i * 3]) > 10) velocities[i].x *= -1
      if (Math.abs(pos[i * 3 + 1]) > 5) velocities[i].y *= -1
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} itemSize={3} array={positions} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#00b4d8" transparent opacity={0.4} sizeAttenuation />
    </points>
  )
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[4, 2, 6]} fov={45} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <directionalLight position={[-3, 4, -5]} intensity={0.4} color="#0077b6" />
      <pointLight position={[0, 2, 0]} intensity={0.4} color="#00b4d8" />

      <MorphingNose />
      <HeroParticles />

      <gridHelper args={[12, 20, '#1a1a3e', '#0a0a1a']} position={[0, -0.6, 0]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.62, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial color="#0a0a1a" />
      </mesh>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 3}
        minPolarAngle={Math.PI / 4}
      />
    </>
  )
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
          <Scene />
        </Canvas>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-dark/0 via-dark/30 to-dark" />

      <div className="absolute top-1/2 left-8 -translate-y-1/2 hidden lg:flex flex-col gap-3 z-10">
        <div className="px-3 py-2 rounded-lg glass border border-cyan-500/30">
          <p className="text-[9px] font-mono text-cyan-300/80 uppercase tracking-wider">
            Naturaleza
          </p>
          <p className="text-xs font-bold text-white">Pico Martín Pescador</p>
        </div>
        <div className="text-cyan-400/40 text-2xl text-center">↓</div>
        <div className="px-3 py-2 rounded-lg glass border border-slate-300/20">
          <p className="text-[9px] font-mono text-slate-300/80 uppercase tracking-wider">
            Ingeniería
          </p>
          <p className="text-xs font-bold text-white">Nariz Shinkansen 500</p>
        </div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass text-xs text-primary font-mono mb-6 tracking-wider uppercase">
            Biomímesis &bull; Aerodinámica &bull; Ingeniería
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6"
        >
          <span className="text-gradient">Biomímesis</span>
          <br />
          <span className="text-white">en el Shinkansen</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Cómo el pico del martín pescador inspiró uno de los trenes más
          rápidos y silenciosos del mundo, reduciendo resistencia, ruido y
          consumo energético.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <a
            href="#selector"
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-medium hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
          >
            Explorar simulación
          </a>
          <a
            href="#ciencia"
            className="px-8 py-3 rounded-lg glass text-white/70 hover:text-white hover:bg-white/10 transition-all"
          >
            Ver ciencia
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5"
        >
          <div className="w-1.5 h-3 rounded-full bg-primary/60" />
        </motion.div>
      </motion.div>
    </section>
  )
}
