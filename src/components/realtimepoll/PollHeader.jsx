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
  const hasVotes = (poll?.meta?.total_votes ?? 0) > 0
  // ---------- POLL STATUS ----------
  const now = Date.now()

  const start = poll?.meta?.start_at
    ? new Date(poll.meta.start_at).getTime()
    : null

  const expiry = poll?.meta?.expires_at
    ? new Date(poll.meta.expires_at).getTime()
    : null

  let pollStatus = "Running"
  let pollStatusStyle = "bg-green-500/20 text-green-300 border-green-500/30"

  if (expiry && now > expiry) {
    pollStatus = "Expired"
    pollStatusStyle = "bg-red-500/20 text-red-300 border-red-500/30"
  } else if (start && now < start) {
    pollStatus = "Scheduled"
    pollStatusStyle = "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
  }

  // ---------- SHARE ----------
  const sharePoll = async () => {
    try {
      const res = await API.post(`/b1/poll/${poll.poll_id}/share`, {
        mode: "public",
        type: "view",
        uses: 0
      })

      const token = res.data.token
      if (!token) throw new Error("No token returned")

      const fullUrl = `${window.location.origin}/share?token=${token}`
      await navigator.clipboard.writeText(fullUrl)

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
    if (access.visibility === "link") return "private"

    return "public"
  }, [poll])

    const accessConfig = {
      public: {
        label: "Public",
        icon: Globe,
        style: "bg-cyan-500/15 text-cyan-300 border-cyan-400/30"
      },

      authenticated: {
        label: "Login Required",
        icon: Users,
        style: "bg-indigo-500/15 text-indigo-300 border-indigo-400/30"
      },

      private: {
        label: "Private Link",
        icon: Lock,
        style: "bg-slate-500/20 text-slate-300 border-slate-400/30"
      },

      whitelisted: {
        label: "Whitelisted",
        icon: Users,
        style: "bg-orange-500/15 text-orange-300 border-orange-400/30"
      },
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
    <div className="space-y-2">

      <div className="sm:flex sm:justify-between sm:items-center">

        {/* LEFT */}
        <div className="flex items-center justify-between sm:justify-start gap-3">

          <button
            onClick={() => navigate("/home", { replace: true })}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition"
          >
            <ArrowLeft size={18} /> Back
          </button>

          {/* mobile indicators */}
          <div className="flex items-center gap-2 sm:hidden">
            <span className={`w-2.5 h-2.5 rounded-full ${ws.color} animate-pulse`} />
            <span className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full border ${accessConfig[accessType].style}`}>
              <AccessIcon size={12} />
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:flex-nowrap sm:justify-end mt-3 sm:mt-0">

          {/* desktop indicators */}
          <div className="hidden sm:flex items-center gap-3 text-xs">

            {/* connection */}
            <div className="flex items-center gap-2 text-gray-300">
              <span className={`w-2.5 h-2.5 rounded-full ${ws.color} animate-pulse`} />
              <span>{ws.label} connection</span>
            </div>

            <span className="text-gray-600">·</span>

            {/* lifecycle */}
            <span className={`px-2 py-0.5 rounded-full border ${pollStatusStyle}`}>
              {pollStatus}
            </span>

            {/* access */}
            <span className={`flex items-center gap-1 px-3 py-1 rounded-full border ${accessConfig[accessType].style}`}>
              <AccessIcon size={12} />
              {accessConfig[accessType].label}
            </span>

          </div>

        <div className="flex items-center gap-2 sm:hidden">
          {/* <span className={`w-2.5 h-2.5 rounded-full ${ws.color} animate-pulse`} /> */}

          <span className={`px-2 py-0.5 text-xs rounded-full border ${pollStatusStyle}`}>
            {pollStatus}
          </span>

          <span className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full border ${accessConfig[accessType].style}`}>
            <AccessIcon size={12} />
          </span>
        </div>

          {isOwner && (
            <>
              <button
                onClick={sharePoll}
                className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 rounded-lg hover:bg-emerald-500 flex gap-2 items-center justify-center"
              >
                <Share2 size={16}/> <span className="sm:inline hidden">Share</span>
              </button>

              <button
                disabled={hasVotes}
                onClick={() => !hasVotes && navigate(`/edit/${poll.poll_id}`)}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg flex gap-2 items-center justify-center transition
                  ${hasVotes
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white"}
                `}
              >
                <Pencil size={16}/>
                <span className="sm:inline hidden">
                  {hasVotes ? "Locked" : "Edit"}
                </span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* reason message BELOW header */}
      {isOwner && hasVotes && (
        <div className="text-xs text-yellow-400">
          Editing disabled because this poll already has votes
        </div>
      )}

    </div>
  )
}
