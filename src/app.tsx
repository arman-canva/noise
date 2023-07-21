import { Button, Rows, Select, Text } from '@canva/app-ui-kit'
import { addNativeElement } from '@canva/design'
import * as React from 'react'
import styles from 'styles/components.css'
import {
  ALGORITHMS,
  getAlgorithmByIndex,
  getIndexByAlgorithm,
  OPEN_SIMPLEX,
  PERLIN,
} from './algorithm'
import { ErrorBoundary } from './error_boundary'
import { generateOpenSimplexNoise, OpenSimplexInputsForm } from './open_simplex'
import { generatePerlinNoise, PerlinInputsForm } from './perlin'
import { useStore } from './store'
import { UnreachableError } from './unreachable_error'

export const App = () => {
  const store = useStore()

  const { Inputs, generateTexture } = React.useMemo(() => {
    switch (store.algorithm) {
      case OPEN_SIMPLEX:
        return {
          Inputs: OpenSimplexInputsForm,
          generateTexture: generateOpenSimplexNoise,
        }
      case PERLIN:
        return {
          Inputs: PerlinInputsForm,
          generateTexture: generatePerlinNoise,
        }
      default:
        throw new UnreachableError(store.algorithm)
    }
  }, [store.algorithm, store.setTexture])

  const addTextureToDesign = async () => {
    if (store.texture == null) {
      return
    }

    store.setIsExporting(true)

    await addNativeElement({
      type: 'IMAGE',
      dataUrl: store.texture.dataUrl,
      top: 0,
      left: 0,
      height: store.texture.height,
      width: store.texture.width,
    })

    store.setIsExporting(false)
  }

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <ErrorBoundary>
          {/* Preview: */}
          <img className={styles.previewImage} src={store.texture?.dataUrl} />

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
            onClick={addTextureToDesign}
            stretch
            variant="primary"
          >
            {store.isExporting ? 'Exporting ...' : 'Export ✨'}
          </Button>
        </ErrorBoundary>
      </Rows>
    </div>
  )
}
