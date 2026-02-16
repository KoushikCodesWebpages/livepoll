import Navbar from "../../components/Navbar"
import usePoll from "../../hooks/usePoll"
import PollViewCard from "../../components/PollViewCard"
import Loader from "../../components/ui/Loader"
export default function Poll() {
  const { poll, loading, error } = usePoll()

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white">
      <Navbar />

      <div className="p-8">
        {loading && <Loader text="Fetching poll..." />}
        {error && <div className="text-red-400">{error}</div>}
        {poll && <PollViewCard poll={poll} />}
      </div>
    </div>
  )
}
