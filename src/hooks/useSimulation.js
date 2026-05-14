import { useState, useCallback, useMemo } from 'react'
import { BIRDS, BIRD_IDS, SPEED_RANGE, generateComparisonData } from '../data/mockData'
import { getMetricsForBird } from '../utils/calculations'

export function useSimulation() {
  const [selectedBird, setSelectedBird] = useState('kingfisher')
  const [speed, setSpeed] = useState(SPEED_RANGE.default)
  const [isSimulating, setIsSimulating] = useState(false)

  const birdData = useMemo(() => BIRDS[selectedBird], [selectedBird])

  const metrics = useMemo(
    () => getMetricsForBird(selectedBird, speed),
    [selectedBird, speed],
  )

  const comparisonData = useMemo(() => generateComparisonData(speed), [speed])

  const selectBird = useCallback((birdId) => {
    if (BIRDS[birdId]) {
      setSelectedBird(birdId)
    }
  }, [])

  const changeSpeed = useCallback((newSpeed) => {
    setSpeed(Math.min(SPEED_RANGE.max, Math.max(SPEED_RANGE.min, newSpeed)))
  }, [])

  const startSimulation = useCallback(() => {
    setIsSimulating(true)
  }, [])

  const stopSimulation = useCallback(() => {
    setIsSimulating(false)
  }, [])

  return {
    selectedBird,
    birdData,
    speed,
    isSimulating,
    metrics,
    comparisonData,
    selectBird,
    changeSpeed,
    startSimulation,
    stopSimulation,
    birdList: BIRD_IDS.map((id) => ({ id, ...BIRDS[id] })),
    speedRange: SPEED_RANGE,
  }
}
