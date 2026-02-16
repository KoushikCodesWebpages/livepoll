import { useEffect, useState } from "react"
import { API } from "../api/client.js"
import { useParams } from "react-router-dom"

export default function usePoll() {
  const { poll_id } = useParams()

  const [poll, setPoll] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setLoading(true)
        const res = await API.get(`/b1/poll/${poll_id}`)
        setPoll(res.data)
      } catch (err) {
    console.log("POLL ERROR:", err.response || err)
    setError(err?.response?.data?.error )
      } finally {
        setLoading(false)
      }
    }

    fetchPoll()
  }, [poll_id])

  return { poll, loading, error }
}
