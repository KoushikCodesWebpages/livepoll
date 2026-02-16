export default function PollViewCard({ poll }) {
  return (
    <div className="max-w-2xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">

      <div>
        <h2 className="text-2xl font-semibold">
          {poll.content.question}
        </h2>
      </div>

      <div className="space-y-3">
        {poll.content.options.map(option => (
          <div
            key={option.option_id}
            className="w-full flex justify-between items-center px-4 py-3 rounded-xl bg-white/10"
          >
            <span>{option.text}</span>
            <span className="text-sm text-gray-300">
              {option.votes} votes
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-between text-xs text-gray-500 pt-4 border-t border-white/10">
        <span>
          Created: {new Date(poll.meta.created_at).toLocaleString()}
        </span>

        <span>Total votes: {poll.meta.total_votes}</span>
      </div>

    </div>
  )
}
