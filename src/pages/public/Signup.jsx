import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../../api/client";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const goBack = () => {
    navigate("/", { replace: true });
  };

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await API.post("/b1/auth/register", form);
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Registration failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] text-white px-4 relative">
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
        <h2 className="text-3xl font-semibold text-center">Create Account</h2>

        {error && (
          <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="text-green-400 text-sm bg-green-500/10 p-3 rounded-lg">
            {success}
          </div>
        )}

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 focus:outline-none focus:border-indigo-500"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
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
          minLength={6}
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 focus:outline-none focus:border-indigo-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
