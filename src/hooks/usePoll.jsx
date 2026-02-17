import { useQuery } from "@tanstack/react-query"
import { API } from "../api/client"

export default function usePoll(pollId) {
  return useQuery({
    queryKey: ["poll", pollId],
    queryFn: async () => {
      const res = await API.get(`/b1/poll/${pollId}`)
      return res.data
    },
    enabled: !!pollId,
    staleTime: Infinity
  })
}
