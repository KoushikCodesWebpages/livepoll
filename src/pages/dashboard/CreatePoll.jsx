import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"


import { API } from "../../api/client"
import { useToast } from "../../components/ui/ToastProvider"
import { computeSchedule } from "../../components/poll/ScheduleSettings"

import QuestionCard from "../../components/poll/QuestionCard"
import OptionsEditor from "../../components/poll/OptionsEditor"
import BasicSettings from "../../components/poll/BasicSettings"
import ScheduleSettings from "../../components/poll/ScheduleSettings"
import AdvancedSettings from "../../components/poll/AdvancedSettings"
import SubmitBar from "../../components/poll/SubmitBar"



export default function CreatePoll() {

  const navigate = useNavigate()
  const toast = useToast()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [advanced, setAdvanced] = useState(false)

  const [form, setForm] = useState({
    question: "",
    options: ["", ""],
    visibility: "public",
    allow_change: true,
    anonymous: true,

    description: "",
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

  const submit = async () => {

  setError("")
  setLoading(true)

    try {

      // ---------- SCHEDULE ----------
      const schedule = computeSchedule(form)

      const payload = {
        // CONTENT
        question: form.question,
        options: form.options.filter(o => o.trim() !== ""),

        ...(form.description && { description: form.description }),
        ...(form.allow_custom_option && { allow_custom_option: true }),
        ...(form.randomize_options && { randomize_options: true }),

        // ACCESS
        visibility: form.visibility,
        ...(form.allowed_emails && {
          allowed_emails: form.allowed_emails.split(",").map(e => e.trim())
        }),

        // VOTING
        max_votes_per_user: Number(form.max_votes_per_user),
        allow_change: form.allow_change,
        anonymous: form.anonymous,
        hide_results_until_end: form.hide_results_until_end,
        show_voters: form.show_voters,
        unique_ip: form.unique_ip,
        unique_session: form.unique_session,

        // BEHAVIOR (UTC times here)
        start_at: schedule.start_at,
        end_at: schedule.expires_at,
        auto_close: form.auto_close,
        show_live_results: form.show_live_results,

        // DISTRIBUTION
        share_type: form.share_type
      }

      const res = await API.post("/b1/poll/create", payload)

      toast.show("Poll created successfully 🎉")
      setTimeout(() => navigate("/home"), 700)

    } catch (err) {
      setError(err?.response?.data?.error || "Failed to create poll")
    } finally {
      setLoading(false)
    }
  }


  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-[#0b0f19] text-white">


      {/* BACK */}
      <div className="max-w-3xl mx-auto px-6 pt-6">
        <button
          onClick={() => navigate("/home", { replace: true })}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-28 space-y-6">

        <h2 className="text-2xl font-semibold">Create Poll</h2>

        {error && (
          <div className="bg-red-500/10 text-red-400 p-3 rounded">
            {error}
          </div>
        )}

        <QuestionCard form={form} update={update} />

        <OptionsEditor
          form={form}
          updateOption={updateOption}
          addOption={addOption}
          removeOption={removeOption}
        />

        <BasicSettings form={form} update={update} />

        <button
          type="button"
          onClick={() => setAdvanced(!advanced)}
          className="text-indigo-400 text-sm hover:text-indigo-300 transition"
        >
          {advanced ? "Hide advanced settings" : "Show advanced settings"}
        </button>

        <AdvancedSettings form={form} update={update} advanced={advanced} />

        {/* ---------------- SCHEDULE (REUSED) ---------------- */}
        <ScheduleSettings form={form} update={update} />

      </div>

      <SubmitBar loading={loading} submit={submit} />

    </div>
  )
}
