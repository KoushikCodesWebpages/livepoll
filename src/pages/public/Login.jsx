import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { API } from "../../api/client"
import { useAuth } from "../../hooks/useAuth.jsx"

export default function Login() {
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // 👈 back to landing always
  const goBack = () => {
    navigate("/", { replace: true })
  }

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await API.post("/b1/auth/login", form)
      const res = await API.get("/b1/auth/session")
      setUser(res.data)
      navigate("/home", { replace: true })

    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Invalid credentials"

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] text-white px-4 relative">

      {/* BACK BUTTON */}
      <button
        onClick={goBack}
        className="absolute top-6 left-6 px-3 py-1.5 text-sm rounded-lg bg-white/10 hover:bg-white/20 border border-white/10"
      >
        ← Back
      </button>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6"
      >
        <h2 className="text-3xl font-semibold text-center">Login</h2>

        {error && (
          <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">
            {error}
          </div>
        )}

        <input
          name="identifier"
          placeholder="Email or Username"
          value={form.identifier}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 focus:outline-none focus:border-indigo-500"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 focus:outline-none focus:border-indigo-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-400 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}
