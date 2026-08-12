import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getMe, loginUser, registerUser } from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('animal_guardian_token'))
  const [loading, setLoading] = useState(!!token)

  useEffect(() => {
    const loadUser = async () => {
      if (!token) return setLoading(false)
      try {
        const { user: userData } = await getMe(token)
        setUser(userData)
      } catch (error) {
        localStorage.removeItem('animal_guardian_token')
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [token])

  const login = async (credentials) => {
    const data = await loginUser(credentials)
    localStorage.setItem('animal_guardian_token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data
  }

  const register = async (payload) => {
    const data = await registerUser(payload)
    return data
  }

  const logout = () => {
    localStorage.removeItem('animal_guardian_token')
    setToken(null)
    setUser(null)
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
  }

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout, updateUser }),
    [user, token, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
