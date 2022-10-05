export type Points = [number, number][]
interface Points2D { x: number; y: number }

const curve = 1 / 5

export function controlPoints(p: Points) {
  const pc: Points2D[][] = []

  for (let i = 1; i < p.length - 1; i++) {
    const dx = p[i - 1][0] - p[i + 1][0]
    const dy = p[i - 1][1] - p[i + 1][1]

    const x1 = p[i][0] - dx * curve
    const y1 = p[i][1] - dy * curve
    const o1: Points2D = {
      x: x1,
      y: y1
    }

    const x2 = p[i][0] + dx * curve
    const y2 = p[i][1] + dy * curve
    const o2: Points2D = {
      x: x2,
      y: y2
    }

    pc[i] = []
    pc[i].push(o1)
    pc[i].push(o2)
  }

  return pc
}

export function drawCurve(p: Points) {
  const pc = controlPoints(p)

  let d = ''
  d += `M${p[0][0]}, ${p[0][1]}`

  d += `Q${pc[1][1].x}, ${pc[1][1].y}, ${p[1][0]}, ${p[1][1]}`

  if (p.length > 2) {
    for (let i = 1; i < p.length - 2; i++)

      d += `C${pc[i][0].x}, ${pc[i][0].y} ${pc[i + 1][1].x},${pc[i + 1][1].y} ${p[i + 1][0]},${p[i + 1][1]}`

    const n = p.length - 1
    d += `Q${pc[n - 1][0].x}, ${pc[n - 1][0].y} ${p[n][0]},${p[n][1]}`
  }

  return d
}
