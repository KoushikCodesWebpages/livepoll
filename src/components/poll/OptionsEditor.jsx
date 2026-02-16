import CardSection from "../ui/CardSection"

export default function OptionsEditor({ form, updateOption, addOption, removeOption }) {
  return (
    <CardSection title="Options">

      <div className="space-y-3">
        {form.options.map((opt, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              value={opt}
              onChange={e => updateOption(i, e.target.value)}
              required
              className="flex-1 p-3 rounded-lg bg-white/10 border border-white/10"
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
        ))}

        <button
          type="button"
          onClick={addOption}
          className="text-indigo-400 hover:text-indigo-300 text-sm"
        >
          + Add option
        </button>
      </div>

    </CardSection>
  )
}
