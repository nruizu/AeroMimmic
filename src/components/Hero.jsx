import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

function ShinkansenModel() {
  const groupRef = useRef(null)
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25
    }
  })

  const noseGeo = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 30; i++) {
      const t = i / 30
      const r = 0.02 + t * t * 0.28
      pts.push(new THREE.Vector2(r, t * 2.2))
    }
    return new THREE.LatheGeometry(pts, 24)
  }, [])

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      <mesh geometry={noseGeo} position={[-0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshPhysicalMaterial
          color="#c0c8d0"
          metalness={0.9}
          roughness={0.25}
          envMapIntensity={1.5}
        />
      </mesh>

      <mesh position={[1.5, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 2.4, 24]} />
        <meshPhysicalMaterial
          color="#d0d8e0"
          metalness={0.8}
          roughness={0.3}
          envMapIntensity={1.0}
        />
      </mesh>

      <mesh position={[0.75, 0.12, 0]}>
        <boxGeometry args={[0.4, 0.08, 0.25]} />
        <meshPhysicalMaterial color="#1a1a3e" metalness={0.6} roughness={0.2} />
      </mesh>

      <mesh position={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.18, 0.3, 12]} />
        <meshPhysicalMaterial color="#0077b6" metalness={0.5} roughness={0.4} />
      </mesh>

      {[-0.24, -0.18, -0.12, 0.12, 0.18, 0.24].map((z, i) => (
        <mesh key={i} position={[0.6 + i * 0.35, 0.08, z]}>
          <boxGeometry args={[0.15, 0.02, 0.04]} />
          <meshPhysicalMaterial color="#00b4d8" metalness={0.3} roughness={0.5} />
        </mesh>
      ))}

      <mesh position={[2.8, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.28, 0.15, 24]} />
        <meshPhysicalMaterial color="#c0c8d0" metalness={0.7} roughness={0.4} />
      </mesh>

      <group position={[2.4, -0.2, 0]}>
        {[-0.12, 0, 0.12].map((z, i) => (
          <mesh key={i} position={[0, 0, z]}>
            <cylinderGeometry args={[0.04, 0.04, 0.06, 8]} />
            <meshPhysicalMaterial color="#333" metalness={0.8} roughness={0.5} />
          </mesh>
        ))}
      </group>
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
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <directionalLight position={[-3, 4, -5]} intensity={0.4} color="#0077b6" />
      <pointLight position={[0, 2, 0]} intensity={0.3} color="#00b4d8" />

      <ShinkansenModel />
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
        autoRotate={false}
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
