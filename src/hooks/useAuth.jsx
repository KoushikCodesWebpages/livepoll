import { createContext, useContext, useEffect, useState } from "react"
import { API } from "../api/client"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false) // <- important

  useEffect(() => {
    let mounted = true

    const restore = async () => {
      try {
        const res = await API.get("/b1/auth/session")
        if (mounted) setUser(res.data)
      } catch {
        if (mounted) setUser(null)
      } finally {
        if (mounted) setReady(true)
      }
    }

    restore()

    return () => { mounted = false }
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, ready }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
