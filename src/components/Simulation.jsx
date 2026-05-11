import { motion } from 'framer-motion'
import SimulationCanvas from './SimulationCanvas'
import SpeedSlider from './SpeedSlider'
import { BIRDS } from '../data/mockData'

export default function Simulation({
  selectedBird,
  speed,
  onSpeedChange,
  speedRange,
  metrics,
}) {
  const bird = BIRDS[selectedBird]

  const statCards = [
    {
      label: 'Resistencia (mCd)',
      value: (metrics.drag * 1000).toFixed(1),
      color: bird.color,
      unit: '',
      good: metrics.drag < 0.08,
      medium: metrics.drag >= 0.08 && metrics.drag < 0.18,
    },
    {
      label: 'Eficiencia energética',
      value: metrics.efficiency.toFixed(1),
      color: '#00e676',
      unit: '%',
      good: metrics.efficiency > 80,
      medium: metrics.efficiency > 50 && metrics.efficiency <= 80,
    },
    {
      label: 'Ruido estimado',
      value: metrics.noise.toFixed(1),
      color: '#ff6b6b',
      unit: 'dB',
      good: metrics.noise < 25,
      medium: metrics.noise >= 25 && metrics.noise < 55,
    },
    {
      label: 'Estabilidad flujo',
      value: metrics.stability.toFixed(1),
      color: '#48cae4',
      unit: '%',
      good: metrics.stability > 80,
      medium: metrics.stability > 50 && metrics.stability <= 80,
    },
  ]

  return (
    <section id="simulacion" className="relative py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Simulación Aerodinámica</h2>
          <p className="section-subtitle">
            Flujo de aire alrededor del pico del {bird.name} a {speed} km/h
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <motion.div
              key={selectedBird + speed}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="glass-strong overflow-hidden"
              style={{ height: '500px' }}
            >
              <SimulationCanvas birdId={selectedBird} speed={speed} />
            </motion.div>
          </div>

          <div className="space-y-4">
            <motion.div
              key={selectedBird}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-strong p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: bird.color }}
                />
                <div>
                  <h3 className="font-bold text-sm">{bird.name}</h3>
                  <p className="text-[10px] text-white/40 font-mono uppercase tracking-wider">
                    {bird.flowQuality}
                  </p>
                </div>
              </div>

              <p className="text-xs text-white/50 leading-relaxed mb-4">
                {bird.longDescription}
              </p>

              <div className="space-y-3">
                {statCards.map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <span className="text-xs text-white/50">{stat.label}</span>
                    <span
                      className="text-sm font-bold font-mono"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                      {stat.unit}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-strong p-5"
            >
              <SpeedSlider
                speed={speed}
                onChange={onSpeedChange}
                min={speedRange.min}
                max={speedRange.max}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
