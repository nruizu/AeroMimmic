import { useSimulation } from './hooks/useSimulation'
import ParticleField from './components/ParticleField'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import BirdSelector from './components/BirdSelector'
import Simulation from './components/Simulation'
import ComparisonCharts from './components/ComparisonCharts'
import ScienceSection from './components/ScienceSection'
import TrainComparison from './components/TrainComparison'
import Footer from './components/Footer'

export default function App() {
  const {
    selectedBird,
    speed,
    metrics,
    comparisonData,
    selectBird,
    changeSpeed,
    birdList,
    speedRange,
  } = useSimulation()

  return (
    <div className="relative min-h-screen">
      <ParticleField />
      <Navbar />
      <Hero />
      <BirdSelector selectedBird={selectedBird} onSelect={selectBird} birdList={birdList} />
      <Simulation
        selectedBird={selectedBird}
        speed={speed}
        onSpeedChange={changeSpeed}
        speedRange={speedRange}
        metrics={metrics}
      />
      <ComparisonCharts comparisonData={comparisonData} />
      <ScienceSection />
      <TrainComparison />
      <Footer />
    </div>
  )
}
