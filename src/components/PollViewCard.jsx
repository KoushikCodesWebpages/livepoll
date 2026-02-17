import PollHeader from "./realtimepoll/PollHeader"
import PollQuestion from "./realtimepoll/PollQuestion"
import PollDetails from "./realtimepoll/PollDetails"
import PollMeta from "./realtimepoll/PollMeta"

export default function PollViewCard({ poll,viewers }) {

  if (!poll) return null

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PollHeader poll={poll} />
      <PollQuestion poll={poll} />
      <PollDetails poll={poll} />
      <PollMeta poll={poll} viewers={viewers} />
    </div>
  )
}
