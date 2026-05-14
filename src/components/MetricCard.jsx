import { useRef, useEffect, useState } from 'react'
import Term from './Term'

function Sparkline({ values, color }) {
  if (!values || values.length < 2) {
    return (
      <svg viewBox="0 0 60 18" className="w-full h-full" preserveAspectRatio="none">
        <line x1="0" y1="9" x2="60" y2="9" stroke={color} strokeOpacity="0.3" strokeWidth="1" />
      </svg>
    )
  }
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const w = 60
  const h = 18
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w
    const y = h - ((v - min) / span) * (h - 2) - 1
    return `${x.toFixed(2)},${y.toFixed(2)}`
  })
  const path = 'M' + pts.join(' L')
  const area = `${path} L${w},${h} L0,${h} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`spark-${color}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spark-${color})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.3" />
      <circle
        cx={w}
        cy={h - ((values[values.length - 1] - min) / span) * (h - 2) - 1}
        r="1.6"
        fill={color}
      />
    </svg>
  )
}

function Gauge({ value, max, color, inverted }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  const visualPct = inverted ? 100 - pct : pct
  const r = 22
  const c = 2 * Math.PI * r
  const dash = (visualPct / 100) * c

  return (
    <svg viewBox="0 0 60 60" className="w-full h-full">
      <circle cx="30" cy="30" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
      <circle
        cx="30"
        cy="30"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c}`}
        transform="rotate(-90 30 30)"
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
    </svg>
  )
}

function deltaFormatted(value, baseline) {
  if (!baseline || baseline === 0) return null
  const pct = ((value - baseline) / baseline) * 100
  if (Math.abs(pct) < 0.5) return { label: '≈ baseline', sign: 0 }
  const sign = pct > 0 ? 1 : -1
  return {
    label: `${pct > 0 ? '+' : ''}${pct.toFixed(0)}% vs Kingfisher`,
    sign,
  }
}

const MAX_HISTORY = 12

export default function MetricCard({
  label,
  value,
  unit,
  color,
  termKey,
  gaugeMax,
  invertedGauge,
  baseline,
  higherIsBetter,
}) {
  const [history, setHistory] = useState([])
  const lastVal = useRef(value)

  useEffect(() => {
    if (Math.abs(value - lastVal.current) > 0.001 || history.length === 0) {
      setHistory((h) => {
        const next = [...h, value]
        return next.slice(-MAX_HISTORY)
      })
      lastVal.current = value
    }
  }, [value])

  const delta = deltaFormatted(value, baseline)
  const deltaGood =
    delta &&
    delta.sign !== 0 &&
    ((higherIsBetter && delta.sign > 0) || (!higherIsBetter && delta.sign < 0))
  const deltaColor =
    delta && delta.sign === 0
      ? '#9ca3af'
      : deltaGood
      ? '#06d6a0'
      : '#ef476f'

  return (
    <div className="glass-card p-3 group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="text-[10px] text-white/50 leading-tight">
            {termKey ? <Term k={termKey}>{label}</Term> : label}
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-bold font-mono" style={{ color }}>
              {value}
            </span>
            <span className="text-[9px] text-white/40 font-mono">{unit}</span>
          </div>
        </div>
        {gaugeMax && (
          <div className="w-10 h-10 flex-shrink-0">
            <Gauge value={value} max={gaugeMax} color={color} inverted={invertedGauge} />
          </div>
        )}
      </div>

      <div className="h-4 mb-1.5">
        <Sparkline values={history} color={color} />
      </div>

      {delta && (
        <div
          className="text-[9px] font-mono px-1.5 py-0.5 rounded inline-block"
          style={{
            backgroundColor: `${deltaColor}15`,
            color: deltaColor,
            border: `1px solid ${deltaColor}30`,
          }}
        >
          {delta.label}
        </div>
      )}
    </div>
  )
}
