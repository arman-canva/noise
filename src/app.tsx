import { Button, Rows, Select } from '@canva/app-ui-kit'
import { addNativeElement } from '@canva/design'
import * as React from 'react'
import styles from 'styles/components.css'
import { ALGORITHMS, getAlgorithmByIndex, getIndexByAlgorithm, PERLIN } from './algorithm'
import { generatePerlinNoise, PerlinInputsForm } from './perlin'
import { useStore } from './store'
import { UnreachableError } from './unreachable_error'

export const App = () => {
  const store = useStore()

  // Inputs & generator for the selected algorithm.
  const { Inputs, generateTexture } = React.useMemo(() => {
    switch (store.algorithm) {
      case PERLIN:
        return {
          Inputs: PerlinInputsForm,
          generateTexture: generatePerlinNoise,
        }
      default:
        throw new UnreachableError(store.algorithm)
    }
  }, [store.algorithm, store.setTexture])

  const handleExport = async () => {
    // Adds the selected noise texture to the current design:

    if (store.texture == null) {
      return
    }

    store.setIsExporting(true)

    await addNativeElement({
      type: 'IMAGE',
      dataUrl: store.texture,
    })

    store.setIsExporting(false)
  }

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        {/* Preview: */}
        <img className={styles.previewImage} src={store.texture} />

        {/* Customize: */}
        <label htmlFor="algorithmSelect">Algorithm</label>
        <Select
          id="algorithmSelect"
          onChange={value => store.setAlgorithm(getAlgorithmByIndex(value))}
          options={ALGORITHMS.map((label, index) => ({ label, value: index }))}
          stretch
          value={getIndexByAlgorithm(store.algorithm)}
        />
        <Inputs
          onChange={values => {
            const texture = generateTexture(values)
            store.setTexture(texture)
          }}
        />

        {/* Export: */}
        <Button
          disabled={store.isExporting}
          onClick={handleExport}
          stretch
          variant="primary"
        >
          {store.isExporting ? 'Exporting ...' : 'Export ✨'}
        </Button>
      </Rows>
    </div>
  )
}
