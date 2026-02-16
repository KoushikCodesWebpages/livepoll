import { createContext, useContext, useState } from "react"
import { X } from "lucide-react"

const ToastContext = createContext()

export function useToast() {
  return useContext(ToastContext)
}

let idCounter = 0

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = (id) => {
    setToasts(t => t.filter(toast => toast.id !== id))
  }

  const show = (message, type = "success", duration = 3500) => {
    const id = ++idCounter

    setToasts(t => [...t, { id, message, type }])

    setTimeout(() => remove(id), duration)
  }

  return (
    <ToastContext.Provider value={{ show }}>
      {children}

      {/* Notification container */}
      <div className="fixed top-5 right-5 z-[999] flex flex-col gap-3">
        {toasts.map(toast => (
          <Notification
            key={toast.id}
            {...toast}
            onClose={() => remove(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function Notification({ message, type, onClose }) {

  const colors = {
    success: "border-emerald-500 bg-emerald-500/10 text-emerald-300",
    error: "border-red-500 bg-red-500/10 text-red-300",
    info: "border-indigo-500 bg-indigo-500/10 text-indigo-300"
  }

  return (
    <div className={`
      min-w-[280px] max-w-sm
      border ${colors[type]}
      backdrop-blur-xl
      rounded-xl shadow-lg
      px-4 py-3
      flex items-start gap-3
      animate-toastIn
    `}>

      <div className="flex-1 text-sm leading-relaxed">
        {message}
      </div>

      <button
        onClick={onClose}
        className="text-white/50 hover:text-white transition"
      >
        <X size={16} />
      </button>

    </div>
  )
}
