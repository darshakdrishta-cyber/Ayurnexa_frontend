import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { logError } from './utils/errorLog'

window.addEventListener('error', (event) => {
  logError({
    type: 'window',
    method: 'ERROR',
    url: event.filename || window.location.href,
    status: 0,
    message: event.message || 'Unhandled error',
    data: event.error ? { stack: event.error.stack } : null,
  })
})

window.addEventListener('unhandledrejection', (event) => {
  logError({
    type: 'promise',
    method: 'UNHANDLED',
    url: window.location.href,
    status: 0,
    message: event.reason?.message || String(event.reason || 'Unhandled promise rejection'),
    data: event.reason?.stack ? { stack: event.reason.stack } : null,
  })
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
