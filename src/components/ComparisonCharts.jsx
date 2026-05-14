import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
} from 'recharts'
import { BIRDS, FEATURED_BIRD_IDS as BIRD_IDS, BIRD_IDS as ALL_BIRD_IDS } from '../data/mockData'

function Heatmap({ onSelect, selectedBird }) {
  const metrics = useMemo(
    () => [
      { key: 'dragCoefficient', label: 'Cd', lower: true },
      { key: 'efficiency', label: 'Eficiencia', lower: false },
      { key: 'noiseLevel', label: 'Ruido', lower: true },
      { key: 'flowStability', label: 'Estabilidad', lower: false },
    ],
    [],
  )

  const normalized = useMemo(() => {
    const stats = {}
    for (const m of metrics) {
      const vals = ALL_BIRD_IDS.map((id) => BIRDS[id][m.key])
      stats[m.key] = { min: Math.min(...vals), max: Math.max(...vals) }
    }
    return ALL_BIRD_IDS.map((id) => {
      const bird = BIRDS[id]
      const cells = metrics.map((m) => {
        const { min, max } = stats[m.key]
        const span = max - min || 1
        const norm = (bird[m.key] - min) / span
        const score = m.lower ? 1 - norm : norm
        return { key: m.key, label: m.label, raw: bird[m.key], score }
      })
      return { id, name: bird.name, color: bird.color, cells }
    })
  }, [metrics])

  const scoreToColor = (s) => {
    const hue = 0.33 * s
    const light = 35 + s * 25
    return `hsl(${hue * 360},80%,${light}%)`
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-separate border-spacing-1 min-w-[520px]">
        <thead>
          <tr className="text-white/40 font-mono uppercase text-[9px] tracking-wider">
            <th className="text-left py-1 px-2">Ave</th>
            {normalized[0].cells.map((c) => (
              <th key={c.key} className="px-1 text-center">{c.label}</th>
            ))}
            <th className="px-2 text-right">Σ score</th>
          </tr>
        </thead>
        <tbody>
          {normalized
            .map((row) => ({
              ...row,
              total: row.cells.reduce((a, b) => a + b.score, 0),
            }))
            .sort((a, b) => b.total - a.total)
            .map((row, idx) => (
              <tr
                key={row.id}
                onClick={() => onSelect && onSelect(row.id)}
                className={`cursor-pointer transition ${
                  selectedBird === row.id ? 'ring-1 ring-primary/40 rounded' : ''
                }`}
              >
                <td className="py-1 px-2 font-mono text-[10px]">
                  <span className="text-white/30 mr-1">{idx + 1}.</span>
                  <span style={{ color: row.color }}>{row.name}</span>
                </td>
                {row.cells.map((c) => (
                  <td
                    key={c.key}
                    className="text-center"
                    title={`${c.label}: ${c.raw} (score ${c.score.toFixed(2)})`}
                  >
                    <div
                      className="mx-auto h-7 rounded flex items-center justify-center text-[9px] font-mono font-bold"
                      style={{
                        backgroundColor: scoreToColor(c.score),
                        color: c.score > 0.5 ? '#062' : '#fff',
                        minWidth: 44,
                      }}
                    >
                      {c.raw}
                    </div>
                  </td>
                ))}
                <td className="text-right px-2 font-mono text-[10px]" style={{ color: row.color }}>
                  {row.total.toFixed(2)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <p className="text-[9px] text-white/30 mt-3 font-mono leading-snug">
        Heatmap normalizado: verde = mejor relativo · rojo = peor relativo · clic en una fila para simular esa ave.
      </p>
    </div>
  )
}

const COLORS = {
  kingfisher: '#00b4d8',
  eagle: '#f4a261',
  toucan: '#e63946',
}

const BIRD_NAMES = {
  kingfisher: 'Martín Pescador',
  eagle: 'Águila',
  toucan: 'Tucán',
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload) return null
  return (
    <div className="glass-strong px-4 py-3 text-sm">
      <p className="text-white/70 mb-1 font-medium">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-white/50">{p.name}:</span>
          <span className="text-white font-mono font-bold">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

function BarChartView({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="metric"
          tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
          tickLine={false}
          angle={-20}
          textAnchor="end"
        />
        <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar
          dataKey="kingfisher"
          name="Martín Pescador"
          fill={COLORS.kingfisher}
          radius={[4, 4, 0, 0]}
          maxBarSize={24}
        />
        <Bar
          dataKey="eagle"
          name="Águila"
          fill={COLORS.eagle}
          radius={[4, 4, 0, 0]}
          maxBarSize={24}
        />
        <Bar
          dataKey="toucan"
          name="Tucán"
          fill={COLORS.toucan}
          radius={[4, 4, 0, 0]}
          maxBarSize={24}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

function RadarChartView({ data }) {
  const radarData = useMemo(() => {
    const metrics = ['Resistencia', 'Eficiencia', 'Bajo Ruido', 'Estabilidad']
    return metrics.map((m) => {
      const row = { metric: m }
      for (const id of BIRD_IDS) {
        const bird = BIRDS[id]
        if (m === 'Resistencia') row[id] = Math.max(0, 100 - bird.dragCoefficient * 450)
        else if (m === 'Eficiencia') row[id] = bird.efficiency
        else if (m === 'Bajo Ruido') row[id] = Math.max(0, 100 - bird.noiseLevel * 1.2)
        else if (m === 'Estabilidad') row[id] = bird.flowStability
      }
      return row
    })
  }, [data])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={radarData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
        <PolarGrid stroke="rgba(255,255,255,0.08)" />
        <PolarAngleAxis
          dataKey="metric"
          tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9 }}
          tickCount={5}
        />
        {BIRD_IDS.map((id) => (
          <Radar
            key={id}
            name={BIRD_NAMES[id]}
            dataKey={id}
            stroke={COLORS[id]}
            fill={COLORS[id]}
            fillOpacity={0.08}
            strokeWidth={2}
            dot={{ r: 3, fill: COLORS[id] }}
          />
        ))}
        <Legend
          wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}
          iconType="circle"
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}

function LineChartSummary() {
  const generateData = () => {
    const result = []
    for (let s = 100; s <= 350; s += 25) {
      const f = s / 240
      result.push({
        speed: s,
        'Martín Pescador': parseFloat((0.04 * Math.pow(f, 1.8) * 1000).toFixed(1)),
        'Águila': parseFloat((0.12 * Math.pow(f, 1.8) * 1000).toFixed(1)),
        'Tucán': parseFloat((0.22 * Math.pow(f, 1.8) * 1000).toFixed(1)),
      })
    }
    return result
  }

  const lineData = useMemo(() => generateData(), [])

  return (
    <div className="glass-strong p-5">
      <h4 className="text-sm font-medium text-white/70 mb-4">
        Resistencia vs Velocidad
      </h4>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={lineData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="speed"
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
              tickLine={false}
              tickFormatter={(v) => `${v}`}
            />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="Martín Pescador" fill={COLORS.kingfisher} radius={[2, 2, 0, 0]} maxBarSize={6} />
            <Bar dataKey="Águila" fill={COLORS.eagle} radius={[2, 2, 0, 0]} maxBarSize={6} />
            <Bar dataKey="Tucán" fill={COLORS.toucan} radius={[2, 2, 0, 0]} maxBarSize={6} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default function ComparisonCharts({ comparisonData, selectedBird, onSelect }) {
  const [chartMode, setChartMode] = useState('bar')

  return (
    <section id="resultados" className="relative py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Comparación de Resultados</h2>
          <p className="section-subtitle">
            Análisis cuantitativo de las métricas aerodinámicas por especie
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {BIRD_IDS.map((id, i) => {
            const bird = BIRDS[id]
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: bird.color }}
                  />
                  <h3 className="font-bold text-sm">{bird.name}</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Cd</span>
                    <span className="font-mono" style={{ color: bird.color }}>
                      {bird.dragCoefficient}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Eficiencia</span>
                    <span className="font-mono" style={{ color: bird.color }}>
                      {bird.efficiency}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Ruido</span>
                    <span className="font-mono" style={{ color: bird.color }}>
                      {bird.noiseLevel} dB
                    </span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5 mt-2">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${bird.efficiency}%`,
                        backgroundColor: bird.color,
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="flex gap-2 mb-6">
          {[
            { key: 'bar', label: 'Barras (3 aves)' },
            { key: 'radar', label: 'Radar (3 aves)' },
            { key: 'heatmap', label: 'Heatmap (15 aves)' },
          ].map((m) => (
            <button
              key={m.key}
              onClick={() => setChartMode(m.key)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                chartMode === m.key
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <motion.div
          key={chartMode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong p-6"
          style={{ minHeight: 400 }}
        >
          {chartMode === 'bar' && (
            <div style={{ height: 380 }}>
              <BarChartView data={comparisonData} />
            </div>
          )}
          {chartMode === 'radar' && (
            <div style={{ height: 380 }}>
              <RadarChartView data={comparisonData} />
            </div>
          )}
          {chartMode === 'heatmap' && (
            <Heatmap selectedBird={selectedBird} onSelect={onSelect} />
          )}
        </motion.div>

        <div className="mt-6">
          <LineChartSummary />
        </div>
      </div>
    </section>
  )
}
