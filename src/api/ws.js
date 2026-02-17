import { API } from "./client"

let cachedToken = null
let expiry = 0

export async function getWsToken() {
  const now = Date.now()

  if (cachedToken && now < expiry - 5000) {
    return cachedToken
  }

  const res = await API.get("/ws/token")
  cachedToken = res.data.ws_token

  // decode exp
  const payload = JSON.parse(atob(cachedToken.split(".")[1]))
  expiry = payload.exp * 1000

  return cachedToken
}
