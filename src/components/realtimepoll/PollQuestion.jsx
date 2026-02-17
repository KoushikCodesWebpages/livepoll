export default function PollQuestion({ poll }) {

  const question = poll?.content?.question
  const options = poll?.content?.options ?? []

  if (!question) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse h-40"/>
    )
  }

  return (
    <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/10 border border-white/10 rounded-2xl p-6">
      <h1 className="text-3xl font-semibold mb-6">{question}</h1>

      <div className="space-y-3">
        {options.map(opt => (
          <div key={opt.option_id}
            className="flex justify-between items-center px-4 py-3 rounded-xl bg-white/10">
            <span>{opt.text}</span>
            <span className="text-sm text-gray-300">
              {opt.votes ?? 0} votes
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
