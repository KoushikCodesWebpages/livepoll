import { useEffect, useState } from "react"
import { API } from "../api/client"

export default function useMyPolls() {
  const [polls, setPolls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPolls = async () => {
    try {
      setLoading(true)
      const res = await API.get("/b1/poll/mine")
      setPolls(res.data.data || [])
    } catch (err) {
      setError("Failed to load polls")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPolls()
  }, [])

  return { polls, loading, error, refetch: fetchPolls }
}
