import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Presentation from './components/Presentation'
import './index.css'

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
    <Router />
  </React.StrictMode>,
)