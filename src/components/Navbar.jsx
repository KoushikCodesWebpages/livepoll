import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { API } from "../api/client"
import { useNavigate } from "react-router-dom"
import { Plus, LogOut, Menu } from "lucide-react"

export default function Navbar() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const logout = async () => {
    try {
      await API.post("/b1/auth/logout")
    } catch {}
    setUser(null)
    navigate("/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0b0f19]/80 backdrop-blur-md">

      <div className="h-16 px-4 md:px-8 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-3 md:gap-6">
          <h1
            onClick={() => navigate("/home")}
            className="text-lg md:text-xl font-semibold text-indigo-400 cursor-pointer"
          >
            RealPoll
          </h1>

          {/* DESKTOP CREATE BUTTON */}
          <button
            onClick={() => navigate("/create")}
            className="hidden md:block px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium"
          >
            + Create Poll
          </button>

          {/* MOBILE CREATE ICON */}
          <button
            onClick={() => navigate("/create")}
            className="md:hidden p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* RIGHT DESKTOP */}
        <div className="hidden md:flex items-center gap-6">
          <div className="text-right leading-tight max-w-[160px] truncate">
            <div className="text-sm font-medium truncate">{user?.username}</div>
            <div className="text-xs text-gray-400 truncate">{user?.email}</div>
          </div>

          <button
            onClick={logout}
            className="text-sm text-red-400 hover:text-red-300"
          >
            Logout
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg bg-white/10"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#0b0f19] px-4 py-4 space-y-4">

          <div className="text-sm">
            <div className="font-medium">{user?.username}</div>
            <div className="text-xs text-gray-400">{user?.email}</div>
          </div>


          <button
            onClick={logout}
            className="w-full py-2 text-red-400 border border-red-400/30 rounded-lg flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </button>

        </div>
      )}

    </header>
  )
}
