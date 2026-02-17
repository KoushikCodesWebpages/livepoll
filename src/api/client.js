import axios from "axios"
import { showLoader, hideLoader } from "../utils/loaderBridge"

export const API_BASE = "https://realtime-poll.clqit.in"
// export const API_BASE = "http://localhost:8080"
export const WS_BASE = API_BASE.replace(/^http/, "ws")

export const API = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

/* ---------------- LOADER INTERCEPTORS ---------------- */
API.interceptors.request.use(config => {
  showLoader()
  return config
})

API.interceptors.response.use(
  res => {
    hideLoader()
    return res
  },
  err => {
    hideLoader()
    return Promise.reject(err)
  }
)


/* ---------------- WS HELPER ---------------- */
export function createPollSocket(pollId) {
  if (!pollId) return null
  return `${WS_BASE}/ws/poll/${pollId}`
}
