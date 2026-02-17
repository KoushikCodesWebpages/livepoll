import { useNavigate } from "react-router-dom"
import { Globe, Lock, Users } from "lucide-react"

export default function PollCard({ poll }) {
  const navigate = useNavigate()

  // ---------------- SAFE DATA ----------------
  const options = Array.isArray(poll?.content?.options) ? poll.content.options : []

  const question = String(poll?.content?.question ?? "Untitled poll")

  const createdDate = poll?.meta?.created_at
    ? new Date(poll.meta.created_at).toLocaleDateString()
    : "—"

  // ----- total votes -----
  const totalVotes = options.reduce(
    (sum, opt) => sum + Number(opt?.votes ?? 0),
    0
  )

  // ----- time status -----
  const now = Date.now()

  const start = poll?.meta?.start_at
    ? new Date(poll.meta.start_at).getTime()
    : null

  const expiry = poll?.meta?.expires_at
    ? new Date(poll.meta.expires_at).getTime()
    : null

  let status = "Running"
  let statusStyle = "bg-green-500/20 text-green-300 border-green-500/30"

  if (expiry && now > expiry) {
    status = "Expired"
    statusStyle = "bg-red-500/20 text-red-300 border-red-500/30"
  } else if (start && now < start) {
    status = "Scheduled"
    statusStyle = "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
  }

  // ----- access resolver -----
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

  let access = "public"
  const a = poll?.access

  if (typeof a === "string") {
    access = a
  } else if (a?.allowed_emails?.length) {
    access = "whitelisted"
  } else if (a?.require_login) {
    access = "authenticated"
  } else if (a?.visibility === "private") {
    access = "private"
  }

  const cfg = accessConfig[access] || accessConfig.public

  // ---------------- VIEW ----------------
  return (
    <div
      onClick={() => navigate(`/poll/${poll?.poll_id}`)}
      className="
        group relative cursor-pointer
        bg-gradient-to-br from-white/[0.06] to-white/[0.02]
        border border-white/10
        rounded-2xl p-6
        transition-all duration-200
        hover:border-indigo-400/40
        hover:shadow-[0_10px_35px_rgba(99,102,241,0.25)]
        hover:-translate-y-1
      "
    >
      {/* Question */}
      <h3 className="text-xl font-semibold leading-snug mb-4 text-white group-hover:text-indigo-200 transition">
        {question}
      </h3>

      {/* Options preview */}
      <div className="mb-6">
        <div className="mt-4 text-xs text-gray-600">Options</div>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-300">
          {options.slice(0, 5).map((opt, i) => (
            <span key={opt?.option_id || i} className="opacity-90">
              {String(opt?.text ?? "—")}
              {i < Math.min(4, options.length - 1) && (
                <span className="text-gray-600"> • </span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <span className={`px-3 py-1 text-xs rounded-full border ${statusStyle}`}>
            {status}
          </span>

          <span className={`px-3 py-1 text-xs rounded-full border ${cfg.style}`}>
            {cfg.label}
          </span>
        </div>

        <div className="text-sm text-gray-400">
          {totalVotes} votes
        </div>
      </div>

      {/* created */}
      <div className="mt-4 text-xs text-gray-500">
        Created: {createdDate}
      </div>

      {/* glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition pointer-events-none bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0" />
    </div>
  )
}
