import { BIRDS } from '../data/mockData'

export function calculateDrag(birdId, speed) {
  const bird = BIRDS[birdId]
  if (!bird) return 0
  const baseDrag = bird.dragCoefficient
  const speedRatio = speed / 240
  return baseDrag * Math.pow(speedRatio, 1.8)
}

export function calculateEfficiency(birdId, speed) {
  const bird = BIRDS[birdId]
  if (!bird) return 0
  const baseEff = bird.efficiency
  const speedRatio = speed / 240
  return Math.max(10, baseEff - 8 * (speedRatio - 1))
}

export function calculateNoise(birdId, speed) {
  const bird = BIRDS[birdId]
  if (!bird) return 0
  const baseNoise = bird.noiseLevel
  const speedRatio = speed / 240
  return baseNoise * Math.pow(speedRatio, 1.5)
}

export function calculateStability(birdId, speed) {
  const bird = BIRDS[birdId]
  if (!bird) return 0
  const baseStab = bird.flowStability
  const speedRatio = speed / 240
  return Math.max(5, baseStab - 10 * (speedRatio - 1))
}

export function getMetricsForBird(birdId, speed) {
  return {
    drag: calculateDrag(birdId, speed),
    efficiency: calculateEfficiency(birdId, speed),
    noise: calculateNoise(birdId, speed),
    stability: calculateStability(birdId, speed),
  }
}

export function interpolateBeakProfile(profile, targetProfile, t) {
  const len = Math.max(profile.length, targetProfile.length)
  const result = []
  for (let i = 0; i < len; i++) {
    const p1 = profile[Math.min(i, profile.length - 1)] || profile[profile.length - 1]
    const p2 = targetProfile[Math.min(i, targetProfile.length - 1)] || targetProfile[targetProfile.length - 1]
    result.push([
      p1[0] + (p2[0] - p1[0]) * t,
      p1[1] + (p2[1] - p1[1]) * t,
    ])
  }
  return result
}

export function generateFlowControlPoints(birdId, numLines = 8) {
  const bird = BIRDS[birdId]
  if (!bird) return []
  const profile = bird.beakProfile
  const turb = bird.turbulenceFactor
  const lines = []
  for (let i = 0; i < numLines; i++) {
    const t = (i + 1) / (numLines + 1)
    const yStart = 0.05 + t * 1.2
    const pts = []
    for (let x = -3.5; x <= 3.5; x += 0.15) {
      let y = yStart
      let inBeak = false
      for (const [bx, by] of profile) {
        const dist = Math.abs(x - bx)
        if (dist < 0.5) {
          const influence = Math.max(0, 1 - dist / 0.5)
          const deflection = by * 3.0 * influence
          if (y < deflection * 2) {
            y = deflection * 2 + 0.05 + turb * 0.2 * influence
            inBeak = true
          }
        }
      }
      if (!inBeak && x > -0.5 && x < 2.5) {
        y += turb * 0.15 * Math.sin(x * 4) * Math.max(0, 1 - Math.abs(x - 1) / 2)
      }
      pts.push({ x, y: Math.max(y, 0.02), z: 0 })
    }
    lines.push(pts)
  }
  return lines
}

export function curveLength(pts) {
  let len = 0
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x
    const dy = pts[i].y - pts[i - 1].y
    const dz = pts[i].z - pts[i - 1].z
    len += Math.sqrt(dx * dx + dy * dy + dz * dz)
  }
  return len
}
