import { Button, Rows, Text } from '@canva/app-ui-kit'
import { addNativeElement } from '@canva/design'
import * as React from 'react'
import styles from 'styles/components.css'

export const App = () => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)

  const exportNoiseTexture = () => {
    console.log(`TODO: Add the noise texture to the user's design.`)
  }

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        {/* Preview. */}
        <canvas ref={canvasRef} />

        {/* Fields for customising noises. */}

        {/* Export. */}
        <Button variant="primary" onClick={exportNoiseTexture} stretch>
          Export ✨
        </Button>
      </Rows>
    </div>
  )
}
