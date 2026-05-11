export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-gradient">AeroMimmic</h3>
            <p className="text-sm text-white/40 mt-1">
              Biomímesis aplicada al diseño del Shinkansen
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-white/30">
              Proyecto educativo sobre biomímesis y aerodinámica
            </p>
            <p className="text-xs text-white/20 mt-1">
              Inspirado en el trabajo de Eiji Nakatsu y el Shinkansen 500 Series
            </p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} AeroMimmic — Simulación educativa interactiva
          </p>
        </div>
      </div>
    </footer>
  )
}
