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

export type PerlinNoiseOptions = {
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

export { generatePerlinNoise } from './gpt4_contributions'
