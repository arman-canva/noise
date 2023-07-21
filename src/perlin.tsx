import { NumberInput } from '@canva/app-ui-kit'
import * as React from 'react'
import { create } from 'zustand'

type Store = {
  amplitude: number
  setAmplitude: (amplitude: number) => void
  frequency: number
  setFrequency: (frequency: number) => void
  height: number
  setHeight: (height: number) => void
  octaves: number
  setOctaves: (octaves: number) => void
  width: number
  setWidth: (width: number) => void
}

type PerlinNoiseOptions = {
  amplitude: number
  frequency: number
  height: number
  octaves: number
  width: number
}

const useStore = create<Store>()(set => ({
  amplitude: 1,
  setAmplitude: amplitude => set({ amplitude }),
  frequency: 20,
  setFrequency: frequency => set({ frequency }),
  height: 500,
  setHeight: height => set({ height }),
  octaves: 1,
  setOctaves: octaves => set({ octaves }),
  width: 500,
  setWidth: width => set({ width }),
}))

type Props = {
  onChange: (values: {
    amplitude: number
    frequency: number
    height: number
    octaves: number
    width: number
  }) => void
}

export const PerlinInputsForm: React.ComponentType<Props> = props => {
  const store = useStore()

  React.useEffect(() => {
    props.onChange({
      amplitude: store.amplitude,
      frequency: store.frequency,
      height: store.height,
      octaves: store.octaves,
      width: store.width,
    })
  }, [store.amplitude, store.frequency, store.height, store.octaves, store.width])

  // TODO: Render fields.
  return (
    <>
      <label>Height</label>
      <NumberInput
        defaultValue={300}
        min={1}
        onChange={value => {
          if (value == null) {
            return
          }
          store.setHeight(value)
        }}
        value={store.height}
      />

      <label>Width</label>
      <NumberInput
        defaultValue={300}
        min={1}
        onChange={value => {
          if (value == null) {
            return
          }
          store.setWidth(value)
        }}
        value={store.width}
      />

      <label>Octaves</label>
      <NumberInput
        min={1}
        onChange={value => {
          if (value == null) {
            return
          }
          store.setOctaves(value)
        }}
        value={store.octaves}
      />

      <label>Frequency</label>
      <NumberInput
        min={1}
        onChange={value => {
          if (value == null) {
            return
          }
          store.setFrequency(value)
        }}
        value={store.frequency}
      />

      <label>Amplitude</label>
      <NumberInput
        min={1}
        onChange={value => {
          if (value == null) {
            return
          }
          store.setAmplitude(value)
        }}
        value={store.amplitude}
      />
    </>
  )
}

export const generatePerlinNoise = (options: PerlinNoiseOptions): string => {
  const {
    height,
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
        amplitude: options.amplitude,
        frequency: options.frequency,
        octaves: options.octaves,
      }) + 1) / 2

      const index = (x + y * width) * 4
      imageData.data[index] = noise * 255
      imageData.data[index + 1] = noise * 255
      imageData.data[index + 2] = noise * 255
      imageData.data[index + 3] = 255
    }
  }

  context.putImageData(imageData, 0, 0)

  return canvas.toDataURL()
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
    let maxValue = 0 // Used for normalizing result to 0.0 - 1.0

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
