import { useNavigate } from "react-router-dom"

export default function PollCard({ poll }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/poll/${poll.poll_id}`)}
      className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 cursor-pointer transition"
    >
      <h3 className="text-lg font-semibold mb-3">
        {poll.content.question}
      </h3>

      <div className="space-y-2">
        {poll.content.options.map(opt => (
          <div
            key={opt.option_id}
            className="flex justify-between text-sm text-gray-300"
          >
            <span>{opt.text}</span>
            <span>{opt.votes} votes</span>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Created: {new Date(poll.meta.created_at).toLocaleString()}
      </div>
    </div>
  )
}
