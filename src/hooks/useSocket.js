import { useRef } from "react"

export default function useSocket() {

  const wsRef = useRef(null)

  function connect(path) {

    const url = `${import.meta.env.VITE_WS_URL}${path}`
    const ws = new WebSocket(url)

    wsRef.current = ws
    return ws
  }

  function disconnect() {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
  }

  return { connect, disconnect }
}
