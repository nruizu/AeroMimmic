import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const STORAGE_KEY = 'aeromimmic_presentation_slide'

const slidesData = [
  {
    type: 'title',
    title: 'Del Pico del Martín Pescador\nal Shinkansen Japonés',
    subtitle: 'Cómo la naturaleza inspiró la revolución del transporte de alta velocidad',
    badge: 'Estudio de Biomímesis',
  },
  {
    type: 'grid3',
    title: '¿Qué es la Biomímesis?',
    cards: [
      {
        icon: '🧬',
        title: 'Definición',
        desc: 'La biomímesis es la práctica de aprender de la naturaleza e imitar sus diseños y procesos para resolver problemas humanos.',
      },
      {
        icon: '🌿',
        title: 'Inspiración Natural',
        desc: '3.8 mil millones de años de evolución han optimizado soluciones biológicas que podemos aplicar a la ingeniería.',
      },
      {
        icon: '⚡',
        title: 'Aplicación Práctica',
        desc: 'El Shinkansen es un ejemplo perfecto: su diseño se inspiró en el pico del martín pescador.',
      },
    ],
  },
  {
    type: 'beaks',
    title: 'Modelo de Simulación: Los 3 Picos',
    subtitle: 'Análisis comparativo de la aerodinámica de tres especies de aves',
    stats: [
      { value: '3x', label: 'Mayor eficiencia del Kingfisher vs Tucán' },
      { value: '5.5x', label: 'Menor resistencia aerodinámica' },
      { value: '98%', label: 'Estabilidad de flujo' },
    ],
    birds: [
      { name: 'Martín Pescador', value: 95, color: '#00b4d8', desc: 'Pico largo y recto' },
      { name: 'Águila', value: 72, color: '#f4a261', desc: 'Pico curvo y ganchudo' },
      { name: 'Tucán', value: 45, color: '#e63946', desc: 'Pico grande y voluminoso' },
    ],
  },
  {
    type: 'table',
    title: 'Métricas Aerodinámicas Detalladas',
    rows: [
      { metric: 'Coeficiente de Arrastre (Cd)', kingfisher: '0.04', eagle: '0.12', toucan: '0.22', best: 'kingfisher' },
      { metric: 'Eficiencia Energética', kingfisher: '95%', eagle: '72%', toucan: '45%', best: 'kingfisher' },
      { metric: 'Nivel de Ruido', kingfisher: '15 dB', eagle: '38 dB', toucan: '72 dB', best: 'kingfisher' },
      { metric: 'Estabilidad del Flujo', kingfisher: '98%', eagle: '70%', toucan: '35%', best: 'kingfisher' },
      { metric: 'Factor de Turbulencia', kingfisher: '0.08', eagle: '0.35', toucan: '0.70', best: 'kingfisher' },
      { metric: 'Suavidad del Flujo', kingfisher: '0.95', eagle: '0.60', toucan: '0.25', best: 'kingfisher' },
    ],
    conclusion: 'El pico del Martín Pescador es 5.5 veces más aerodinámico que el del Tucán.',
  },
  {
    type: 'grid3',
    title: 'El Secreto del Martín Pescador',
    cards: [
      {
        icon: '🌊',
        title: 'Sin Salpicaduras',
        desc: 'El pico del martín pescador penetra el agua a alta velocidad sin generar salpicaduras gracias a su forma aerodinámica.',
      },
      {
        icon: '💨',
        title: 'Flujo Laminar',
        desc: 'La geometría del pico mantiene un flujo de aire laminar, reduciendo la resistencia y las ondas de choque.',
      },
      {
        icon: '🎯',
        title: 'Perfil Optimizado',
        desc: 'El perfil crece gradualmente desde la punta, creando una transición suave que minimiza la separación del flujo.',
      },
    ],
  },
  {
    type: 'timeline',
    title: 'De la Naturaleza a la Ingeniería',
    items: [
      { icon: '🐦', title: 'Observación', desc: 'Eiji Nakatsu observa al martín pescador' },
      { icon: '🔬', title: 'Análisis', desc: 'Estudio de la morfología del pico' },
      { icon: '✏️', title: 'Diseño', desc: 'Adaptación al frente del tren' },
      { icon: '🚄', title: 'Resultado', desc: 'Reducción de ruido y mayor eficiencia' },
    ],
  },
  {
    type: 'shinkansen',
    title: 'Resultados: Shinkansen vs Diseño Convencional',
    conventional: { drag: '0.34', noise: '85 dB', efficiency: '62%', pressure: 'Alta' },
    shinkansen: { drag: '0.20', noise: '62 dB', efficiency: '85%', pressure: 'Baja' },
    summary: '41% reducción en arrastre • 27% menos ruido • 23% más eficiente',
  },
  {
    type: 'conclusions',
    conclusions: [
      'La forma del pico determina la eficiencia aerodinámica: los picos largos y rectos reducen la resistencia 5.5x más que los voluminosos.',
      'La biomímesis produce resultados medibles: el Shinkansen redujo consumo de energía un 15% y presión en túneles un 50%.',
      'La naturaleza tiene soluciones optimizadas: 3.8 mil millones de años de evolución pueden inspirar ingeniería superior.',
      'Mantener flujo laminar (98% en Kingfisher) minimiza turbulencias, ruido y consumo energético.',
      'La observación inspira innovación: la pregunta "¿por qué no salpica?" revolucionó el transporte de alta velocidad.',
    ],
  },
]

export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? parseInt(saved, 10) : 0
  })
  const totalSlides = slidesData.length

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currentSlide.toString())
  }, [currentSlide])

  const nextSlide = () => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1))
  const prevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 0))

  const slide = slidesData[currentSlide]

  const renderSlide = () => {
    switch (slide.type) {
      case 'title':
        return (
          <div className="text-center">
            <span className="text-sm font-semibold tracking-[0.3em] text-primary uppercase">{slide.badge}</span>
            <h1 className="text-5xl md:text-7xl font-extrabold mt-6 mb-6 bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent leading-tight">
              {slide.title}
            </h1>
            <p className="text-xl text-white/50">{slide.subtitle}</p>
            <p className="mt-16 text-sm text-white/30">Universidad • DSIN • 2026</p>
          </div>
        )

      case 'grid3':
        return (
          <div>
            <h2 className="text-4xl font-bold text-center mb-4">{slide.title}</h2>
            {slide.subtitle && <p className="text-center text-white/50 mb-10">{slide.subtitle}</p>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {slide.cards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-6 rounded-2xl"
                >
                  <div className="text-4xl mb-4">{card.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-white/90">{card.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )

      case 'beaks':
        return (
          <div>
            <h2 className="text-4xl font-bold text-center mb-4">{slide.title}</h2>
            <p className="text-center text-white/50 mb-10">{slide.subtitle}</p>
            
            <div className="flex justify-center items-end gap-16 mb-12">
              {slide.birds.map((bird, i) => (
                <div key={i} className="text-center">
                  <div
                    className="w-20 rounded-t-xl flex items-end justify-center pb-3 font-bold text-lg"
                    style={{
                      height: `${bird.value * 1.8}px`,
                      background: `linear-gradient(to top, ${bird.color}, ${bird.color}88)`,
                    }}
                  >
                    {bird.value}%
                  </div>
                  <p className="mt-4 font-semibold" style={{ color: bird.color }}>{bird.name}</p>
                  <p className="text-xs text-white/40">{bird.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-20">
              {slide.stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl font-extrabold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <p className="text-sm text-white/50 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )

      case 'table':
        return (
          <div>
            <h2 className="text-4xl font-bold text-center mb-8">{slide.title}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-center">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 text-left text-white/50 font-medium text-sm uppercase tracking-wider">Métrica</th>
                    <th className="py-4 text-cyan-400 font-medium text-sm">Martín Pescador</th>
                    <th className="py-4 text-amber-400 font-medium text-sm">Águila</th>
                    <th className="py-4 text-red-400 font-medium text-sm">Tucán</th>
                  </tr>
                </thead>
                <tbody>
                  {slide.rows.map((row, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="py-4 text-left text-white/70">{row.metric}</td>
                      <td className={`py-4 font-mono font-bold ${row.best === 'kingfisher' ? 'text-green-400' : 'text-white/70'}`}>
                        {row.kingfisher}
                      </td>
                      <td className="py-4 font-mono text-white/70">{row.eagle}</td>
                      <td className={`py-4 font-mono font-bold ${row.best === 'toucan' ? 'text-red-400' : 'text-white/70'}`}>
                        {row.toucan}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-8 p-6 bg-gradient-to-r from-cyan-500/20 to-green-500/10 rounded-2xl border border-cyan-500/30">
              <p className="text-center text-lg">
                <span className="text-green-400 font-bold">Conclusión:</span> {slide.conclusion}
              </p>
            </div>
          </div>
        )

      case 'timeline':
        return (
          <div>
            <h2 className="text-4xl font-bold text-center mb-16">{slide.title}</h2>
            <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative">
              <div className="absolute top-8 left-[10%] right-[10%] h-1 bg-gradient-to-r from-cyan-400 to-green-400 rounded-full hidden md:block" />
              {slide.items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="flex flex-col items-center text-center flex-1"
                >
                  <div className="w-16 h-16 rounded-full bg-dark border-2 border-cyan-400 flex items-center justify-center text-2xl mb-4 relative z-10">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-white/50 max-w-[160px]">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )

      case 'shinkansen':
        return (
          <div>
            <h2 className="text-4xl font-bold text-center mb-10">{slide.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="glass-card p-6 rounded-2xl border-red-500/30">
                <div className="text-5xl mb-4 text-center">🚃</div>
                <h3 className="text-xl font-bold text-center text-red-400 mb-6">Tren Convencional</h3>
                <div className="space-y-4">
                  {Object.entries(slide.conventional).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/50 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-mono font-bold text-red-400">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-card p-6 rounded-2xl border-cyan-500/30">
                <div className="text-5xl mb-4 text-center">🚄</div>
                <h3 className="text-xl font-bold text-center text-cyan-400 mb-6">Shinkansen (Biomímesis)</h3>
                <div className="space-y-4">
                  {Object.entries(slide.shinkansen).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/50 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-mono font-bold text-cyan-400">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-center text-xl">
              {slide.summary.split('•').map((part, i) => (
                <span key={i}>
                  {i > 0 && ' • '}
                  <span className="text-green-400 font-bold">{part.trim()}</span>
                </span>
              ))}
            </p>
          </div>
        )

      case 'conclusions':
        return (
          <div>
            <h2 className="text-4xl font-bold text-center mb-10">Conclusiones del Estudio</h2>
            <div className="glass-card p-8 rounded-2xl border-green-500/30 bg-gradient-to-br from-green-500/10 to-cyan-500/10">
              <ul className="space-y-6">
                {slide.conclusions.map((c, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4 text-lg text-white/80"
                  >
                    <span className="text-green-400 text-2xl">✓</span>
                    <span>{c}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            <p className="text-center text-2xl mt-10 font-semibold">
              🐦 → 🚄 <span className="text-cyan-400">La naturaleza nos enseña a volar más rápido y eficiente</span>
            </p>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-green-500/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(0,180,216,0.1)_0%,transparent_50%),radial-gradient(ellipse_at_70%_80%,rgba(0,230,118,0.05)_0%,transparent_40%)]" />

      <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
        <a
          href="#/"
          className="w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center text-lg hover:bg-white/10 transition-colors"
        >
          ←
        </a>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-green-500 flex items-center justify-center text-xl">
          🚄
        </div>
        <span className="font-bold">AeroMimic</span>
      </div>

      <div className="fixed top-4 right-4 z-50 font-mono text-sm text-white/40">
        {currentSlide + 1} / {totalSlides}
      </div>

      <div className="relative z-10 h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-5xl w-full">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {renderSlide()}
          </motion.div>
        </div>
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-xl disabled:opacity-30 hover:bg-cyan-500/20 transition-colors"
        >
          ←
        </button>
        <div className="flex gap-2">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentSlide ? 'bg-cyan-400 w-8' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
        <button
          onClick={nextSlide}
          disabled={currentSlide === totalSlides - 1}
          className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-xl disabled:opacity-30 hover:bg-cyan-500/20 transition-colors"
        >
          →
        </button>
      </div>

      <div className="fixed bottom-8 right-8 z-50 text-xs text-white/20">
        Usa ← → o Espacio
      </div>
    </div>
  )
}