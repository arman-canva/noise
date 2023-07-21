import { NumberInput } from '@canva/app-ui-kit'
import { makeNoise2D } from 'open-simplex-noise'
import * as React from 'react'
import { create } from 'zustand'
import { Texture } from './store'

type Store = {
  height: number
  setHeight: (height: number) => void
  seed: number
  setSeed: (seed: number) => void
  width: number
  setWidth: (width: number) => void
}

export type OpenSimplexNoiseOptions = {
  height: number
  seed: number
  width: number
}

const useStore = create<Store>()(set => ({
  height: 200,
  setHeight: height => set({ height }),
  seed: Date.now(),
  setSeed: seed => set({ seed }),
  width: 200,
  setWidth: width => set({ width }),
}))

type Props = {
  onChange: (values: {
    height: number
    seed: number
    width: number
  }) => void
}

export const OpenSimplexInputsForm: React.ComponentType<Props> = props => {
  const store = useStore()

  React.useEffect(() => {
    props.onChange({
      height: store.height,
      seed: store.seed,
      width: store.width,
    })
  }, [store.height, store.seed, store.width])

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

      <label>Seed</label>
      <NumberInput
        min={1}
        onChange={value => {
          if (value == null) {
            return
          }
          store.setSeed(value)
        }}
        value={store.seed}
      />
    </>
  )
}

export const generateOpenSimplexNoise = (options: OpenSimplexNoiseOptions): Texture => {
  const {
    height,
    seed,
    width,
  } = options

  const canvas = document.createElement('canvas')
  canvas.height = height
  canvas.width = width

  const context = canvas.getContext('2d')
  if (context == null) {
    throw new Error('Expected `context` to be defined.')
  }

  const imageData = context.createImageData(width, height)
  const noise2D = makeNoise2D(seed)

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const i = (x + y * width) * 4
      const value = (noise2D(x, y) + 1) * 128
      imageData.data[i] = value
      imageData.data[i + 1] = value
      imageData.data[i + 2] = value
      imageData.data[i + 3] = 255
    }
  }

  context.putImageData(imageData, 0, 0)

  return {
    dataUrl: canvas.toDataURL(),
    height,
    width,
  }
}
