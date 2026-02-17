import CardSection from "../ui/CardSection"
import { useMemo } from "react"

export default function OptionsEditor({ form, updateOption, addOption, removeOption }) {

  // normalize option value
  const getText = (o) => typeof o === "string" ? o : o?.text || ""

  const trimmed = form.options.map(o => getText(o).trim())

  const hasEmpty = trimmed.some(o => o === "")
  const duplicates = new Set(trimmed.filter((o, i) => o && trimmed.indexOf(o) !== i))
  const hasDuplicates = duplicates.size > 0
  const maxReached = form.options.length >= 10

  const error = useMemo(() => {
    if (form.options.length < 2) return "At least 2 options required"
    if (hasEmpty) return "Options cannot be empty"
    if (hasDuplicates) return "Duplicate options not allowed"
    return ""
  }, [trimmed.join("|")]) // stable dependency

  return (
    <CardSection title="Options">

      <div className="space-y-3">

        {form.options.map((opt, i) => {

          const value = getText(opt)
          const duplicate = value && trimmed.indexOf(value.trim()) !== i

          return (
            <div key={i} className="flex gap-2 items-center">

              <input
                value={value}
                onChange={e => updateOption(i, e.target.value)}
                className={`flex-1 p-3 rounded-lg border
                  ${duplicate
                    ? "bg-red-500/10 border-red-400"
                    : "bg-white/10 border-white/10"}`}
              />

              {form.options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(i)}
                  className="text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              )}

            </div>
          )
        })}

        {/* ADD OPTION */}
        <button
          type="button"
          disabled={maxReached}
          onClick={addOption}
          className={`text-sm ${maxReached
            ? "text-gray-500 cursor-not-allowed"
            : "text-indigo-400 hover:text-indigo-300"}`}
        >
          {maxReached ? "Maximum 10 options reached" : "+ Add option"}
        </button>

        {/* ERROR */}
        {error && (
          <div className="text-red-400 text-sm pt-1">
            {error}
          </div>
        )}

      </div>

    </CardSection>
  )
}
