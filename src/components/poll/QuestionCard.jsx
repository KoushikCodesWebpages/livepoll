import CardSection from "../ui/CardSection"
import { useMemo, useState } from "react"

export default function QuestionCard({ form, update }) {

  const [focused, setFocused] = useState(false)
  const [dirty, setDirty] = useState(false)

  const value = form.question || ""
  const trimmed = value.trim()

  // ---------- VALIDATION ----------
  const error = useMemo(() => {
    if (trimmed.length === 0) return "Question is required"
    if (trimmed.length < 5) return "Minimum 5 characters"
    if (trimmed.length > 200) return "Maximum 200 characters"
    return ""
  }, [trimmed])

  // invalid only when user has interacted AND field not focused
  const invalid = dirty && !focused && error !== ""

  // ---------- EVENTS ----------
  const handleChange = (e) => {
    if (!dirty) setDirty(true)
    update("question", e.target.value)
  }

  return (
    <CardSection title="Question">

      <div className="space-y-1">

        <input
          placeholder="Ask something..."
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full p-3 rounded-lg border outline-none transition
            ${invalid
              ? "bg-red-500/10 border-red-400"
              : "bg-white/10 border-white/10 focus:border-indigo-500"}`}
        />

        {/* helper only while focused OR invalid */}
        {(focused || invalid) && (
          <div className="flex justify-between text-xs animate-fadeIn">
            <span className={`${invalid ? "text-red-400" : "text-gray-400"}`}>
              {error || "Looks good"}
            </span>
            <span className="text-gray-400">{trimmed.length}/200</span>
          </div>
        )}

      </div>

      <textarea
        placeholder="Optional description"
        value={form.description || ""}
        onChange={e => update("description", e.target.value)}
        className="w-full p-3 rounded-lg bg-white/10 border border-white/10 resize-none min-h-[90px]"
      />

    </CardSection>
  )
}
