import { useMemo } from 'react'
import { BIRDS } from '../data/mockData'
import { calculateDrag } from '../utils/calculations'
import Term from './Term'

const SOUND_SPEED_MS = 340
const AIR_DENSITY = 1.225
const AIR_VISCOSITY = 1.81e-5

function classifyRegime(re) {
  if (re < 2300) return { label: 'Laminar', color: '#06d6a0', termKey: 'laminar' }
  if (re < 4000) return { label: 'Transicional', color: '#ffd166', termKey: 'turbulento' }
  return { label: 'Turbulento', color: '#ef476f', termKey: 'turbulento' }
}

function PressureLegend() {
  return (
    <div className="flex items-center gap-2 mt-2">
      <span className="text-[9px] text-white/40 font-mono uppercase tracking-wider">P</span>
      <div
        className="flex-1 h-2 rounded-full"
        style={{
          background:
            'linear-gradient(to right, hsl(238,95%,55%), hsl(180,95%,55%), hsl(90,95%,55%), hsl(40,95%,55%), hsl(0,95%,55%))',
        }}
      />
      <span className="text-[9px] text-white/40 font-mono">baja → alta</span>
    </div>
  )
}

export default function SimulationHUD({ birdId, speed, viz, onToggle }) {
  const bird = BIRDS[birdId]

  const physics = useMemo(() => {
    const vMs = speed / 3.6
    const L = bird.length * 0.05
    const re = (AIR_DENSITY * vMs * L) / AIR_VISCOSITY
    const mach = vMs / SOUND_SPEED_MS
    const cd = calculateDrag(birdId, speed)
    const regime = classifyRegime(re)
    return { vMs, re, mach, cd, regime }
  }, [birdId, speed, bird])

  return (
    <>
      <div className="absolute top-3 left-3 z-10 select-none pointer-events-none">
        <div className="bg-black/55 backdrop-blur-md border border-white/10 rounded-lg p-3 font-mono text-[10px] space-y-1 min-w-[170px]">
          <div className="flex items-center justify-between gap-3 pb-1 mb-1 border-b border-white/10">
            <span className="text-white/40 uppercase tracking-wider text-[9px]">Telemetría</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <Row label="v" value={`${speed} km/h`} hint={`${physics.vMs.toFixed(1)} m/s`} />
          <Row
            label={<Term k="Mach">Mach</Term>}
            value={physics.mach.toFixed(4)}
            valueColor={physics.mach > 0.3 ? '#ffd166' : '#9cffd3'}
          />
          <Row
            label={<Term k="Re">Re</Term>}
            value={physics.re < 1e6 ? physics.re.toFixed(0) : (physics.re / 1e6).toFixed(2) + 'M'}
          />
          <Row
            label={<Term k="Cd">Cd</Term>}
            value={(physics.cd).toFixed(4)}
            valueColor={bird.color}
          />
          <div className="flex items-center justify-between gap-3 pt-1 mt-1 border-t border-white/10">
            <span className="text-white/40">Régimen</span>
            <span
              className="font-bold px-1.5 py-0.5 rounded text-[9px]"
              style={{
                backgroundColor: `${physics.regime.color}25`,
                color: physics.regime.color,
                border: `1px solid ${physics.regime.color}40`,
              }}
            >
              {physics.regime.label}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute top-3 right-3 z-10 select-none">
        <div className="bg-black/55 backdrop-blur-md border border-white/10 rounded-lg p-3 font-mono text-[10px] space-y-1.5 min-w-[150px]">
          <div className="flex items-center justify-between pb-1 mb-1 border-b border-white/10">
            <span className="text-white/40 uppercase tracking-wider text-[9px]">Capas viz</span>
          </div>
          {[
            { k: 'pressure', label: 'Presión CFD' },
            { k: 'streamlines', label: 'Streamlines' },
            { k: 'particles', label: 'Partículas' },
            { k: 'wake', label: 'Estela' },
          ].map((t) => (
            <label
              key={t.k}
              className="flex items-center gap-2 cursor-pointer hover:bg-white/5 px-1 py-0.5 rounded transition"
            >
              <input
                type="checkbox"
                checked={!!viz[t.k]}
                onChange={() => onToggle(t.k)}
                className="accent-primary w-3 h-3"
              />
              <span className="text-white/70">{t.label}</span>
            </label>
          ))}
        </div>
      </div>

      {viz.pressure && (
        <div className="absolute bottom-3 left-3 z-10 select-none pointer-events-none">
          <div className="bg-black/55 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2 min-w-[200px]">
            <div className="text-[9px] text-white/40 font-mono uppercase tracking-wider">
              Mapa de presión local
            </div>
            <PressureLegend />
            <div className="text-[8.5px] text-white/40 mt-1 leading-snug">
              Estancamiento en la punta · expansión en máxima sección
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-3 right-3 z-10 select-none pointer-events-none">
        <div className="bg-black/55 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2 font-mono text-[9px] text-white/40 max-w-[160px] leading-snug">
          Arrastra para rotar · rueda para zoom
        </div>
      </div>
    </>
  )
}

function Row({ label, value, hint, valueColor }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-white/50">{label}</span>
      <span className="flex items-baseline gap-1">
        <span className="font-bold" style={{ color: valueColor || '#fff' }}>
          {value}
        </span>
        {hint && <span className="text-white/30 text-[8.5px]">{hint}</span>}
      </span>
    </div>
  )
}
