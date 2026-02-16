import { useEffect, useState } from "react"
import { API } from "../api/client"
import { useParams } from "react-router-dom"

export default function usePoll() {
  const { pollId } = useParams()   // ← MATCH ROUTER

  const [poll, setPoll] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!pollId) return

    const fetchPoll = async () => {
      try {
        setLoading(true)
        const res = await API.get(`/b1/poll/${pollId}`)
        setPoll(res.data)
      } catch (err) {
        console.error("POLL ERROR:", err?.response || err)
        setError(err?.response?.data?.error || "Failed to load poll")
      } finally {
        setLoading(false)
      }
    }

    fetchPoll()
  }, [pollId])

  return { poll, loading, error }
}
