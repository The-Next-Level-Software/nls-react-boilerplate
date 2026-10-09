import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { getConfig } from '@/store/config.store'
import { applyTheme } from '@/theme/apply-theme'
import { currentResolvedMode } from '@/theme/use-theme'
import App from './App.tsx'
import './index.css'

// Apply the theme before the first render to avoid a flash of default colors.
applyTheme(getConfig(), currentResolvedMode())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
