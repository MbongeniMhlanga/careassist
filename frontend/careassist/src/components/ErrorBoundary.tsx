import type { ErrorInfo, ReactNode } from 'react'
import { Component } from 'react'

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    message: '',
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message,
    }
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('CareAssist render error', error, info)
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', padding: '32px', fontFamily: 'system-ui, sans-serif' }}>
          <h1>CareAssist could not load</h1>
          <p>The app hit a runtime error instead of rendering the dashboard.</p>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              background: '#f4f4f4',
              padding: '16px',
              borderRadius: '12px',
              overflowX: 'auto',
            }}
          >
            {this.state.message || 'Unknown error'}
          </pre>
        </div>
      )
    }

    return this.props.children
  }
}
