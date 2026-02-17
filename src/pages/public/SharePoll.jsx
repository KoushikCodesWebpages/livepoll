import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API } from "../../api/client";

export default function SharePoll() {

  const [params] = useSearchParams();
  const token = params.get("token");

  const [poll, setPoll] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ---------- LOAD POLL ----------
  useEffect(() => {
    if (!token) {
      setError("Invalid share link");
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const res = await API.get(`/b1/poll/share?token=${token}`);

        const normalized = {
          ...res.data.poll,
          viewer: res.data.viewer,
          session_id: res.data.session_id,
          user_id: res.data.user_id
        };

        setPoll(normalized);

        // preselect voted option
        if (normalized.viewer?.selected_option) {
          setSelected(normalized.viewer.selected_option);
        }

      } catch (err) {
        setError(err?.response?.data?.issue || "Unable to open poll");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  // ---------- VOTE ----------
  const submitVote = async () => {

    if (!poll?.viewer?.can_vote) return;
    if (!selected) return;

    setVoting(true);
    setSuccess("");
    setError("");

    try {
      await API.post("/b1/vote", {
        poll_id: poll.poll_id,
        option_id: selected
      });

      setSuccess("Vote submitted successfully 🎉");

      // update local viewer state
      setPoll(prev => ({
        ...prev,
        viewer: {
          ...prev.viewer,
          can_vote: false,
          already_voted: true,
          selected_option: selected
        }
      }));

    } catch (err) {
      setError(err?.response?.data?.issue || "Vote failed");
    } finally {
      setVoting(false);
    }
  };

  // ---------- STATES ----------

  if (loading)
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center">
        Loading poll...
      </div>
    );

  if (error && !poll)
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center text-center">
        <div className="text-2xl">{error}</div>
      </div>
    );

  // ---------- VIEW ----------

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white p-6">

      <div className="max-w-2xl mx-auto space-y-6">

        {/* QUESTION */}
        <h1 className="text-3xl font-semibold text-center">
          {poll?.content?.question}
        </h1>

        {/* STATUS */}
        {!poll.viewer?.can_vote && (
          <div className="text-center text-yellow-400">
            {poll.viewer?.ended
              ? "This poll has ended"
              : poll.viewer?.already_voted
                ? "You already voted"
                : "Voting not available"}
          </div>
        )}

        {/* OPTIONS */}
        <div className="space-y-3">
          {poll?.content?.options?.map(opt => {

            const isSelected = selected === opt.option_id;
            const isVoted = poll.viewer?.selected_option === opt.option_id;

            return (
              <button
                key={opt.option_id}
                disabled={!poll.viewer?.can_vote}
                onClick={() => setSelected(opt.option_id)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition
                  ${isSelected ? "bg-indigo-600 border-indigo-400"
                  : isVoted ? "bg-green-600/40 border-green-400"
                  : "bg-white/10 border-white/10 hover:bg-white/20"}
                  ${!poll.viewer?.can_vote && "opacity-70 cursor-default"}
                `}
              >
                {opt.text}

                {/* SHOW RESULTS */}
                {!poll.viewer?.can_vote && poll.viewer?.can_view_results && (
                  <span className="float-right text-sm text-gray-300">
                    {opt.votes} votes
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* VOTE BUTTON */}
        {poll.viewer?.can_vote && (
          <button
            onClick={submitVote}
            disabled={!selected || voting}
            className="w-full py-3 bg-indigo-600 rounded-xl hover:bg-indigo-500 disabled:opacity-40"
          >
            {voting ? "Submitting vote..." : "Submit Vote"}
          </button>
        )}

        {/* MESSAGES */}
        {success && <div className="text-green-400 text-center">{success}</div>}
        {error && <div className="text-red-400 text-center">{error}</div>}

        <div className="text-center text-xs text-gray-400 pt-6">
          Shared via RealPoll
        </div>

      </div>
    </div>
  );
}
