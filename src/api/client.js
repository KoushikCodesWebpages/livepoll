import axios from "axios"
import { getLoader } from "../utils/loaderBridge"

export const API = axios.create({
  // baseURL: "https://realtime-poll.clqit.in",
  baseURL: "http://localhost:8080",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// REQUEST START
API.interceptors.request.use(config => {
  const loader = getLoader()
  loader?.show()
  return config
})

// REQUEST END
API.interceptors.response.use(
  response => {
    const loader = getLoader()
    loader?.hide()
    return response
  },
  error => {
    const loader = getLoader()
    loader?.hide()
    return Promise.reject(error)
  }
)
