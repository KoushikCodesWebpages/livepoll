import axios from "axios"

export const API = axios.create({
baseURL: "https://realtime-poll.clqit.in",
withCredentials: true, 
headers: {
"Content-Type": "application/json",
},
})