import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { BIRDS, EXTENDED_BIRD_IDS } from '../data/mockData'

function BeakThumbnail({ bird }) {
  const path = useMemo(() => {
    const profile = bird.beakProfile
    const maxX = profile[profile.length - 1][0]
    const maxY = Math.max(...profile.map(([, y]) => y))
    const W = 80
    const H = 36
    const padX = 4
    const padY = 2
    const scaleX = (W - padX * 2) / maxX
    const scaleY = (H / 2 - padY) / Math.max(maxY, 0.001)
    const top = profile.map(([x, y]) => [padX + x * scaleX, H / 2 - y * scaleY])
    const bottom = [...profile]
      .reverse()
      .map(([x, y]) => [padX + x * scaleX, H / 2 + y * scaleY])
    const pts = [...top, ...bottom]
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ') + ' Z'
  }, [bird])

  return (
    <svg viewBox="0 0 80 36" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={`grad-${bird.id}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={bird.color} stopOpacity="0.85" />
          <stop offset="100%" stopColor={bird.colorSecondary} stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <path d={path} fill={`url(#grad-${bird.id})`} stroke={bird.color} strokeWidth="0.6" />
    </svg>
  )
}

function performanceTag(cd) {
  if (cd < 0.06) return { label: 'Élite', color: '#06d6a0' }
  if (cd < 0.1) return { label: 'Alta', color: '#48cae4' }
  if (cd < 0.16) return { label: 'Media', color: '#ffb703' }
  return { label: 'Baja', color: '#ef476f' }
}

export default function BirdLibrary({ selectedBird, onSelect }) {
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('drag')

  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = EXTENDED_BIRD_IDS.filter((id) => {
      if (!q) return true
      const b = BIRDS[id]
      return (
        b.name.toLowerCase().includes(q) ||
        b.nameEn.toLowerCase().includes(q) ||
        b.beakType.toLowerCase().includes(q)
      )
    })
    return filtered.sort((a, b) => {
      if (sortBy === 'drag') return BIRDS[a].dragCoefficient - BIRDS[b].dragCoefficient
      if (sortBy === 'efficiency') return BIRDS[b].efficiency - BIRDS[a].efficiency
      return BIRDS[a].name.localeCompare(BIRDS[b].name)
    })
  }, [query, sortBy])

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.45 }}
      className="glass-strong p-4 flex flex-col h-full min-h-[480px]"
    >
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <h3 className="text-sm font-bold tracking-wide">Biblioteca de Picos</h3>
        </div>
        <p className="text-[10px] text-white/40 leading-snug">
          Explora picos de aves famosas y simúlalos en tiempo real.
        </p>
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar (ej. flamenco, hummingbird)"
        className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-lg
                   placeholder-white/30 focus:outline-none focus:border-primary/40
                   focus:bg-white/10 transition-all mb-2 font-mono"
      />

      <div className="flex gap-1 mb-3">
        {[
          { key: 'drag', label: 'Cd ↑' },
          { key: 'efficiency', label: 'Efic. ↓' },
          { key: 'name', label: 'A-Z' },
        ].map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSortBy(opt.key)}
            className={`flex-1 px-2 py-1 rounded text-[10px] font-mono transition-all ${
              sortBy === opt.key
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 max-h-[480px]">
        {items.length === 0 ? (
          <div className="text-center text-xs text-white/30 py-8">Sin resultados</div>
        ) : (
          items.map((id) => {
            const bird = BIRDS[id]
            const isSelected = selectedBird === id
            const tag = performanceTag(bird.dragCoefficient)
            return (
              <button
                key={id}
                onClick={() => onSelect(id)}
                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-300
                  border text-left group ${
                    isSelected
                      ? 'border-primary/50 bg-primary/10 shadow-[0_0_20px_rgba(0,180,216,0.15)]'
                      : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/15'
                  }`}
              >
                <div
                  className="w-14 h-7 flex-shrink-0 rounded bg-black/30 border border-white/5 overflow-hidden"
                  style={{
                    boxShadow: isSelected ? `0 0 12px ${bird.color}40` : 'none',
                  }}
                >
                  <BeakThumbnail bird={bird} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold truncate">{bird.name}</span>
                    <span
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0"
                      style={{
                        backgroundColor: `${tag.color}20`,
                        color: tag.color,
                        border: `1px solid ${tag.color}30`,
                      }}
                    >
                      {tag.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] text-white/40 font-mono">
                      Cd {bird.dragCoefficient}
                    </span>
                    <span className="text-[9px] text-white/30">·</span>
                    <span className="text-[9px] text-white/40 font-mono">
                      η {bird.efficiency}%
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <span className="text-primary text-xs shrink-0">✓</span>
                )}
              </button>
            )
          })
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-white/5">
        <p className="text-[9px] text-white/30 leading-snug font-mono">
          {items.length} de {EXTENDED_BIRD_IDS.length} aves · selecciona para simular
        </p>
      </div>
    </motion.div>
  )
}
