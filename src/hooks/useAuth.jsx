import { createContext, useContext, useEffect, useState } from "react"
import { API } from "../api/client"

const AuthContext = createContext()

export function AuthProvider({ children }) {
const [user, setUser] = useState(null)
const [loading, setLoading] = useState(true)

const fetchMe = async () => {
try {
const res = await API.get("/b1/auth/session")
setUser(res.data)
} catch {
setUser(null)
} finally {
setLoading(false)
}
}

useEffect(() => {
fetchMe()
}, [])

return (
<AuthContext.Provider 
value={{ user, setUser, loading }}>
{children}
</AuthContext.Provider>
)
}

export function useAuth() {
return useContext(AuthContext)
}
