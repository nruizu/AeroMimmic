import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { SCIENCE_SECTIONS } from '../data/mockData'

function ScienceCard({ section, index }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [40, -40])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.4, 1, 1, 0.4])

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1 }}
      className="glass-card p-6 md:p-8 group"
    >
      <div className="flex items-start gap-5">
        <div className="text-3xl flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-all duration-500">
          {section.icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-white/90 mb-3">{section.title}</h3>
          <p className="text-sm text-white/50 leading-relaxed">{section.content}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function ScienceSection() {
  return (
    <section id="ciencia" className="relative py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <h2 className="section-title">La Ciencia Detrás del Diseño</h2>
          <p className="section-subtitle">
            Cómo la naturaleza resolvió un problema de ingeniería millones de años
            antes que el ser humano
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-white/5 to-primary/30 hidden md:block" />

          <div className="space-y-8 md:pl-16 relative">
            {SCIENCE_SECTIONS.map((section, i) => (
              <div key={section.title} className="relative">
                <div className="hidden md:block absolute -left-16 top-8 w-8 h-px bg-white/10" />
                <div className="hidden md:block absolute -left-[3.35rem] top-7 w-4 h-4 rounded-full border-2 border-primary/30 bg-dark" />
                <ScienceCard section={section} index={i} />
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-strong p-8 mt-12 text-center"
        >
          <h3 className="text-lg font-bold text-white/90 mb-4">
            La conexión Shinkansen — Martín Pescador
          </h3>
          <p className="text-sm text-white/50 leading-relaxed max-w-3xl mx-auto">
            En 1997, el ingeniero jefe Eiji Nakatsu del Ferrocarril de Japón
            Occidental observó cómo el martín pescador se sumergía en el agua
            casi sin salpicaduras. Al estudiar la forma de su pico, descubrió
            que su perfil gradualmente creciente permitía que el agua fluyera
            suavemente a su alrededor. Aplicó esta misma forma a la nariz del
            Shinkansen Serie 500, reduciendo el ruido al salir de túneles en un
            30% y disminuyendo el consumo de energía eléctrica en un 15%.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
