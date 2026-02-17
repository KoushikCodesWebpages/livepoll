import {API_BASE,WS_BASE} from "../api/client"

import { useEffect, useRef, useState } from "react"
import { getWsToken } from "../api/ws"

export function useRealTimePoll(pollId, handlers) {

  const wsRef = useRef(null)
  const [status, setStatus] = useState("idle")

  useEffect(() => {

    console.log("[WS] hook start, pollId =", pollId)

    if (!pollId) {
      console.log("[WS] no pollId -> skip connect")
      return
    }

    let cancelled = false
    let reconnectTimer = null

    async function connect() {
      try {
        console.log("[WS] requesting token...")

        setStatus("connecting")

        const token = await getWsToken()

        const payload = JSON.parse(atob(token.split(".")[1]))
        console.log("[WS] token received, expires:", new Date(payload.exp * 1000).toLocaleTimeString())

        if (cancelled) {
          console.log("[WS] cancelled before connect")
          return
        }

        const url = `${WS_BASE}/ws/poll/${pollId}?token=${token}`
        console.log("[WS] connecting ->", url)

        const ws = new WebSocket(url)
        wsRef.current = ws

        ws.onopen = () => {
          console.log("[WS] OPEN")
          setStatus("open")
        }

        ws.onmessage = (event) => {
          console.log("[WS] message raw:", event.data)

          try {
            const msg = JSON.parse(event.data)

            switch (msg.type) {
              case "poll_state":
                console.log("[WS] poll_state received")
                handlers.onState?.(msg.data)
                break

              case "vote_delta":
                console.log(`[WS] vote_delta -> ${msg.data.option_id} = ${msg.data.votes}`)
                handlers.onVoteDelta?.(msg.data)
                break

              case "presence":
                console.log(`[WS] presence viewers = ${msg.data.viewers}`)
                handlers.onPresence?.(msg.data)
                break

              default:
                console.log("[WS] unknown message", msg)
            }

          } catch {
            console.log("[WS] non-json message:", event.data)
          }
        }

        ws.onerror = (err) => {
          console.log("[WS] ERROR", err)
          setStatus("error")
        }

        ws.onclose = (e) => {
          console.log(`[WS] CLOSED code=${e.code} reason="${e.reason}"`)

          setStatus("closed")

          if (!cancelled) {
            console.log("[WS] reconnecting in 2s...")
            reconnectTimer = setTimeout(connect, 2000)
          }
        }

      } catch (err) {
        console.log("[WS] failed to connect:", err)
        setStatus("error")
      }
    }

    connect()

    return () => {
      console.log("[WS] cleanup -> closing socket")
      cancelled = true
      wsRef.current?.close()
      if (reconnectTimer) clearTimeout(reconnectTimer)
    }

  }, [pollId])

  return status
}
