import { ArrowLeft, Pencil, Share2, Globe, Lock, Users } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { API } from "../../api/client"
import { useToast } from "../ui/ToastProvider"
import { useAuth } from "../../hooks/useAuth"
import { useMemo } from "react"

export default function PollHeader({ poll, wsStatus }) {
  const navigate = useNavigate()
  const toast = useToast()
  const { user } = useAuth()

  const isOwner = user?.id === poll?.owner_id

  // ---------- SHARE ----------
  const sharePoll = async () => {
    try {
      const res = await API.post(`/b1/poll/${poll.poll_id}/share`, {
        mode: "infinite",
        type: "view",
        uses: 0
      })

      const shareUrl = `${window.location.origin}${res.data.link}`
      await navigator.clipboard.writeText(shareUrl)
      toast.show("Share link copied 🔗")

    } catch {
      toast.show("Failed to create share link")
    }
  }

  // ---------- ACCESS ----------
  const accessType = useMemo(() => {
    const access = poll?.access
    if (!access) return "public"

    if (access.allowed_emails?.length) return "whitelisted"
    if (access.require_login) return "authenticated"
    if (access.visibility === "private") return "private"

    return "public"
  }, [poll])

  const accessConfig = {
    public: { label: "Public", icon: Globe, style: "bg-green-500/20 text-green-300 border-green-400/30" },
    authenticated: { label: "Login Required", icon: Users, style: "bg-blue-500/20 text-blue-300 border-blue-400/30" },
    private: { label: "Private", icon: Lock, style: "bg-red-500/20 text-red-300 border-red-400/30" },
    whitelisted: { label: "Whitelisted", icon: Users, style: "bg-yellow-500/20 text-yellow-300 border-yellow-400/30" },
  }

  const AccessIcon = accessConfig[accessType].icon

  // ---------- WS STATUS ----------
  const wsMap = {
    idle:        { color: "bg-gray-500",   label: "Idle" },
    connecting:  { color: "bg-yellow-400", label: "Connecting" },
    open:        { color: "bg-emerald-400",label: "Live" },
    closed:      { color: "bg-gray-400",   label: "Reconnecting" },
    error:       { color: "bg-red-500",    label: "Error" }
  }

  const ws = wsMap[wsStatus] || wsMap.idle

  return (
    <div className="flex justify-between items-center">

      {/* LEFT */}
      <button
        onClick={() => navigate("/home", { replace: true })}
        className="flex items-center gap-2 text-gray-300 hover:text-white transition"
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        {/* WS INDICATOR */}
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <span className={`w-2.5 h-2.5 rounded-full ${ws.color} animate-pulse`} />
          <span className="hidden sm:inline">{ws.label}</span>
        </div>

        {/* ACCESS BADGE */}
        <span className={`flex items-center gap-1 px-3 py-1 text-xs rounded-full border ${accessConfig[accessType].style}`}>
          <AccessIcon size={12} />
          {accessConfig[accessType].label}
        </span>

        {/* OWNER BUTTONS */}
        {isOwner && (
          <>
            <button
              onClick={sharePoll}
              className="px-4 py-2 bg-emerald-600 rounded-lg hover:bg-emerald-500 flex gap-2 items-center"
            >
              <Share2 size={16}/> Share
            </button>

            <button
              onClick={() => navigate(`/edit/${poll.poll_id}`)}
              className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 flex gap-2 items-center"
            >
              <Pencil size={16}/> Edit
            </button>
          </>
        )}
      </div>
    </div>
  )
}
