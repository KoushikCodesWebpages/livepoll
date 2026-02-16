import { createContext, useContext, useEffect, useRef, useState } from "react"
import { setLoader } from "../../utils/loaderBridge"

const LoaderContext = createContext()

export function useLoader() {
  return useContext(LoaderContext)
}

export default function GlobalLoaderProvider({ children }) {

  const [count, setCount] = useState(0)
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  const finishing = useRef(false)
  const timer = useRef(null)

  // ---------- start ----------
  const show = () => {
    setCount(c => c + 1)

    if (!visible) {
      setVisible(true)
      setProgress(15)
      startTrickle()
    }
  }

  // ---------- finish ----------
  const hide = () => {
    setCount(c => {
      const next = Math.max(0, c - 1)

      if (next === 0) finishBar()

      return next
    })
  }

  // smooth progress movement
  const startTrickle = () => {
    clearInterval(timer.current)

    timer.current = setInterval(() => {
      setProgress(p => {
        if (p >= 90) return p
        return p + Math.random() * 6
      })
    }, 200)
  }

  // force completion
  const finishBar = () => {
    if (finishing.current) return
    finishing.current = true

    clearInterval(timer.current)

    setProgress(100)

    setTimeout(() => {
      setVisible(false)
      setProgress(0)
      finishing.current = false
    }, 300) // allow animation to reach end
  }

  useEffect(() => {
    setLoader({ show, hide })
  }, [])

  return (
    <LoaderContext.Provider value={{ show, hide }}>
      {children}

      <div
        className={`fixed top-0 left-0 right-0 z-[9999] h-[3px] transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className="h-full bg-indigo-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

    </LoaderContext.Provider>
  )
}
