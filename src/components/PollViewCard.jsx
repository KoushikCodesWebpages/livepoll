import { ArrowLeft, Pencil } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import ToggleBadge from "../components/ui/ToggleBadge"

export default function PollViewCard({ poll }) {
  const navigate = useNavigate()
  const { user } = useAuth()

  const isOwner = user?.id === poll.owner_id

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {isOwner && (
          <button
            onClick={() => navigate(`/edit/${poll.poll_id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition"
          >
            <Pencil size={16} />
            Edit
          </button>
        )}
      </div>

      {/* QUESTION CARD */}
      <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/10 border border-white/10 rounded-2xl p-6">
        <h1 className="text-3xl font-semibold mb-6">
          {poll.content.question}
        </h1>

        {/* OPTIONS */}
        <div className="space-y-3">
          {poll.content.options.map(opt => (
            <div
              key={opt.option_id}
              className="flex justify-between items-center px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
            >
              <span>{opt.text}</span>
              <span className="text-sm text-gray-300">
                {opt.votes} votes
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SETTINGS PANELS */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* VOTING RULES */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
          <h3 className="text-lg font-semibold">Voting Rules</h3>

          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Max votes per user</span>
            <span className="font-medium">{poll.vote.max_votes_per_user}</span>
          </div>

          <ToggleBadge label="Allow change vote" value={poll.vote.allow_change_vote} />
          <ToggleBadge label="Anonymous voting" value={poll.vote.anonymous_vote} />
          <ToggleBadge label="Unique session" value={poll.vote.unique_session} />
          <ToggleBadge label="Unique IP" value={poll.vote.unique_ip} />
        </div>

        {/* BEHAVIOR & ANALYTICS */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
          <h3 className="text-lg font-semibold">Behavior & Tracking</h3>

          <ToggleBadge label="Auto close" value={poll.behavior.auto_close} />
          <ToggleBadge label="Live results" value={poll.behavior.show_live_results} />
          <ToggleBadge label="Track views" value={poll.analytics.track_views} />
          <ToggleBadge label="Fraud detection" value={poll.analytics.fraud_detection} />
        </div>

      </div>

      {/* META FOOTER */}
      <div className="text-xs text-gray-500 text-center pt-4 border-t border-white/10">
        Created {new Date(poll.meta.created_at).toLocaleString()} •
        Total votes {poll.meta.total_votes} •
        Views {poll.meta.total_views}
      </div>

    </div>
  )
}
