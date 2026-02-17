import { useLoaderData } from "react-router-dom"
import { useMemo, useState, useEffect } from "react"
import PollViewCard from "../../components/PollViewCard"
import { useRealTimePoll } from "../../hooks/useRealTimePoll"

export default function Poll() {

  const raw = useLoaderData()

  // normalize structure
  const basePoll = raw?.poll ?? raw
  const pollId = basePoll?.poll_id ?? null

  // ⭐ ensure component committed before WS
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])



  const [live, setLive] = useState({
    options: null,
    viewers: 0,
    closed: null
  })

  const wsStatus = useRealTimePoll(pollId, {
    onState: (state) => {
      setLive(l => ({ ...l, options: state.options, closed: state.closed }))
    },
    onVoteDelta: ({ option_id, votes }) => {
      setLive(l => ({
        ...l,
        options: l.options?.map(o =>
          o.option_id === option_id ? { ...o, votes } : o
        )
      }))
    },
    onPresence: ({ viewers }) => setLive(l => ({ ...l, viewers }))
  })

  const poll = useMemo(() => {
    if (!basePoll) return null

    return {
      ...basePoll,
      content: {
        ...(basePoll.content ?? {}),
        options: live.options ?? basePoll.content?.options ?? []
      },
      behavior: {
        ...(basePoll.behavior ?? {}),
        closed: live.closed ?? basePoll.behavior?.closed
      }
    }
  }, [basePoll, live])

  const hasVotes = poll?.meta?.total_votes > 0
   if (!poll) return null

  return <PollViewCard poll={poll} hasVotes={hasVotes} viewers={live.viewers} wsStatus={wsStatus}/>
}
