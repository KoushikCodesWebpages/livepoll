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

  // ---- minimal defaults only ----
  const [form, setForm] = useState({
    question: "",
    options: ["", ""],

    visibility: "public",

    start_mode: "now",
    start_value: 1,
    start_date: "",

    end_mode: "hours",
    end_value: 1,
    end_date: "",

    show_live_results: false,

    allow_change: true,
    anonymous: true,
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


  // ================= VALIDATION =================
  const validate = () => {

    if (!form.question || form.question.trim().length < 5)
      return "Question must be at least 5 characters"

    const validOptions = form.options.filter(o => o.trim() !== "")
    if (validOptions.length < 2)
      return "At least 2 options required"

    const schedule = computeSchedule(form)
    if (new Date(schedule.expires_at) <= new Date(schedule.start_at))
      return "End time must be after start time"

    return null
  }


  // ================= SUBMIT =================
  const submit = async () => {

    setError("")

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {

      const schedule = computeSchedule(form)

      // ---- minimal payload ----
      const payload = {
        question: form.question.trim(),
        options: form.options.filter(o => o.trim() !== ""),
        visibility: form.visibility,
        start_at: schedule.start_at,
        end_at: schedule.expires_at,
        show_live_results: form.show_live_results,
      }

      // ---- optional fields only if user used them ----
      if (form.description)
        payload.description = form.description

      if (form.allowed_emails?.trim())
        payload.allowed_emails = form.allowed_emails.split(",").map(e => e.trim())

      if (form.allow_change !== undefined)
        payload.allow_change = form.allow_change

      if (form.anonymous !== undefined)
        payload.anonymous = form.anonymous

      // advanced (send only if advanced panel opened)
      if (advanced) {

        if (form.allow_custom_option !== undefined)
          payload.allow_custom_option = form.allow_custom_option

        if (form.randomize_options !== undefined)
          payload.randomize_options = form.randomize_options

        if (form.hide_results_until_end !== undefined)
          payload.hide_results_until_end = form.hide_results_until_end

        if (form.show_voters !== undefined)
          payload.show_voters = form.show_voters

        if (form.unique_ip !== undefined)
          payload.unique_ip = form.unique_ip

        if (form.unique_session !== undefined)
          payload.unique_session = form.unique_session

        if (form.auto_close !== undefined)
          payload.auto_close = form.auto_close
      }

      console.log("CREATE PAYLOAD", payload)

      await API.post("/b1/poll/create", payload)

      toast.show("Poll created successfully 🎉")
      setTimeout(() => navigate("/home"), 700)

    } catch (err) {
      setError(err?.response?.data?.issue || "Failed to create poll")
    } finally {
      setLoading(false)
    }
  }
  // ================= UI =================
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

        <ScheduleSettings form={form} update={update} />

      </div>

      <SubmitBar loading={loading} submit={submit} />

    </div>
  )
}
