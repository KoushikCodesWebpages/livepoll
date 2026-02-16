import { useLoaderData, useNavigate } from "react-router-dom"
import { useState } from "react"
import { ArrowLeft } from "lucide-react"

import Navbar from "../../components/Navbar"
import { API } from "../../api/client"
import { useToast } from "../../components/ui/ToastProvider"

import QuestionCard from "../../components/poll/QuestionCard"
import OptionsEditor from "../../components/poll/OptionsEditor"
import BasicSettings from "../../components/poll/BasicSettings"
import AdvancedSettings from "../../components/poll/AdvancedSettings"
import SubmitBar from "../../components/poll/SubmitBar"

export default function EditPoll() {

  const poll = useLoaderData()
  const navigate = useNavigate()
  const toast = useToast()

  const [loading, setLoading] = useState(false)
  const [advanced, setAdvanced] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    question: poll.content.question,
    description: poll.content.description || "",
    options: poll.content.options.map(o => o.text),

    visibility: poll.access.visibility,
    allowed_emails: (poll.access.allowed_emails || []).join(","),

    allow_change: poll.vote.allow_change_vote,
    anonymous: poll.vote.anonymous_vote,

    randomize_options: poll.content.randomize_options,
    allow_custom_option: poll.content.allow_custom_option,

    hide_results_until_end: poll.vote.hide_results_until_end,
    show_voters: poll.vote.show_voters,
    unique_ip: poll.vote.unique_ip,
    unique_session: poll.vote.unique_session,

    start_at: poll.behavior.start_at?.slice(0,16) || "",
    end_at: poll.behavior.end_at?.slice(0,16) || "",
    auto_close: poll.behavior.auto_close,
    show_live_results: poll.behavior.show_live_results
  })

  // helpers
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

  // PATCH
  const submit = async () => {
    setLoading(true)
    setError("")

    try {
      await API.patch(`/b1/poll/${poll.poll_id}`, {
        content: {
          question: form.question,
          description: form.description,
          options: form.options.map(text => ({ text }))
        },
        access: {
          visibility: form.visibility,
          allowed_emails: form.allowed_emails
            ? form.allowed_emails.split(",").map(e => e.trim())
            : []
        },
        vote: {
          allow_change_vote: form.allow_change,
          anonymous_vote: form.anonymous,
          hide_results_until_end: form.hide_results_until_end,
          show_voters: form.show_voters,
          unique_ip: form.unique_ip,
          unique_session: form.unique_session
        },
        behavior: {
          start_at: form.start_at || null,
          end_at: form.end_at || null,
          auto_close: form.auto_close,
          show_live_results: form.show_live_results
        }
      })

      toast.show("Poll updated ✏️")
      setTimeout(() => navigate(`/poll/${poll.poll_id}`), 700)

    } catch (err) {
      setError(err?.response?.data?.issue || "Update failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white">

      <Navbar />

      <div className="max-w-3xl mx-auto px-6 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-28 space-y-6">

        <h2 className="text-2xl font-semibold">Edit Poll</h2>

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

      </div>

      <SubmitBar loading={loading} submit={submit} mode="edit" />


    </div>
  )
}
