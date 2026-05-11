import { motion } from 'framer-motion'

export default function SpeedSlider({ speed, onChange, min, max }) {
  const pct = ((speed - min) / (max - min)) * 100

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-white/40 font-mono uppercase tracking-wider">
          Velocidad del tren
        </span>
        <motion.span
          key={speed}
          initial={{ scale: 1.2, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-lg font-bold font-mono text-primary"
        >
          {speed} <span className="text-xs text-white/40 font-normal">km/h</span>
        </motion.span>
      </div>

      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={speed}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 appearance-none cursor-pointer rounded-full outline-none"
          style={{
            background: `linear-gradient(to right, #0077b6 0%, #00b4d8 ${pct}%, rgba(255,255,255,0.08) ${pct}%, rgba(255,255,255,0.08) 100%)`,
          }}
        />

        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-white/20 font-mono">{min} km/h</span>
          <span className="text-[10px] text-white/20 font-mono">{max} km/h</span>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        {[130, 180, 240, 300].map((v) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={`px-3 py-1 rounded text-[11px] font-mono transition-all ${
              Math.abs(speed - v) < 10
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'bg-white/5 text-white/30 border border-white/5 hover:bg-white/10'
            }`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  )
}
