import { useQuery } from "@tanstack/react-query"
import { API } from "../api/client"

export default function useMyPolls() {
  return useQuery({
    queryKey: ["my-polls"],
    queryFn: async () => {
      const res = await API.get("/b1/poll/mine")
      return res.data.data || []
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
