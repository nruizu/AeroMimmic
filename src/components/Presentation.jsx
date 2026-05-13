import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const STORAGE_KEY = 'aeromimmic_presentation_slide'

const quizQuestions = [
  {
    question: '¿Cuál es el ave que inspiró el diseño del Shinkansen?',
    options: ['Águila Real', 'Martín Pescador', 'Tucán', 'Colibrí'],
    correct: 1,
  },
  {
    question: '¿Cuántas veces más aerodinámico es el pico del Martín Pescador comparado con el Tucán?',
    options: ['2x', '3x', '5.5x', '10x'],
    correct: 2,
  },
  {
    question: '¿Qué problema resuelve la forma del pico del Martín Pescador en túneles?',
    options: ['El calentamiento del tren', 'Las ondas de presión', 'El consumo de combustible', 'La velocidad máxima'],
    correct: 1,
  },
  {
    question: '¿Qué porcentaje de eficiencia tiene el diseño del Shinkansen comparado con el convencional?',
    options: ['23% más', '15% más', '50% más', '10% más'],
    correct: 0,
  },
  {
    question: '¿Cuál es el principio central de la biomímesis?',
    options: ['Minimizar costos de producción', 'Copiar diseños de la naturaleza', 'Aumentar la velocidad', 'Reducir el peso'],
    correct: 1,
  },
]

const slidesData = [
  {
    type: 'title',
    title: 'Del Pico del Martín Pescador al Shinkansen Japonés',
    subtitle: 'Cómo la naturaleza inspiró la revolución del transporte de alta velocidad',
    badge: 'Estudio de Biomímesis',
  },
  {
    type: 'grid3',
    title: '¿Qué es la Biomímesis?',
    cards: [
      { icon: '🧬', title: 'Definición', desc: 'La biomímesis es la práctica de aprender de la naturaleza e imitar sus diseños para resolver problemas humanos.' },
      { icon: '🌿', title: 'Inspiración Natural', desc: '3.8 mil millones de años de evolución han optimizado soluciones biológicas que podemos aplicar a la ingeniería.' },
      { icon: '⚡', title: 'Aplicación Práctica', desc: 'El Shinkansen es un ejemplo perfecto: su diseño se inspiró en el pico del martín pescador.' },
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
      { icon: '🌊', title: 'Sin Salpicaduras', desc: 'El pico del martín pescador penetra el agua a alta velocidad sin generar salpicaduras.' },
      { icon: '💨', title: 'Flujo Laminar', desc: 'La geometría del pico mantiene un flujo de aire laminar, reduciendo la resistencia.' },
      { icon: '🎯', title: 'Perfil Optimizado', desc: 'El perfil crece gradualmente desde la punta, creando una transición suave.' },
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

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a1a',
    position: 'relative',
    overflow: 'hidden',
  },
  background: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(0,180,216,0.1) 0%, transparent 50%, rgba(0,230,118,0.05) 100%)',
  },
  content: {
    position: 'relative',
    zIndex: 10,
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 24px 100px',
  },
  maxWidth: {
    maxWidth: '1200px',
    width: '100%',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(90deg, #fff, #48cae4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '16px',
  },
  subtitle: {
    fontSize: '1.25rem',
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    marginBottom: '32px',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '24px',
    backdropFilter: 'blur(10px)',
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginTop: '32px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '24px',
  },
  th: {
    padding: '16px',
    textAlign: 'left',
    color: 'rgba(255,255,255,0.5)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    fontSize: '0.875rem',
  },
  td: {
    padding: '16px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    color: 'rgba(255,255,255,0.7)',
  },
  button: {
    padding: '12px 24px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: 'white',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.2s',
  },
  buttonActive: {
    backgroundColor: 'rgba(0,180,216,0.3)',
    borderColor: '#00b4d8',
  },
  primaryButton: {
    background: 'linear-gradient(90deg, #00b4d8, #00e676)',
    border: 'none',
    color: 'white',
    fontWeight: 'bold',
    padding: '16px 32px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '1.125rem',
    width: '100%',
  },
}

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
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.3em', color: '#00b4d8', textTransform: 'uppercase', marginBottom: '16px' }}>
              {slide.badge}
            </div>
            <h1 style={styles.title}>{slide.title}</h1>
            <p style={{ ...styles.subtitle, fontSize: '1.5rem' }}>{slide.subtitle}</p>
            <p style={{ marginTop: '64px', fontSize: '0.875rem', color: 'rgba(255,255,255,0.3)' }}>Universidad • DSIN • 2026</p>
          </div>
        )

      case 'grid3':
        return (
          <div>
            <h2 style={{ ...styles.title, fontSize: '2rem', textAlign: 'center' }}>{slide.title}</h2>
            <div style={styles.grid3}>
              {slide.cards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={styles.card}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{card.icon}</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '12px', color: 'white' }}>{card.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )

      case 'beaks':
        return (
          <div>
            <h2 style={{ ...styles.title, fontSize: '2rem', textAlign: 'center' }}>{slide.title}</h2>
            <p style={styles.subtitle}>{slide.subtitle}</p>
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '64px', marginBottom: '48px', marginTop: '32px' }}>
              {slide.birds.map((bird, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: '80px',
                      borderRadius: '12px 12px 0 0',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      paddingBottom: '12px',
                      fontWeight: 'bold',
                      fontSize: '1.125rem',
                      height: `${bird.value * 1.8}px`,
                      background: `linear-gradient(to top, ${bird.color}, ${bird.color}88)`,
                    }}
                  >
                    {bird.value}%
                  </div>
                  <p style={{ marginTop: '16px', fontWeight: 600, color: bird.color }}>{bird.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{bird.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '80px' }}>
              {slide.stats.map((stat, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(90deg, #00e676, #00b4d8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {stat.value}
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )

      case 'table':
        return (
          <div>
            <h2 style={{ ...styles.title, fontSize: '2rem', textAlign: 'center', marginBottom: '32px' }}>{slide.title}</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={{ ...styles.th, textAlign: 'left' }}>Métrica</th>
                    <th style={{ ...styles.th, textAlign: 'center', color: '#48cae4' }}>Martín Pescador</th>
                    <th style={{ ...styles.th, textAlign: 'center', color: '#f4a261' }}>Águila</th>
                    <th style={{ ...styles.th, textAlign: 'center', color: '#e63946' }}>Tucán</th>
                  </tr>
                </thead>
                <tbody>
                  {slide.rows.map((row, i) => (
                    <tr key={i}>
                      <td style={{ ...styles.td, textAlign: 'left' }}>{row.metric}</td>
                      <td style={{ ...styles.td, textAlign: 'center', fontFamily: 'monospace', fontWeight: 'bold', color: row.best === 'kingfisher' ? '#00e676' : 'rgba(255,255,255,0.7)' }}>{row.kingfisher}</td>
                      <td style={{ ...styles.td, textAlign: 'center', fontFamily: 'monospace', color: 'rgba(255,255,255,0.7)' }}>{row.eagle}</td>
                      <td style={{ ...styles.td, textAlign: 'center', fontFamily: 'monospace', fontWeight: 'bold', color: row.best === 'toucan' ? '#e63946' : 'rgba(255,255,255,0.7)' }}>{row.toucan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: '32px', padding: '24px', background: 'linear-gradient(90deg, rgba(0,180,216,0.2), rgba(0,230,118,0.1))', borderRadius: '16px', border: '1px solid rgba(0,180,216,0.3)' }}>
              <p style={{ textAlign: 'center', fontSize: '1.125rem' }}>
                <span style={{ color: '#00e676', fontWeight: 'bold' }}>Conclusión:</span> {slide.conclusion}
              </p>
            </div>
          </div>
        )

      case 'timeline':
        return (
          <div>
            <h2 style={{ ...styles.title, fontSize: '2rem', textAlign: 'center', marginBottom: '64px' }}>{slide.title}</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', flexWrap: 'wrap', gap: '32px' }}>
              <div style={{ position: 'absolute', top: '32px', left: '10%', right: '10%', height: '4px', background: 'linear-gradient(90deg, #00b4d8, #00e676)', borderRadius: '2px', display: window.innerWidth < 768 ? 'none' : 'block' }} />
              {slide.items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  style={{ textAlign: 'center', flex: '1', minWidth: '150px' }}
                >
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#0a0a1a', border: '2px solid #00b4d8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 16px', position: 'relative', zIndex: 1 }}>
                    {item.icon}
                  </div>
                  <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '8px' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', maxWidth: '160px', margin: '0 auto' }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )

      case 'shinkansen':
        return (
          <div>
            <h2 style={{ ...styles.title, fontSize: '2rem', textAlign: 'center', marginBottom: '40px' }}>{slide.title}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginBottom: '40px' }}>
              <div style={{ ...styles.card, borderColor: 'rgba(230,57,70,0.3)' }}>
                <div style={{ fontSize: '4rem', textAlign: 'center', marginBottom: '16px' }}>🚃</div>
                <h3 style={{ textAlign: 'center', color: '#e63946', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '24px' }}>Tren Convencional</h3>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {Object.entries(slide.conventional).map(([key, val]) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>{key}</span>
                      <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#e63946' }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ ...styles.card, borderColor: 'rgba(0,180,216,0.3)' }}>
                <div style={{ fontSize: '4rem', textAlign: 'center', marginBottom: '16px' }}>🚄</div>
                <h3 style={{ textAlign: 'center', color: '#00b4d8', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '24px' }}>Shinkansen (Biomímesis)</h3>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {Object.entries(slide.shinkansen).map(([key, val]) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>{key}</span>
                      <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#00b4d8' }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p style={{ textAlign: 'center', fontSize: '1.25rem' }}>
              {slide.summary.split('•').map((part, i) => (
                <span key={i}>
                  {i > 0 && ' • '}
                  <span style={{ color: '#00e676', fontWeight: 'bold' }}>{part.trim()}</span>
                </span>
              ))}
            </p>
          </div>
        )

      case 'conclusions':
        return (
          <div>
            <h2 style={{ ...styles.title, fontSize: '2rem', textAlign: 'center', marginBottom: '40px' }}>Conclusiones del Estudio</h2>
            <div style={{ ...styles.card, borderColor: 'rgba(0,230,118,0.3)', background: 'linear-gradient(135deg, rgba(0,230,118,0.1), rgba(0,180,216,0.05))', padding: '32px' }}>
              <ul style={{ display: 'grid', gap: '24px' }}>
                {slide.conclusions.map((c, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', fontSize: '1.125rem', color: 'rgba(255,255,255,0.8)' }}
                  >
                    <span style={{ color: '#00e676', fontSize: '1.5rem' }}>✓</span>
                    <span>{c}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            <p style={{ textAlign: 'center', fontSize: '1.5rem', marginTop: '40px', fontWeight: 600 }}>
              🐦 → 🚄 <span style={{ color: '#00b4d8' }}>La naturaleza nos enseña a volar más rápido y eficiente</span>
            </p>
          </div>
        )

      case 'quiz': {
        const [answers, setAnswers] = useState(() => {
          const saved = localStorage.getItem('aeromimmic_quiz_answers')
          return saved ? JSON.parse(saved) : {}
        })
        const [showResults, setShowResults] = useState(false)

        const handleAnswer = (qIndex, optionIndex) => {
          const newAnswers = { ...answers, [qIndex]: optionIndex }
          setAnswers(newAnswers)
          localStorage.setItem('aeromimmic_quiz_answers', JSON.stringify(newAnswers))
        }

        const getScore = () => quizQuestions.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0)

        const getMessage = (score) => {
          const percent = (score / quizQuestions.length) * 100
          if (percent === 100) return { emoji: '🏆', text: '¡Perfecto! Dominas el tema' }
          if (percent >= 80) return { emoji: '🌟', text: '¡Excelente! Muy buen conocimiento' }
          if (percent >= 60) return { emoji: '👍', text: '¡Bien! Tienes una buena base' }
          return { emoji: '📚', text: 'Revisa el material y vuelve a intentarlo' }
        }

        const allAnswered = Object.keys(answers).length === quizQuestions.length

        return (
          <div>
            <h2 style={{ ...styles.title, fontSize: '2rem', textAlign: 'center' }}>{slide.title}</h2>
            <p style={{ ...styles.subtitle, marginBottom: '32px' }}>{slide.subtitle}</p>

            {!showResults ? (
              <div style={{ display: 'grid', gap: '16px', maxWidth: '800px', margin: '0 auto' }}>
                {quizQuestions.map((q, qIndex) => (
                  <motion.div
                    key={qIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: qIndex * 0.1 }}
                    style={{ ...styles.card, padding: '20px' }}
                  >
                    <p style={{ fontWeight: 600, marginBottom: '12px', color: 'white' }}>{qIndex + 1}. {q.question}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
                      {q.options.map((opt, oIndex) => (
                        <button
                          key={oIndex}
                          onClick={() => handleAnswer(qIndex, oIndex)}
                          style={{
                            ...styles.button,
                            ...(answers[qIndex] === oIndex ? styles.buttonActive : {}),
                            textAlign: 'left',
                            fontSize: '0.875rem',
                          }}
                        >
                          <span style={{ color: '#00b4d8', marginRight: '8px' }}>{String.fromCharCode(65 + oIndex)}.</span>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ))}

                {allAnswered && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setShowResults(true)}
                    style={styles.primaryButton}
                  >
                    Ver Resultados 🎯
                  </motion.button>
                )}
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ textAlign: 'center' }}
              >
                <div style={{ fontSize: '5rem', marginBottom: '16px' }}>{getMessage(getScore()).emoji}</div>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px' }}>Tu puntuación</h3>
                <p style={{ fontSize: '4rem', fontWeight: '800', color: '#00b4d8', marginBottom: '16px' }}>
                  {getScore()} / {quizQuestions.length}
                </p>
                <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.6)', marginBottom: '32px' }}>{getMessage(getScore()).text}</p>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => { setAnswers({}); setShowResults(false); localStorage.removeItem('aeromimmic_quiz_answers'); }}
                    style={styles.button}
                  >
                    Repetir Quiz 🔄
                  </button>
                  <button
                    onClick={() => { window.location.href = '#/' }}
                    style={{ ...styles.primaryButton, width: 'auto', padding: '12px 24px' }}
                  >
                    Volver al Inicio 🏠
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )
      }

      default:
        return null
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.background} />

      <div style={{ position: 'fixed', top: '16px', left: '16px', zIndex: 50, display: 'flex', alignItems: 'center', gap: '12px' }}>
        <a
          href="#/"
          style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textDecoration: 'none', fontSize: '1.25rem' }}
        >
          ←
        </a>
        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #00b4d8, #00e676)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
          🚄
        </div>
        <span style={{ fontWeight: 'bold' }}>AeroMimic</span>
      </div>

      <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 50, fontFamily: 'monospace', fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)' }}>
        {currentSlide + 1} / {totalSlides}
      </div>

      <div style={styles.content}>
        <div style={styles.maxWidth}>
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

      <div style={{ position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)', zIndex: 50, display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          style={{ ...styles.button, width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', ...(currentSlide === 0 ? { opacity: 0.3 } : {}) }}
        >
          ←
        </button>
        <div style={{ display: 'flex', gap: '8px' }}>
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              style={{
                width: i === currentSlide ? '32px' : '12px',
                height: '12px',
                borderRadius: '6px',
                backgroundColor: i === currentSlide ? '#00b4d8' : 'rgba(255,255,255,0.2)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
        <button
          onClick={nextSlide}
          disabled={currentSlide === totalSlides - 1}
          style={{ ...styles.button, width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', ...(currentSlide === totalSlides - 1 ? { opacity: 0.3 } : {}) }}
        >
          →
        </button>
      </div>

      <div style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 50, fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)' }}>
        Usa ← → o Espacio
      </div>
    </div>
  )
}