import { motion } from 'framer-motion'
import { BIRDS, FEATURED_BIRD_IDS } from '../data/mockData'
import BirdLibrary from './BirdLibrary'

const birdIcons = {
  kingfisher: (
    <svg viewBox="0 0 80 60" className="w-full h-full">
      <ellipse cx="30" cy="35" rx="20" ry="14" fill="#0077b6" />
      <ellipse cx="28" cy="33" rx="14" ry="10" fill="#00b4d8" />
      <path d="M48 30 L68 28 L68 32 L48 32Z" fill="#e63946" />
      <path d="M48 30 L68 28 L68 32 L48 32Z" fill="#e63946" />
      <path d="M46 30 L65 27" stroke="#c1121f" strokeWidth="1.5" />
      <ellipse cx="24" cy="35" rx="3" ry="2" fill="white" />
      <circle cx="23.5" cy="34.5" r="1.5" fill="#111" />
    </svg>
  ),
  eagle: (
    <svg viewBox="0 0 80 60" className="w-full h-full">
      <ellipse cx="30" cy="35" rx="18" ry="13" fill="#8B6914" />
      <ellipse cx="28" cy="33" rx="12" ry="9" fill="#D4A843" />
      <path d="M40 28 Q52 20 65 18 Q60 24 55 28 Q48 32 42 32Z" fill="#f4a261" />
      <path d="M40 32 Q50 28 58 26" stroke="#e76f51" strokeWidth="1.5" fill="none" />
      <circle cx="38" cy="28" r="2" fill="#ffd700" />
      <circle cx="37.5" cy="27.5" r="1.2" fill="#111" />
      <path d="M15 20 Q10 10 5 5" stroke="#8B6914" strokeWidth="1.5" fill="none" />
      <path d="M15 40 Q10 48 5 52" stroke="#8B6914" strokeWidth="1.5" fill="none" />
    </svg>
  ),
  toucan: (
    <svg viewBox="0 0 80 60" className="w-full h-full">
      <ellipse cx="30" cy="35" rx="18" ry="14" fill="#1a1a1a" />
      <ellipse cx="28" cy="33" rx="14" ry="10" fill="#2a2a2a" />
      <path d="M42 28 Q55 22 70 30 Q60 36 48 36Z" fill="#e63946" />
      <path d="M45 30 L68 30" stroke="#c1121f" strokeWidth="2" />
      <path d="M42 34 Q52 36 60 34" fill="none" stroke="#ffd700" strokeWidth="1" />
      <circle cx="26" cy="35" r="3" fill="white" />
      <circle cx="25.5" cy="34.5" r="1.8" fill="#111" />
      <path d="M42 28 Q48 24 55 26" fill="none" stroke="#ffd700" strokeWidth="0.5" />
      <ellipse cx="50" cy="32" rx="6" ry="3" fill="#ff6b6b" opacity="0.3" />
    </svg>
  ),
}

export default function BirdSelector({ selectedBird, onSelect, birdList }) {
  return (
    <section id="selector" className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Selecciona un Ave</h2>
          <p className="section-subtitle">
            Compara cómo diferentes morfologías de pico afectan la resistencia
            aerodinámica
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {FEATURED_BIRD_IDS.map((id, index) => {
            const bird = BIRDS[id]
            const isSelected = selectedBird === id
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                onClick={() => onSelect(id)}
                className={`bird-card ${isSelected ? 'selected' : ''} group`}
              >
                <div
                  className={`absolute inset-0 opacity-0 transition-opacity duration-500 ${
                    isSelected ? 'opacity-100' : 'group-hover:opacity-30'
                  }`}
                  style={{
                    background: `radial-gradient(ellipse at center, ${bird.color}15 0%, transparent 70%)`,
                  }}
                />

                <div className="relative z-10">
                  <div className="flex justify-center mb-4">
                    <div
                      className={`w-28 h-20 transition-transform duration-500 ${
                        isSelected ? 'scale-110' : ''
                      }`}
                    >
                      {birdIcons[id]}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-center mb-1">{bird.name}</h3>
                  <p className="text-xs text-white/40 text-center font-mono mb-3">
                    {bird.nameEn}
                  </p>

                  <div className="flex flex-wrap gap-1.5 justify-center mb-3">
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-mono"
                      style={{
                        backgroundColor: `${bird.color}20`,
                        color: bird.color,
                        border: `1px solid ${bird.color}30`,
                      }}
                    >
                      Cd: {bird.dragCoefficient}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-mono"
                      style={{
                        backgroundColor: `${bird.color}20`,
                        color: bird.color,
                        border: `1px solid ${bird.color}30`,
                      }}
                    >
                      {bird.efficiency}% eficiencia
                    </span>
                  </div>

                  <p className="text-sm text-white/60 text-center mb-4 leading-relaxed">
                    {bird.beakType}
                  </p>

                  <div className="text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelect(id)
                      }}
                      className={`btn-simular ${
                        isSelected
                          ? 'shadow-lg shadow-primary/20'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      {isSelected ? '✓ Seleccionado' : 'Simular'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}

          <div className="md:col-span-3 xl:col-span-1">
            <BirdLibrary selectedBird={selectedBird} onSelect={onSelect} />
          </div>
        </div>
      </div>
    </section>
  )
}
