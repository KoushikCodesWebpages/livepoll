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
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0b0f19]/80 backdrop-blur-md shadow-sm">

      <div className="w-full h-16 px-8 lg:px-12 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-6">
          <h1
            onClick={() => navigate("/home")}
            className="text-xl font-semibold text-indigo-400 cursor-pointer"
          >
            RealPoll
          </h1>

          <button
            onClick={() => navigate("/create")}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium"
          >
            + Create Poll
          </button>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-6">
          <div className="text-right leading-tight">
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
    </header>
  )
}
