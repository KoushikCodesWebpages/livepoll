import ToggleBadge from "../ui/ToggleBadge"

export default function PollDetails({ poll }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">

      <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
        <h3 className="text-lg font-semibold">Voting Rules</h3>

        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Max votes per user</span>
          <span className="font-medium">{poll?.vote?.max_votes_per_user ?? 1}</span>
        </div>

        <ToggleBadge label="Allow change vote" value={poll?.vote?.allow_change_vote} />
        <ToggleBadge label="Anonymous voting" value={poll?.vote?.anonymous_vote} />
        <ToggleBadge label="Unique session" value={poll?.vote?.unique_session} />
        <ToggleBadge label="Unique IP" value={poll?.vote?.unique_ip} />
      </div>


      <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
        <h3 className="text-lg font-semibold">Behavior & Tracking</h3>

        <ToggleBadge label="Auto close" value={poll?.behavior?.auto_close} />
        <ToggleBadge label="Live results" value={poll?.behavior?.show_live_results} />
        <ToggleBadge label="Track views" value={poll?.analytics?.track_views} />
        <ToggleBadge label="Fraud detection" value={poll?.analytics?.fraud_detection} />
      </div>

    </div>
  )
}
