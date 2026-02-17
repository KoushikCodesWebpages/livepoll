
// import { useParams } from "react-router-dom"
// import { API } from "../../api/client"
// import { useEffect, useState } from "react"
// import { useLoader } from "../../components/ui/GlobalLoader"
// import PollViewCard from "../../components/PollViewCard"

// export default function Poll() {

//   const { pollId } = useParams()
//   const { show, hide } = useLoader()

//   const [poll, setPoll] = useState(null)

// useEffect(() => {
//   if (!pollId) return

//   let mounted = true

//   const load = async () => {
//     show()
//     try {
//       const res = await API.get(`/b1/poll/${pollId}`)
//       if (mounted) setPoll(res.data.poll)
//     } catch {
//       if (mounted) setPoll(null)
//     } finally {
//       hide()
//     }
//   }

//   load()

//   return () => { mounted = false }

// }, [pollId])


//   if (!poll) return null   // loader handles UI

//   return <PollViewCard poll={poll}/>
// }

// import { useLoaderData } from "react-router-dom"
// import { useMemo, useState } from "react"
// import PollViewCard from "../../components/PollViewCard"
// import { useRealTimePoll } from "../../hooks/useRealTimePoll"

// export default function Poll() {

//   const basePoll = useLoaderData()

//   // ⭐ stabilize id
//   const pollId = basePoll?.poll_id ?? null

//   const [live, setLive] = useState({
//     options: null,
//     viewers: 0,
//     closed: null
//   })

//   // ----- WEBSOCKET -----
//   const wsStatus = useRealTimePoll(pollId, {
//     onState: (state) => {
//       setLive(l => ({
//         ...l,
//         options: state.options,
//         closed: state.closed
//       }))
//     },

//     onVoteDelta: ({ option_id, votes }) => {
//       setLive(l => ({
//         ...l,
//         options: l.options?.map(o =>
//           o.option_id === option_id ? { ...o, votes } : o
//         )
//       }))
//     },

//     onPresence: ({ viewers }) => {
//       setLive(l => ({ ...l, viewers }))
//     }
//   })

//   const poll = useMemo(() => {
//     if (!basePoll) return null

//     const baseOptions = basePoll?.content?.options ?? []

//     return {
//       ...basePoll,
//       content: {
//         ...(basePoll.content ?? {}),
//         options: live.options ?? baseOptions
//       },
//       behavior: {
//         ...(basePoll.behavior ?? {}),
//         closed: live.closed ?? basePoll?.behavior?.closed
//       }
//     }

//   }, [basePoll, live])

//   return (
//     <PollViewCard
//       poll={poll}
//       viewers={live.viewers}
//       wsStatus={wsStatus}
//     />
//   )
// }




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

  return <PollViewCard poll={poll} viewers={live.viewers} wsStatus={wsStatus}/>
}
