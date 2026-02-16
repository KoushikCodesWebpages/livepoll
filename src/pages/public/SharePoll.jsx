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
        setPoll(res.data);
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
        <div>
          <div className="text-2xl mb-4">{error}</div>
        </div>
      </div>
    );

  // ---------- VIEW ----------

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white p-6">

      <div className="max-w-2xl mx-auto space-y-6">

        <h1 className="text-3xl font-semibold text-center">
          {poll.content.question}
        </h1>

        {/* OPTIONS */}
        <div className="space-y-3">
          {poll.content.options.map(opt => (
            <button
              key={opt.option_id}
              onClick={() => setSelected(opt.option_id)}
              className={`w-full text-left px-4 py-3 rounded-xl border transition
                ${selected === opt.option_id
                  ? "bg-indigo-600 border-indigo-400"
                  : "bg-white/10 border-white/10 hover:bg-white/20"}`}
            >
              {opt.text}
            </button>
          ))}
        </div>

        {/* VOTE BUTTON */}
        <button
          onClick={submitVote}
          disabled={!selected || voting}
          className="w-full py-3 bg-indigo-600 rounded-xl hover:bg-indigo-500 disabled:opacity-40"
        >
          {voting ? "Submitting vote..." : "Submit Vote"}
        </button>

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
