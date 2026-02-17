export function applyPollMessage(state, msg) {

  // must receive snapshot first
  if (!state && msg.type !== "poll_state") return state

  switch (msg.type) {

    case "poll_state":
      return {
        ...msg.data,
        viewers: 1
      }

    case "presence":
      return {
        ...state,
        viewers: msg.data.viewers
      }

    case "vote_delta":

      // hidden poll → activity only
      if (!msg.data) return state

      return {
        ...state,
        options: state.options.map(o =>
          o.option_id === msg.data.option_id
            ? { ...o, votes: msg.data.votes }
            : o
        )
      }

    case "poll_closed":
      return {
        ...state,
        closed: true,
        options: msg.data.options
      }

    default:
      return state
  }
}
