// Contributions from GPT4:

import { PerlinNoiseOptions } from './perlin'
import { Texture } from './store'

export const generateOpenSimplexNoise = (
  options: { height: number; width: number; seed: number },
) => {
  const {
    height,
    width,
    seed,
  } = options

  const canvas = document.createElement('canvas')
  canvas.height = height
  canvas.width = width

  const context = canvas.getContext('2d')
  if (context == null) {
    throw new Error(`Expected context to be defined. Received: ${context}.`)
  }

  const imageData = context.createImageData(width, height)
  const simplex = new OpenSimplexNoise(0.5)

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const noise = simplex.noise(x / 100, y / 100, 0)

      const index = (x + y * width) * 4
      imageData.data[index] = (noise + 1) / 2 * 255
      imageData.data[index + 1] = (noise + 1) / 2 * 255
      imageData.data[index + 2] = (noise + 1) / 2 * 255
      imageData.data[index + 3] = 255
    }
  }

  context.putImageData(imageData, 0, 0)

  return canvas.toDataURL()
}

export const generatePerlinNoise = (options: PerlinNoiseOptions): Texture => {
  const {
    amplitude,
    frequency,
    height,
    octaves,
    width,
  } = options

  const canvas = document.createElement('canvas')
  canvas.height = height
  canvas.width = width

  const context = canvas.getContext('2d')
  if (context == null) {
    throw new Error(`Expected context to be defined. Received: ${context}.`)
  }

  const imageData = context.createImageData(width, height)

  const perlin = new PerlinNoise()

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const noise = (perlin.noise({
        x: x / 100,
        y: y / 100,
        amplitude,
        frequency,
        octaves,
      }) + 1) / 2

      const index = (x + y * width) * 4
      imageData.data[index] = noise * 255
      imageData.data[index + 1] = noise * 255
      imageData.data[index + 2] = noise * 255
      imageData.data[index + 3] = 255
    }
  }

  context.putImageData(imageData, 0, 0)

  return {
    dataUrl: canvas.toDataURL(),
    height,
    width,
  }
}

export class OpenSimplexNoise {
  private readonly grad3 = [
    [1, 1, 0],
    [-1, 1, 0],
    [1, -1, 0],
    [-1, -1, 0],
    [1, 0, 1],
    [-1, 0, 1],
    [1, 0, -1],
    [-1, 0, -1],
    [0, 1, 1],
    [0, -1, 1],
    [0, 1, -1],
    [0, -1, -1],
  ]
  private p: Array<number>
  private perm: Array<number>

  constructor(seed: number) {
    this.p = new Array(256)
    this.perm = new Array(512)
    for (let i = 0; i < 256; i++) {
      this.p[i] = Math.floor((seed * 16807) % 2147483647)
      seed = this.p[i]
    }
    for (let i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255]
    }
  }

  dot(g: Array<number>, x: number, y: number, z: number) {
    return g[0] * x + g[1] * y + g[2] * z
  }

  mix(a: number, b: number, t: number) {
    return (1.0 - t) * a + t * b
  }

  fade(t: number) {
    return t * t * t * (t * (t * 6 - 15) + 10)
  }

  noise(x: number, y: number, z: number) {
    let X = Math.floor(x)
    let Y = Math.floor(y)
    let Z = Math.floor(z)
    x = x - X
    y = y - Y
    z = z - Z
    X = X & 255
    Y = Y & 255
    Z = Z & 255
    const gi000 = this.perm[X + this.perm[Y + this.perm[Z]]] % 12
    const gi001 = this.perm[X + this.perm[Y + this.perm[Z + 1]]] % 12
    const gi010 = this.perm[X + this.perm[Y + 1 + this.perm[Z]]] % 12
    const gi011 = this.perm[X + this.perm[Y + 1 + this.perm[Z + 1]]] % 12
    const gi100 = this.perm[X + 1 + this.perm[Y + this.perm[Z]]] % 12
    const gi101 = this.perm[X + 1 + this.perm[Y + this.perm[Z + 1]]] % 12
    const gi110 = this.perm[X + 1 + this.perm[Y + 1 + this.perm[Z]]] % 12
    const gi111 = this.perm[X + 1 + this.perm[Y + 1 + this.perm[Z + 1]]] % 12
    const n000 = this.dot(this.grad3[gi000], x, y, z)
    const n100 = this.dot(this.grad3[gi100], x - 1, y, z)
    const n010 = this.dot(this.grad3[gi010], x, y - 1, z)
    const n110 = this.dot(this.grad3[gi110], x - 1, y - 1, z)
    const n001 = this.dot(this.grad3[gi001], x, y, z - 1)
    const n101 = this.dot(this.grad3[gi101], x - 1, y, z - 1)
    const n011 = this.dot(this.grad3[gi011], x, y - 1, z - 1)
    const n111 = this.dot(this.grad3[gi111], x - 1, y - 1, z - 1)
    const u = this.fade(x)
    const v = this.fade(y)
    const w = this.fade(z)
    const nx00 = this.mix(n000, n100, u)
    const nx01 = this.mix(n001, n101, u)
    const nx10 = this.mix(n010, n110, u)
    const nx11 = this.mix(n011, n111, u)
    const nxy0 = this.mix(nx00, nx10, v)
    const nxy1 = this.mix(nx01, nx11, v)
    const nxyz = this.mix(nxy0, nxy1, w)
    return nxyz
  }
}

class PerlinNoise {
  private grid: { x: number; y: number }[][]

  constructor() {
    const size = 256
    this.grid = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => ({
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
      })))
  }

  dotGridGradient(ix: number, iy: number, x: number, y: number) {
    const dx = x - ix
    const dy = y - iy

    // Here we use modulo division to make sure ix and iy are within the grid's bounds
    const gridX = ix % this.grid.length
    const gridY = iy % this.grid.length

    return (dx * this.grid[gridY][gridX].x) + (dy * this.grid[gridY][gridX].y)
  }

  interpolate(pa: number, pb: number, px: number) {
    const wt = px * px * (3 - 2 * px)
    return pa + wt * (pb - pa)
  }

  noise({
    x,
    y,
    octaves,
    frequency,
    amplitude,
  }: { x: number; y: number; octaves: number; frequency: number; amplitude: number }) {
    const persistence = 1
    let total = 0
    let maxValue = 0 // Used to normalize results to 0.0 - 1.0

    for (let i = 0; i < octaves; i++) {
      total += this.singleNoise(x * frequency, y * frequency) * amplitude

      maxValue += amplitude

      amplitude *= persistence
      frequency *= 2
    }

    return total / maxValue
  }

  singleNoise(x: number, y: number) {
    const x0 = Math.floor(x)
    const x1 = x0 + 1
    const y0 = Math.floor(y)
    const y1 = y0 + 1

    const sx = x - x0
    const sy = y - y0

    const n0 = this.dotGridGradient(x0, y0, x, y)
    const n1 = this.dotGridGradient(x1, y0, x, y)
    const ix0 = this.interpolate(n0, n1, sx)

    const n0b = this.dotGridGradient(x0, y1, x, y)
    const n1b = this.dotGridGradient(x1, y1, x, y)
    const ix1 = this.interpolate(n0b, n1b, sx)

    return this.interpolate(ix0, ix1, sy)
  }
}
