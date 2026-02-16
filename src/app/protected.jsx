import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth.jsx"

export default function Protected() {
  const { user, ready } = useAuth()

  // wait until session resolved
  if (!ready) return null

  if (!user) return <Navigate to="/login" replace />

  return <Outlet />
}
