import { useLoaderData, useRevalidator } from "react-router-dom"
import { useEffect } from "react"
import Navbar from "../../components/Navbar"
import PollViewCard from "../../components/PollViewCard"

export default function Poll() {

  const poll = useLoaderData()
  const revalidator = useRevalidator()

  // refetch loader every time page mounts
  useEffect(() => {
    revalidator.revalidate()
  }, [])

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white">
      <Navbar />

      <div className="pt-20 p-8">
        <PollViewCard poll={poll} />
      </div>
    </div>
  )
}
