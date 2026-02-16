import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

export default function Select({ value, onChange, options }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const close = e => {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    window.addEventListener("click", close)
    return () => window.removeEventListener("click", close)
  }, [])

  const selected = options.find(o => o.value === value)

  return (
    <div ref={ref} className="relative w-full">
      {/* Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center p-3 rounded-lg bg-white/10 border border-white/10 hover:border-indigo-500 transition"
      >
        <span>{selected?.label}</span>
        <ChevronDown size={18} className={`transition ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Options */}
      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border border-white/10 bg-[#111827] shadow-lg overflow-hidden">
          {options.map(opt => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
              className={`px-4 py-2 cursor-pointer hover:bg-indigo-600/30 ${
                opt.value === value ? "bg-indigo-600/40" : ""
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
