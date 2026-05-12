import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { label: 'Inicio', href: '#hero' },
  { label: 'Aves', href: '#selector' },
  { label: 'Simulación', href: '#simulacion' },
  { label: 'Resultados', href: '#resultados' },
  { label: 'Ciencia', href: '#ciencia' },
  { label: 'Comparación', href: '#comparacion' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-dark/80 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <a href="#hero" className="flex items-center gap-2 group">
          <span className="text-xl font-bold text-gradient">AeroMimmic</span>
          <span className="text-xs text-white/30 font-mono">v1.0</span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-2 text-sm text-white/50 hover:text-white/90 transition-colors rounded-lg hover:bg-white/5"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#/presentacion"
            className="ml-4 px-4 py-2 text-sm bg-gradient-to-r from-cyan-500 to-green-500 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            📊 Presentación
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-white/60 hover:text-white"
          aria-label="Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong mx-4 mb-4 overflow-hidden"
          >
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#/presentacion"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-sm text-cyan-400 font-semibold hover:bg-white/5"
            >
              📊 Ver Presentación
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
