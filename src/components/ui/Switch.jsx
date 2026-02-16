export default function Switch({ checked, onChange, label }) {
  return (
    <label className="flex items-center justify-between cursor-pointer py-2">
      <span className="text-sm text-gray-300">{label}</span>

      <div
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition
        ${checked ? "bg-indigo-500" : "bg-gray-600"}`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow transform transition
          ${checked ? "translate-x-6" : ""}`}
        />
      </div>
    </label>
  )
}
