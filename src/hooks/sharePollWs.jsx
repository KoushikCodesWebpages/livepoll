import { useEffect, useRef, useState } from "react"
import {API_BASE,WS_BASE} from "../api/client"
export function useSharePollWs(poll, handlers = {}) {

  const wsRef = useRef(null)
  const [status, setStatus] = useState("idle")
  const [viewers, setViewers] = useState(0)

  useEffect(() => {

    if (!poll) return

    const enabled =
      poll?.behavior?.show_live_results &&
      poll?.viewer?.can_view_results

    if (!enabled) {
      console.log("[ShareWS] live results disabled")
      return
    }

    let closedByLogic = false
    let reconnectTimer = null

    const url =
      `${WS_BASE}/ws/poll/${poll.poll_id}?session=${poll.session_id}`

    function connect() {

      console.log("[ShareWS] connecting ->", url)

      const ws = new WebSocket(url)
      wsRef.current = ws
      setStatus("connecting")

      ws.onopen = () => {
        console.log("[ShareWS] OPEN")
        setStatus("open")
      }

      ws.onmessage = (event) => {
        console.log("[ShareWS] raw:", event.data)

        try {
          const msg = JSON.parse(event.data)

          switch (msg.type) {

            case "poll_state":
              handlers.onState?.(msg.data)

              // stop socket when poll ends
              if (msg.data?.closed) {
                closedByLogic = true
                ws.close()
              }
              break

            case "vote_delta":
              handlers.onVoteDelta?.(msg.data)
              break

            case "presence":
              setViewers(msg.data?.viewers ?? 0)
              handlers.onPresence?.(msg.data)
              break
          }

        } catch {
          console.log("[ShareWS] invalid json")
        }
      }

      ws.onerror = () => setStatus("error")

      ws.onclose = () => {
        console.log("[ShareWS] CLOSED")
        setStatus("closed")

        if (!closedByLogic) {
          reconnectTimer = setTimeout(connect, 2000)
        }
      }
    }

    connect()

    return () => {
      closedByLogic = true
      wsRef.current?.close()
      if (reconnectTimer) clearTimeout(reconnectTimer)
    }

  }, [poll?.poll_id])

  return { status, viewers }
}
