import { motion } from 'framer-motion'
import SimulationCanvas from './SimulationCanvas'
import SpeedSlider from './SpeedSlider'
import MetricCard from './MetricCard'
import BeakAnatomy from './BeakAnatomy'
import { BIRDS } from '../data/mockData'
import { getMetricsForBird } from '../utils/calculations'

export default function Simulation({
  selectedBird,
  speed,
  onSpeedChange,
  speedRange,
  metrics,
}) {
  const bird = BIRDS[selectedBird]
  const baseline = getMetricsForBird('kingfisher', speed)

  const cards = [
    {
      key: 'drag',
      label: 'Resistencia',
      value: parseFloat((metrics.drag * 1000).toFixed(1)),
      unit: 'mCd',
      color: bird.color,
      termKey: 'Cd',
      gaugeMax: 250,
      invertedGauge: true,
      baseline: baseline.drag * 1000,
      higherIsBetter: false,
    },
    {
      key: 'eff',
      label: 'Eficiencia',
      value: parseFloat(metrics.efficiency.toFixed(1)),
      unit: '%',
      color: '#06d6a0',
      termKey: 'eficiencia',
      gaugeMax: 100,
      baseline: baseline.efficiency,
      higherIsBetter: true,
    },
    {
      key: 'noise',
      label: 'Ruido',
      value: parseFloat(metrics.noise.toFixed(1)),
      unit: 'dB',
      color: '#ef476f',
      gaugeMax: 100,
      invertedGauge: true,
      baseline: baseline.noise,
      higherIsBetter: false,
    },
    {
      key: 'stab',
      label: 'Estabilidad',
      value: parseFloat(metrics.stability.toFixed(1)),
      unit: '%',
      color: '#48cae4',
      termKey: 'estabilidad',
      gaugeMax: 100,
      baseline: baseline.stability,
      higherIsBetter: true,
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
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              key={selectedBird + speed}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="glass-strong overflow-hidden"
              style={{ height: '520px' }}
            >
              <SimulationCanvas birdId={selectedBird} speed={speed} />
            </motion.div>

            <BeakAnatomy birdId={selectedBird} />
          </div>

          <div className="space-y-4">
            <motion.div
              key={selectedBird}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-strong p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: bird.color }}
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-sm truncate">{bird.name}</h3>
                  <p className="text-[10px] text-white/40 font-mono uppercase tracking-wider truncate">
                    {bird.flowQuality}
                  </p>
                </div>
              </div>

              <p className="text-xs text-white/50 leading-relaxed mb-4">
                {bird.longDescription}
              </p>

              <div className="grid grid-cols-2 gap-2">
                {cards.map((c) => (
                  <MetricCard
                    key={c.key}
                    label={c.label}
                    value={c.value}
                    unit={c.unit}
                    color={c.color}
                    termKey={c.termKey}
                    gaugeMax={c.gaugeMax}
                    invertedGauge={c.invertedGauge}
                    baseline={c.baseline}
                    higherIsBetter={c.higherIsBetter}
                  />
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
