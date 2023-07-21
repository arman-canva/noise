import { Button, Rows, Select, Text } from '@canva/app-ui-kit'
import { addNativeElement } from '@canva/design'
import * as React from 'react'
import styles from 'styles/components.css'
import { create } from 'zustand'

const ALGORITHMS = [
  'Perlin',
] as const

type Algorithm = (typeof ALGORITHMS)[number]

type Store = {
  selectedAlgorithm: Algorithm
  setSelectedAlgorithm: (algorithm: Algorithm) => void
}

const getAlgorithmByIndex = (index: number) => ALGORITHMS[index]
const getIndexByAlgorithm = (algo: Algorithm) => ALGORITHMS.findIndex(rithm => algo === rithm)

const useStore = create<Store>()(set => ({
  selectedAlgorithm: ALGORITHMS[0],
  setSelectedAlgorithm: algorithm => set({ selectedAlgorithm: algorithm }),
}))

export const App = () => {
  const store = useStore()
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)

  //

  const exportNoiseTexture = () => {
    console.log(`TODO: Add the noise texture to the user's design.`)
  }

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        {/* Preview. */}
        <canvas ref={canvasRef} />

        {/* Fields for customising noises. */}
        <Text>Algorithm</Text>
        <Select
          onChange={value => store.setSelectedAlgorithm(getAlgorithmByIndex(value))}
          options={ALGORITHMS.map((label, index) => ({ label, value: index }))}
          stretch
          value={getIndexByAlgorithm(store.selectedAlgorithm)}
        />

        {/* Export. */}
        <Button variant="primary" onClick={exportNoiseTexture} stretch>
          Export ✨
        </Button>
      </Rows>
    </div>
  )
}
