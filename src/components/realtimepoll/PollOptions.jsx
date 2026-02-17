export default function PollOptions({ options }) {

  if (!options?.length)
    return <div className="text-gray-400 text-sm">No options available</div>

  return (
    <div className="space-y-3">
      {options.map(opt => {

        const hidden = opt.votes === undefined

        return (
          <div
            key={opt.option_id}
            className="flex justify-between items-center px-4 py-3 rounded-xl bg-white/10"
          >
            <span>{opt.text}</span>

            <span className="text-sm text-gray-300">
              {hidden ? "—" : `${opt.votes} votes`}
            </span>
          </div>
        )
      })}
    </div>
  )
}
