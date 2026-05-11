import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls, Text } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { TRAIN_COMPARISON_DATA } from '../data/mockData'

function KingfisherBeak() {
  const geometry = useMemo(() => {
    const profile = [
      [0, 0], [0.3, 0.02], [0.6, 0.04], [0.9, 0.07],
      [1.2, 0.11], [1.5, 0.15], [1.8, 0.19], [2.1, 0.22],
      [2.4, 0.24], [2.7, 0.25], [3.0, 0.26],
    ]
    const pts = profile.map(([x, y]) => new THREE.Vector2(y * 0.5, x * 0.4))
    const geo = new THREE.LatheGeometry(pts, 24)
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <mesh geometry={geometry} rotation={[0, 0, Math.PI / 2]} position={[-0.3, 0, 0]}>
      <meshPhysicalMaterial
        color="#00b4d8"
        metalness={0.3}
        roughness={0.5}
        transparent
        opacity={0.7}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function ShinkansenNose() {
  const geometry = useMemo(() => {
    const profile = [
      [0, 0], [0.05, 0.02], [0.1, 0.04], [0.2, 0.08],
      [0.35, 0.14], [0.5, 0.2], [0.7, 0.25], [0.9, 0.28],
      [1.1, 0.3], [1.0, 0.29],
    ]
    const pts = profile.map(([x, y]) => new THREE.Vector2(y * 0.7, x * 1.2))
    const geo = new THREE.LatheGeometry(pts, 24)
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <mesh geometry={geometry} rotation={[0, 0, Math.PI / 2]} position={[0.5, 0, 0]}>
      <meshPhysicalMaterial
        color="#c0c8d0"
        metalness={0.8}
        roughness={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function ComparisonScene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[2.5, 1.8, 3.5]} fov={35} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 4]} intensity={0.8} />
      <directionalLight position={[-2, 1, -3]} intensity={0.3} color="#0077b6" />

      <group position={[-0.6, 0, -0.5]}>
        <KingfisherBeak />
        <Text position={[0.5, 0.5, 0]} fontSize={0.08} color="#00b4d8" anchorX="center" anchorY="middle">
          Pico del Martín Pescador
        </Text>
      </group>

      <group position={[0.6, 0, 0.5]}>
        <ShinkansenNose />
        <Text position={[0.5, 0.5, 0]} fontSize={0.08} color="#c0c8d0" anchorX="center" anchorY="middle">
          Nariz del Shinkansen
        </Text>
      </group>

      <gridHelper args={[6, 16, '#1a1a3e', '#0f0f2a']} position={[0, -0.7, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.72, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshBasicMaterial color="#060614" />
      </mesh>

      <OrbitControls enableZoom enablePan={false} minDistance={2} maxDistance={8} />
    </>
  )
}

export default function TrainComparison() {
  return (
    <section id="comparacion" className="relative py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Pico vs Tren</h2>
          <p className="section-subtitle">
            La sorprendente similitud entre la naturaleza y la ingeniería
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-strong overflow-hidden" style={{ height: 420 }}>
            <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
              <ComparisonScene />
            </Canvas>
          </div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-5"
            >
              <h3 className="text-sm font-bold text-white/80 mb-4">
                Comparación frontal
              </h3>
              <div className="space-y-4">
                {Object.entries(TRAIN_COMPARISON_DATA).map(([key, data]) => (
                  <div key={key} className="glass p-4">
                    <h4 className="text-sm font-medium mb-3" style={{
                      color: key === 'shinkansen' ? '#00b4d8' : '#e63946'
                    }}>
                      {data.name}
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-white/40">Cd</span>
                        <p className="font-mono font-bold">{data.dragCoefficient}</p>
                      </div>
                      <div>
                        <span className="text-white/40">Ruido</span>
                        <p className="font-mono font-bold">{data.noiseLevel} dB</p>
                      </div>
                      <div>
                        <span className="text-white/40">Eficiencia</span>
                        <p className="font-mono font-bold">{data.efficiency}%</p>
                      </div>
                      <div>
                        <span className="text-white/40">Onda presión</span>
                        <p className="font-mono font-bold">{data.pressureWave}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>


          </div>
        </div>
      </div>
    </section>
  )
}
