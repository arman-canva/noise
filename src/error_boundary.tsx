import { Text } from '@canva/app-ui-kit'
import * as React from 'react'

export class ErrorBoundary extends React.Component<{}, { hasError: boolean }> {
  constructor(props: {}) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  override componentDidCatch(error: unknown) {
    console.error(error)
  }

  override render() {
    if (this.state.hasError) {
      return <Text>An unknown error occurred.</Text>
    }

    return this.props.children
  }
}
