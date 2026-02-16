import { useAuth } from "../hooks/useAuth"
import { API } from "../api/client"
import { useNavigate } from "react-router-dom"

export default function Navbar() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  const logout = async () => {
    try {
      await API.post("/b1/auth/logout")
    } catch {}
    setUser(null)
    navigate("/login")
  }

  return (
    <div className="w-full border-b border-white/10 bg-[#0b0f19] px-6 py-4 flex items-center justify-between">
      
      {/* Left */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-indigo-400">
          RealPoll
        </h1>

        <button
          onClick={() => navigate("/create")}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm"
        >
          + Create Poll
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        <div className="text-right">
          <div className="text-sm font-medium">{user?.username}</div>
          <div className="text-xs text-gray-400">{user?.email}</div>
        </div>

        <button
          onClick={logout}
          className="text-sm text-red-400 hover:text-red-300"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
