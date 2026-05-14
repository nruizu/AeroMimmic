import { useState, useRef, useEffect } from 'react'

const GLOSSARY = {
  Cd: {
    title: 'Coeficiente de arrastre',
    body:
      'Fuerza adimensional de resistencia. F_d = ½·ρ·v²·C_d·A. Valores típicos: pico Martín Pescador 0.04, gota de agua 0.05, esfera 0.47, F1 ~0.7.',
  },
  Re: {
    title: 'Número de Reynolds',
    body:
      'Re = ρvL/μ. Relación entre fuerzas inerciales y viscosas. <2300 = laminar, 2300–4000 = transicional, >4000 = turbulento.',
  },
  Mach: {
    title: 'Número de Mach',
    body:
      'M = v/c_sonido. Velocidad relativa a la del sonido (≈340 m/s en aire). M<0.3 = incompresible, M>0.8 = transónico.',
  },
  laminar: {
    title: 'Flujo laminar',
    body:
      'Capas de fluido se deslizan paralelas sin mezclarse. Mínima resistencia. Ocurre a bajo Re o sobre superficies muy suaves.',
  },
  turbulento: {
    title: 'Flujo turbulento',
    body:
      'Movimiento caótico con remolinos y mezcla. Alta resistencia, alto ruido. Ocurre a Re elevado o tras separación de capa límite.',
  },
  vortice: {
    title: 'Vórtice',
    body:
      'Remolino de fluido formado tras separación de capa límite. Causa pérdida de energía y estela turbulenta.',
  },
  estela: {
    title: 'Estela',
    body:
      'Región turbulenta aguas abajo del cuerpo. Cuanto más ancha, mayor arrastre de presión.',
  },
  eficiencia: {
    title: 'Eficiencia aerodinámica',
    body:
      'Fracción de energía útil del avance respecto a la disipada en resistencia. 100% = ideal sin pérdidas.',
  },
  estabilidad: {
    title: 'Estabilidad del flujo',
    body:
      'Persistencia de un régimen laminar a lo largo del cuerpo. 100% = sin separación; bajos valores indican desprendimiento temprano.',
  },
}

export default function Term({ k, children, className = '' }) {
  const entry = GLOSSARY[k]
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  if (!entry) return <span className={className}>{children}</span>

  return (
    <span ref={ref} className={`relative inline-flex ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        className="underline decoration-dotted decoration-primary/40 underline-offset-2 hover:decoration-primary cursor-help"
      >
        {children}
      </button>
      {open && (
        <span
          className="absolute z-50 left-0 top-full mt-2 w-64 p-3 rounded-lg
                     bg-dark/95 backdrop-blur-xl border border-primary/30
                     shadow-xl shadow-primary/10 text-left"
          onMouseLeave={() => setOpen(false)}
        >
          <span className="block text-[11px] font-bold text-primary mb-1">
            {entry.title}
          </span>
          <span className="block text-[10px] text-white/70 leading-relaxed font-normal">
            {entry.body}
          </span>
        </span>
      )}
    </span>
  )
}
