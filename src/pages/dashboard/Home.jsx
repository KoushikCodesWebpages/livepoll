
import useMyPolls from "../../hooks/useMyPoll.jsx"
import PollCard from "../../components/PollCard.jsx"
// import Loader from "../../components/ui/Loader"

export default function Home() {
const { data, isLoading, error } = useMyPolls()
const polls = Array.isArray(data) ? data : []

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white">
      

      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">My Polls</h2>

         {/* {loading && <Loader text="Fetching poll..." />} */}
        {error && <div className="text-red-400">{error}</div>}
   
        {!isLoading && polls.length === 0 && (
          <div className="text-gray-400">
            You haven’t created any polls yet.
          </div>
        )}


        <div className="grid gap-5 md:grid-cols-2">
          {polls.map(poll => (
            <PollCard key={poll.poll_id} poll={poll} />
          ))}
        </div>
      </div>
    </div>
  )
}
