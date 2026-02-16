import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar"
import { API } from "../../api/client"

export default function CreatePoll() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [advanced, setAdvanced] = useState(false)

  const [form, setForm] = useState({
    // REQUIRED
    question: "",
    options: ["", ""],
    visibility: "public",
    allow_change: true,
    anonymous: true,

    // OPTIONAL
    description: "",
    images: [],
    allow_custom_option: false,
    randomize_options: false,

    allowed_emails: "",

    max_votes_per_user: 1,
    hide_results_until_end: false,
    show_voters: false,
    unique_ip: false,
    unique_session: true,

    start_at: "",
    end_at: "",
    auto_close: false,
    show_live_results: true,

    share_type: "link"
    })

  // ---------- helpers ----------
  const update = (key, value) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const updateOption = (i, value) => {
    const copy = [...form.options]
    copy[i] = value
    update("options", copy)
  }

  const addOption = () =>
    update("options", [...form.options, ""])

  const removeOption = (i) =>
    update("options", form.options.filter((_, idx) => idx !== i))

  // ---------- submit ----------
  const submit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const payload = {
        // ---- required ----
        question: form.question,
        options: form.options.filter(o => o.trim() !== ""),
        visibility: form.visibility,
        allow_change: form.allow_change,
        anonymous: form.anonymous,

        // ---- optional only if provided ----
        ...(form.description && { description: form.description }),
        ...(form.allow_custom_option && { allow_custom_option: true }),
        ...(form.randomize_options && { randomize_options: true }),
        ...(form.allowed_emails && {
            allowed_emails: form.allowed_emails.split(",").map(e => e.trim())
        }),
        ...(form.max_votes_per_user !== 1 && { max_votes_per_user: Number(form.max_votes_per_user) }),
        ...(form.hide_results_until_end && { hide_results_until_end: true }),
        ...(form.show_voters && { show_voters: true }),
        ...(form.unique_ip && { unique_ip: true }),
        ...(form.unique_session === false && { unique_session: false }),
        ...(form.start_at && { start_at: form.start_at }),
        ...(form.end_at && { end_at: form.end_at }),
        ...(form.auto_close && { auto_close: true }),
        ...(form.show_live_results === false && { show_live_results: false }),
        ...(form.share_type !== "link" && { share_type: form.share_type })
        }


      const res = await API.post("/b1/poll", payload)

      navigate(`/poll/${res.data.poll_id}`)
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to create poll")
    } finally {
      setLoading(false)
    }
  }

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-[#0b0f19] text-white">
      <Navbar />

      <form onSubmit={submit} className="max-w-3xl mx-auto p-6 space-y-6">
        <h2 className="text-2xl font-semibold">Create Poll</h2>

        {error && (
          <div className="bg-red-500/10 text-red-400 p-3 rounded">
            {error}
          </div>
        )}

        <input
          placeholder="Question"
          value={form.question}
          onChange={e => update("question", e.target.value)}
          required
          className="w-full p-3 rounded bg-white/10 border border-white/10"
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e => update("description", e.target.value)}
          className="w-full p-3 rounded bg-white/10 border border-white/10"
        />

        {/* Options */}
        <div className="space-y-3">
          <h3 className="font-medium">Options</h3>

          {form.options.map((opt, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={opt}
                onChange={e => updateOption(i, e.target.value)}
                required
                className="flex-1 p-3 rounded bg-white/10 border border-white/10"
              />
              {form.options.length > 2 && (
                <button type="button" onClick={() => removeOption(i)}>✕</button>
              )}
            </div>
          ))}

          <button type="button" onClick={addOption} className="text-indigo-400">
            + Add option
          </button>
        </div>

        <button
          disabled={loading}
          className="w-full py-3 bg-indigo-600 rounded hover:bg-indigo-500"
        >
          {loading ? "Creating..." : "Create Poll"}
        </button>
        <button
        type="button"
        onClick={() => setAdvanced(!advanced)}
        className="text-indigo-400 text-sm"
        >
        {advanced ? "Hide advanced settings" : "Show advanced settings"}
        </button>

        {advanced && (
        <div className="space-y-6 border border-white/10 rounded-xl p-5 bg-white/5">

            <h3 className="font-semibold text-lg">Advanced Settings</h3>

            {/* Description */}
            <textarea
            placeholder="Description"
            value={form.description}
            onChange={e => update("description", e.target.value)}
            className="w-full p-3 rounded bg-white/10 border border-white/10"
            />

            {/* Visibility */}
            <select
            value={form.visibility}
            onChange={e => update("visibility", e.target.value)}
            className="w-full p-3 rounded bg-white/10 border border-white/10"
            >
            <option value="public">Public</option>
            <option value="authenticated">Authenticated users</option>
            <option value="whitelist">Email whitelist</option>
            <option value="link">Private link</option>
            </select>

            {form.visibility === "whitelist" && (
            <input
                placeholder="comma separated emails"
                value={form.allowed_emails}
                onChange={e => update("allowed_emails", e.target.value)}
                className="w-full p-3 rounded bg-white/10 border border-white/10"
            />
            )}

            {/* Toggles */}
            <div className="grid grid-cols-2 gap-3 text-sm">

            <label><input type="checkbox" checked={form.randomize_options}
                onChange={e=>update("randomize_options",e.target.checked)} /> Shuffle options</label>

            <label><input type="checkbox" checked={form.allow_custom_option}
                onChange={e=>update("allow_custom_option",e.target.checked)} /> Allow custom option</label>

            <label><input type="checkbox" checked={form.hide_results_until_end}
                onChange={e=>update("hide_results_until_end",e.target.checked)} /> Hide results until end</label>

            <label><input type="checkbox" checked={form.show_voters}
                onChange={e=>update("show_voters",e.target.checked)} /> Show voters</label>

            <label><input type="checkbox" checked={form.unique_ip}
                onChange={e=>update("unique_ip",e.target.checked)} /> Unique IP</label>

            <label><input type="checkbox" checked={form.auto_close}
                onChange={e=>update("auto_close",e.target.checked)} /> Auto close</label>

            </div>

            {/* Schedule */}
            <div className="grid grid-cols-2 gap-3">
            <input type="datetime-local"
                value={form.start_at}
                onChange={e=>update("start_at",e.target.value)}
                className="p-3 rounded bg-white/10 border border-white/10"/>

            <input type="datetime-local"
                value={form.end_at}
                onChange={e=>update("end_at",e.target.value)}
                className="p-3 rounded bg-white/10 border border-white/10"/>
            </div>

        </div>
        )}

      </form>
    </div>
  )
}
