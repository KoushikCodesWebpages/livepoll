export default function PollMeta({ poll, viewers }) {
  return (
    <div className="text-xs text-gray-400 text-center pt-4 border-t border-white/10 space-y-1">

      <div>
        Created {poll?.meta?.created_at
          ? new Date(poll.meta.created_at).toLocaleString()
          : "—"}
      </div>

      <div>Total votes {poll?.meta?.total_votes ?? 0}</div>

      <div className="text-emerald-400 font-medium">
        👀 {viewers} viewing now
      </div>

    </div>
  )
}
