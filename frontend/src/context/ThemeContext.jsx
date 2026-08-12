import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ThemeContext = createContext(null)
const STORAGE_KEY = 'animal_guardian_theme'
const themes = ['light', 'dark', 'system']

const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored && themes.includes(stored)) return stored
  return 'system'
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement
      const resolved = theme === 'system' ? getSystemTheme() : theme
      root.classList.toggle('dark', resolved === 'dark')
      root.dataset.theme = theme
      window.localStorage.setItem(STORAGE_KEY, theme)
    }

    applyTheme()
    setMounted(true)

    const listener = (event) => {
      if (theme === 'system') {
        const system = event.matches ? 'dark' : 'light'
        document.documentElement.classList.toggle('dark', system === 'dark')
      }
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', listener)
    return () => mediaQuery.removeEventListener('change', listener)
  }, [theme])

  const value = useMemo(
    () => ({ theme, setTheme, mounted, themes }),
    [theme, mounted],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
