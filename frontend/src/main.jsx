import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WithPortfolioConfig } from './context/PortfolioConfigProvider'
import './styles/index.css'
import App from './App.jsx'

const AppWithConfig = WithPortfolioConfig(App)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppWithConfig />
  </StrictMode>,
)
