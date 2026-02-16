import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth.jsx"

export default function Protected() {
const { user, loading } = useAuth()

if (loading) return <div className="p-10">Loading...</div>
if (!user) return <Navigate to="/login" replace />

return <Outlet />
}
