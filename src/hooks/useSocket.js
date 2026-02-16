import { useEffect, useRef } from "react"

export function useSocket(url, { onMessage, onOpen, onClose } = {}) {
  const socketRef = useRef(null)

  useEffect(() => {
    if (!url) return

    const ws = new WebSocket(url)
    socketRef.current = ws

    ws.onopen = () => {
      onOpen?.(ws)
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        onMessage?.(data, ws)
      } catch (e) {
        console.error("Invalid WS message", e)
      }
    }

    ws.onclose = () => {
      onClose?.()
    }

    return () => {
      ws.close()
      socketRef.current = null
    }
  }, [url])

  const send = (payload) => {
    if (!socketRef.current) return
    socketRef.current.send(JSON.stringify(payload))
  }

  return { send }
}
