import { motion } from 'framer-motion'
import Term from './Term'

const FORMULAS = [
  { name: 'Arrastre', expr: 'F_d = ½ · ρ · v² · C_d · A', desc: 'Fuerza opuesta al avance' },
  { name: 'Reynolds', expr: 'Re = ρ · v · L / μ', desc: 'Régimen del flujo' },
  { name: 'Mach', expr: 'M = v / c', desc: 'Velocidad relativa al sonido' },
  { name: 'Bernoulli', expr: 'P + ½ρv² = const', desc: 'Conservación energía fluido' },
]

const SOURCES = [
  {
    label: 'Nakatsu, E. (1997)',
    detail: 'Sketches of nature in design — JR West Shinkansen 500',
  },
  {
    label: 'Biomimicry Institute',
    detail: 'biomimicry.org · catálogo de soluciones bio-inspiradas',
  },
  {
    label: 'Hertel, H. (1966)',
    detail: 'Structure-Form-Movement · aerodinámica de aves',
  },
  {
    label: 'Datos morfométricos',
    detail: 'Valores orientativos didácticos · no resultado CFD real',
  },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-16 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gradient mb-2">AeroMimmic</h3>
            <p className="text-sm text-white/40 leading-relaxed">
              Plataforma educativa interactiva sobre biomímesis aplicada al diseño
              aerodinámico. Inspirada en el rediseño del Shinkansen 500 Series.
            </p>
            <div className="flex gap-2 mt-4">
              <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[9px] font-mono text-white/50">
                React 18
              </span>
              <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[9px] font-mono text-white/50">
                Three.js
              </span>
              <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[9px] font-mono text-white/50">
                Recharts
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-xs font-bold text-white/80 uppercase tracking-wider mb-3">
              Metodología
            </h4>
            <ul className="space-y-2">
              {FORMULAS.map((f) => (
                <li key={f.name} className="text-[11px]">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-white/60">{f.name}</span>
                    <code className="text-cyan-300/80 font-mono text-[10px]">
                      {f.expr}
                    </code>
                  </div>
                  <span className="text-white/30 text-[9px]">{f.desc}</span>
                </li>
              ))}
            </ul>
            <p className="text-[10px] text-amber-300/70 mt-3 leading-snug">
              ⚠ Valores de <Term k="Cd">Cd</Term>, <Term k="Re">Re</Term> y
              eficiencia son aproximaciones didácticas, no resultados de
              simulación CFD validada.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-xs font-bold text-white/80 uppercase tracking-wider mb-3">
              Fuentes
            </h4>
            <ul className="space-y-2">
              {SOURCES.map((s) => (
                <li key={s.label} className="text-[11px]">
                  <div className="text-white/60">{s.label}</div>
                  <div className="text-white/30 text-[9px] leading-snug">{s.detail}</div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-white/30">
            © {new Date().getFullYear()} AeroMimmic — Proyecto académico DSIN
          </p>
          <p className="text-[11px] text-white/30 font-mono">
            Built with biomímesis &middot; Datos & código abiertos
          </p>
        </div>
      </div>
    </footer>
  )
}
