import { useLoaderData, useNavigate } from "react-router-dom"
import { useState } from "react"
import { ArrowLeft } from "lucide-react"

import { API } from "../../api/client"
import { useToast } from "../../components/ui/ToastProvider"

import QuestionCard from "../../components/poll/QuestionCard"
import OptionsEditor from "../../components/poll/OptionsEditor"
import BasicSettings from "../../components/poll/BasicSettings"
import AdvancedSettings from "../../components/poll/AdvancedSettings"
import SubmitBar from "../../components/poll/SubmitBar"

import { mapPollToForm, buildPollPatch  } from "../../utils/pollmapper"

export default function EditPoll() {

  const data = useLoaderData()
  const poll = data?.poll ?? data

  const navigate = useNavigate()
  const toast = useToast()

  const [loading, setLoading] = useState(false)
  const [advanced, setAdvanced] = useState(false)
  const [error, setError] = useState("")

  // 🧠 SAFE FORM STATE
  const [form, setForm] = useState(() => mapPollToForm(poll))

  // ---------- helpers ----------
  const update = (key, value) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const updateOption = (i, value) => {
    setForm(prev => {
      const copy = [...prev.options]

      if (typeof copy[i] === "string")
        copy[i] = value
      else
        copy[i] = { ...copy[i], text: value }

      return { ...prev, options: copy }
    })
  }

  const addOption = () => {
    setForm(prev => ({
      ...prev,
      options: [...prev.options, { id: crypto.randomUUID(), text:"", isNew:true }]
    }))
  }

  const removeOption = (i) => {
    setForm(prev => {
      const copy = [...prev.options]

      // existing option → mark deleted
      if (typeof copy[i] === "object" && !copy[i].isNew) {
        copy[i] = { ...copy[i], isDeleted:true }
      } else {
        copy.splice(i,1)
      }

      return { ...prev, options: copy }
    })
  }

  // ---------- submit ----------
  const submit = async () => {

    setLoading(true)
    setError("")

    try {

      const payload = buildPollPatch(poll, form)

      if (Object.keys(payload).length === 0) {
        toast.show("Nothing changed")
        setLoading(false)
        return
      }

      console.log("PATCH PAYLOAD", payload)

      const res = await API.patch(`/b1/poll/${poll.poll_id}`, payload)

      if (res.data?.success === false) {
        throw new Error(res.data?.message || "Update failed")
      }

      toast.show("Poll updated ✏️")
     
      setTimeout(() => navigate(`/poll/${poll.poll_id}`), 700)

    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.issue || "Update failed")
    } finally {
      setLoading(false)
    }
  }

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-[#0b0f19] text-white">

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
