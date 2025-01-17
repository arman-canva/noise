import { AppUiProvider } from '@canva/app-ui-kit'
import '@canva/app-ui-kit/styles.css'
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app'

const root = createRoot(document.getElementById('root')!)
function render() {
  root.render(
    <AppUiProvider>
      <App />
    </AppUiProvider>,
  )
}

render()

if (module.hot) {
  module.hot.accept('./app', render)
}
