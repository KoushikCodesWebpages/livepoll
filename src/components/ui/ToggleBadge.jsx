export default function ToggleBadge({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-gray-300">{label}</span>

      <span
        className={`px-3 py-1 text-xs rounded-full font-medium
        ${value
          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
          : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
        }`}
      >
        {value ? "Enabled" : "Disabled"}
      </span>
    </div>
  )
}
