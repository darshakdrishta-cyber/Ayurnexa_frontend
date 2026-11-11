import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('gold')

  useEffect(() => {
    const stored = localStorage.getItem('Ayurnexaa_theme')
    const initial = stored === 'green' ? 'green' : 'gold'
    setTheme(initial)
    document.documentElement.setAttribute('data-theme', initial)
  }, [])

  const toggle = () => {
    const next = theme === 'gold' ? 'green' : 'gold'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('Ayurnexaa_theme', next)
  }

  const value = { theme, toggle }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
