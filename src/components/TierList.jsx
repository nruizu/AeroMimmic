import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { BIRDS, BIRD_IDS } from '../data/mockData'

const METRIC_OPTIONS = [
  { key: 'dragCoefficient', label: 'Resistencia (Cd)', lower: true, unit: '' },
  { key: 'efficiency', label: 'Eficiencia', lower: false, unit: '%' },
  { key: 'noiseLevel', label: 'Ruido', lower: true, unit: 'dB' },
  { key: 'flowStability', label: 'Estabilidad', lower: false, unit: '%' },
]

const MEDALS = ['🥇', '🥈', '🥉']

export default function TierList({ selectedBird, onSelect }) {
  const [metricKey, setMetricKey] = useState('dragCoefficient')

  const metric = METRIC_OPTIONS.find((m) => m.key === metricKey)

  const sorted = useMemo(() => {
    const list = BIRD_IDS.map((id) => ({ id, ...BIRDS[id] }))
    list.sort((a, b) =>
      metric.lower ? a[metricKey] - b[metricKey] : b[metricKey] - a[metricKey],
    )
    return list
  }, [metricKey, metric])

  const min = Math.min(...sorted.map((b) => b[metricKey]))
  const max = Math.max(...sorted.map((b) => b[metricKey]))
  const range = max - min || 1

  return (
    <section id="ranking" className="relative py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-10"
        >
          <h2 className="section-title">Ranking global</h2>
          <p className="section-subtitle">
            Las 15 aves ordenadas según la métrica seleccionada · clic para simular
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {METRIC_OPTIONS.map((m) => (
            <button
              key={m.key}
              onClick={() => setMetricKey(m.key)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                metricKey === m.key
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10'
              }`}
            >
              {m.label}
              <span className="text-[9px] ml-1 text-white/30 font-mono">
                {m.lower ? '↑ menor' : '↓ mayor'}
              </span>
            </button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="glass-strong p-4 md:p-6"
        >
          <div className="space-y-1.5">
            {sorted.map((bird, idx) => {
              const value = bird[metricKey]
              const norm = (value - min) / range
              const widthPct = metric.lower ? 100 - norm * 90 : 10 + norm * 90
              const isSelected = selectedBird === bird.id
              const isTop3 = idx < 3

              return (
                <motion.button
                  key={bird.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => onSelect(bird.id)}
                  className={`relative w-full flex items-center gap-3 p-2.5 rounded-lg
                    transition-all duration-300 text-left border group ${
                      isSelected
                        ? 'border-primary/50 bg-primary/10'
                        : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/15'
                    }`}
                >
                  <div className="flex items-center justify-center w-8 h-8 shrink-0">
                    {isTop3 ? (
                      <span className="text-xl">{MEDALS[idx]}</span>
                    ) : (
                      <span className="text-[11px] font-mono text-white/40">
                        #{idx + 1}
                      </span>
                    )}
                  </div>

                  <div className="w-32 md:w-40 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: bird.color }}
                      />
                      <span className="text-xs font-semibold truncate">
                        {bird.name}
                      </span>
                    </div>
                    <span className="text-[9px] text-white/30 font-mono">
                      {bird.nameEn}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 relative h-5">
                    <div className="absolute inset-y-0 left-0 right-0 bg-white/[0.03] rounded" />
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${widthPct}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.04 + 0.2, duration: 0.6 }}
                      className="absolute inset-y-0 left-0 rounded"
                      style={{
                        background: `linear-gradient(to right, ${bird.color}90, ${bird.colorSecondary}40)`,
                        boxShadow: isSelected ? `0 0 16px ${bird.color}80` : 'none',
                      }}
                    />
                  </div>

                  <div className="w-20 text-right shrink-0">
                    <span
                      className="font-mono font-bold text-xs"
                      style={{ color: bird.color }}
                    >
                      {value}
                      {metric.unit}
                    </span>
                  </div>

                  {isSelected && (
                    <span className="text-primary text-xs shrink-0 ml-1">●</span>
                  )}
                </motion.button>
              )
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between flex-wrap gap-2">
            <p className="text-[10px] text-white/40 font-mono">
              Mejor: <span className="text-emerald-400">{sorted[0].name}</span> ·
              Peor: <span className="text-rose-400">{sorted[sorted.length - 1].name}</span>
            </p>
            <p className="text-[10px] text-white/30 font-mono">
              {sorted.length} aves · métrica {metric.label}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
