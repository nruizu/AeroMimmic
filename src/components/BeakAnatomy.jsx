import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { BIRDS } from '../data/mockData'

export default function BeakAnatomy({ birdId }) {
  const bird = BIRDS[birdId]

  const view = useMemo(() => {
    const profile = bird.beakProfile
    const totalLen = profile[profile.length - 1][0]
    const maxRad = Math.max(...profile.map(([, r]) => r))
    const W = 720
    const H = 220
    const padX = 70
    const padTop = 30
    const padBottom = 40
    const usableW = W - padX * 2
    const usableH = H - padTop - padBottom
    const sx = usableW / totalLen
    const sy = (usableH / 2) / Math.max(maxRad, 0.001)
    const cy = padTop + usableH / 2

    const top = profile.map(([x, y]) => [padX + x * sx, cy - y * sy])
    const bot = [...profile].reverse().map(([x, y]) => [padX + x * sx, cy + y * sy])
    const pts = [...top, ...bot]
    const path =
      pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ') + ' Z'

    const maxRadIdx = profile.reduce(
      (acc, [, y], i) => (y > acc.y ? { y, i } : acc),
      { y: -1, i: 0 },
    ).i
    const maxX = profile[maxRadIdx][0]

    const fineness = (totalLen / (maxRad * 2)).toFixed(2)

    const tipPx = [padX, cy]
    const basePx = [padX + totalLen * sx, cy]
    const maxRadTopPx = [padX + maxX * sx, cy - maxRad * sy]
    const maxRadBotPx = [padX + maxX * sx, cy + maxRad * sy]

    return {
      W, H, padX, padTop, cy, sx, sy,
      path, totalLen, maxRad, maxX, fineness,
      tipPx, basePx, maxRadTopPx, maxRadBotPx,
    }
  }, [bird])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-strong p-5"
    >
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-bold">Anatomía del pico</h3>
          <p className="text-[10px] text-white/40 font-mono uppercase tracking-wider">
            Perfil 2D · cotas en unidades relativas
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Stat label="Longitud" value={view.totalLen.toFixed(2)} unit="L" color={bird.color} />
          <Stat label="Anchura máx." value={(view.maxRad * 2).toFixed(2)} unit="L" color={bird.color} />
          <Stat label="Finura L/D" value={view.fineness} unit="" color="#06d6a0" highlight />
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${view.W} ${view.H}`} className="w-full min-w-[600px]" style={{ height: 220 }}>
          <defs>
            <linearGradient id={`beak-fill-${bird.id}`} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor={bird.color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={bird.colorSecondary} stopOpacity="0.05" />
            </linearGradient>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
            </pattern>
          </defs>

          <rect width={view.W} height={view.H} fill="url(#grid)" />

          <line
            x1={view.padX - 30}
            y1={view.cy}
            x2={view.W - view.padX + 30}
            y2={view.cy}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="0.6"
            strokeDasharray="4 4"
          />

          <text x={view.W - view.padX + 36} y={view.cy + 4} fontSize="9" fill="rgba(255,255,255,0.4)" fontFamily="monospace">
            eje
          </text>

          <path
            d={view.path}
            fill={`url(#beak-fill-${bird.id})`}
            stroke={bird.color}
            strokeWidth="1.5"
          />

          <g>
            <line
              x1={view.tipPx[0]}
              y1={view.padTop + 5}
              x2={view.basePx[0]}
              y2={view.padTop + 5}
              stroke="#48cae4"
              strokeWidth="0.8"
              markerStart="url(#arrL)"
              markerEnd="url(#arrR)"
            />
            <text
              x={(view.tipPx[0] + view.basePx[0]) / 2}
              y={view.padTop - 3}
              fontSize="10"
              fill="#48cae4"
              textAnchor="middle"
              fontFamily="monospace"
            >
              L = {view.totalLen.toFixed(2)}
            </text>
            <line x1={view.tipPx[0]} y1={view.padTop} x2={view.tipPx[0]} y2={view.cy} stroke="#48cae4" strokeOpacity="0.3" strokeWidth="0.6" strokeDasharray="2 3" />
            <line x1={view.basePx[0]} y1={view.padTop} x2={view.basePx[0]} y2={view.cy} stroke="#48cae4" strokeOpacity="0.3" strokeWidth="0.6" strokeDasharray="2 3" />
          </g>

          <g>
            <line
              x1={view.maxRadTopPx[0] + 25}
              y1={view.maxRadTopPx[1]}
              x2={view.maxRadBotPx[0] + 25}
              y2={view.maxRadBotPx[1]}
              stroke="#ffb703"
              strokeWidth="0.8"
            />
            <line x1={view.maxRadTopPx[0]} y1={view.maxRadTopPx[1]} x2={view.maxRadTopPx[0] + 30} y2={view.maxRadTopPx[1]} stroke="#ffb703" strokeOpacity="0.5" strokeWidth="0.6" strokeDasharray="2 3" />
            <line x1={view.maxRadBotPx[0]} y1={view.maxRadBotPx[1]} x2={view.maxRadBotPx[0] + 30} y2={view.maxRadBotPx[1]} stroke="#ffb703" strokeOpacity="0.5" strokeWidth="0.6" strokeDasharray="2 3" />
            <text
              x={view.maxRadTopPx[0] + 35}
              y={view.cy + 3}
              fontSize="10"
              fill="#ffb703"
              fontFamily="monospace"
            >
              D = {(view.maxRad * 2).toFixed(2)}
            </text>
          </g>

          <g>
            <circle cx={view.tipPx[0]} cy={view.tipPx[1]} r="3" fill="#ef476f" />
            <text x={view.tipPx[0] - 6} y={view.tipPx[1] + 18} fontSize="9" fill="#ef476f" textAnchor="end" fontFamily="monospace">
              Punta
            </text>

            <circle cx={view.basePx[0]} cy={view.basePx[1]} r="3" fill="#06d6a0" />
            <text x={view.basePx[0] + 6} y={view.basePx[1] + 18} fontSize="9" fill="#06d6a0" fontFamily="monospace">
              Base
            </text>
          </g>

          <defs>
            <marker id="arrL" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M6,0 L0,3 L6,6" fill="#48cae4" />
            </marker>
            <marker id="arrR" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="#48cae4" />
            </marker>
          </defs>
        </svg>
      </div>

      <p className="text-[10px] text-white/40 mt-2 leading-snug">
        <strong className="text-white/60">Finura L/D</strong> = longitud / diámetro máximo.
        Valores altos (≥10) indican perfil esbelto y aerodinámico; valores bajos (&lt;4) son volumétricos y producen mayor resistencia.
      </p>
    </motion.div>
  )
}

function Stat({ label, value, unit, color, highlight }) {
  return (
    <div
      className={`px-2 py-1 rounded-md border ${
        highlight ? 'border-emerald-400/30' : 'border-white/10'
      }`}
      style={{ backgroundColor: highlight ? '#06d6a015' : 'rgba(255,255,255,0.03)' }}
    >
      <div className="text-[8px] text-white/40 font-mono uppercase tracking-wider">
        {label}
      </div>
      <div className="text-xs font-bold font-mono" style={{ color }}>
        {value}
        <span className="text-[8px] text-white/40 ml-0.5">{unit}</span>
      </div>
    </div>
  )
}
