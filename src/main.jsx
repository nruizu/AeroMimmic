import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Presentation from './components/Presentation'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null, info: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  componentDidCatch(error, info) {
    console.error('App crashed:', error, info)
    this.setState({ info })
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#0a0a1a',
          color: '#fff',
          padding: '40px',
          fontFamily: 'monospace',
          fontSize: '13px',
          lineHeight: 1.6,
        }}>
          <h1 style={{ color: '#ef476f', fontSize: 22, marginBottom: 12 }}>
            Error en runtime React
          </h1>
          <pre style={{ color: '#ffd166', whiteSpace: 'pre-wrap', marginBottom: 18 }}>
            {String(this.state.error?.stack || this.state.error)}
          </pre>
          {this.state.info?.componentStack && (
            <pre style={{ color: '#48cae4', whiteSpace: 'pre-wrap', fontSize: 11 }}>
              {this.state.info.componentStack}
            </pre>
          )}
        </div>
      )
    }
    return this.props.children
  }
}

function Router() {
  const getRoute = () => window.location.hash.slice(1) || window.location.pathname || '/'
  const [route, setRoute] = useState(getRoute())

  useEffect(() => {
    const handleRouteChange = () => {
      setRoute(getRoute())
    }
    window.addEventListener('hashchange', handleRouteChange)
    window.addEventListener('popstate', handleRouteChange)
    return () => {
      window.removeEventListener('hashchange', handleRouteChange)
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  if (route === '/presentacion' || route === '/presentation') {
    return <Presentation />
  }

  return <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Router />
    </ErrorBoundary>
  </React.StrictMode>,
)
