import { useSharePollWs } from "../../hooks/sharePollWs"
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { API } from "../../api/client";

export default function SharePoll() {

const [params] = useSearchParams();
const navigate = useNavigate();
const token = params.get("token");

const [poll, setPoll] = useState(null);
const [access, setAccess] = useState(null);
const [message, setMessage] = useState("");
const [selected, setSelected] = useState(null);
const [loading, setLoading] = useState(true);
const [voting, setVoting] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

const gated = !!access;


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

    // ACCESS RESPONSE
    if (res.data?.access) {
      setAccess(res.data.access);
      setMessage(res.data.message || "");
      setPoll(null);
      return;
    }

    const normalized = {
      ...res.data.poll,
      viewer: res.data.viewer,
      session_id: res.data.session_id,
      user_id: res.data.user_id
    };

    setPoll(normalized);

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


// ---------- REALTIME ----------
const ws = useSharePollWs(gated ? null : poll, {

onState: (data) => {
  if (!data) return;

  setPoll(prev => {
    if (!prev?.content?.options) return prev;

    const mergedOptions = data.options.map(wsOpt => {
      const existing = prev.content.options.find(
        o => o.option_id === wsOpt.option_id
      );

      return {
        ...existing,
        ...wsOpt,
        votes: existing?.votes ?? wsOpt?.votes ?? 0
      };
    });

    return {
      ...prev,
      content: { ...prev.content, options: mergedOptions },
      state: { ...prev.state, is_closed: !!data.closed }
    };
  });
},

onVoteDelta: (data) => {
  if (!data?.option_id) return;

  setPoll(prev => ({
    ...prev,
    content: {
      ...prev.content,
      options: prev.content.options.map(o =>
        o.option_id === data.option_id
          ? { ...o, votes: data.votes ?? o.votes }
          : o
      )
    }
  }));
}

});


// ---------- SUBMIT VOTE ----------
const submitVote = async () => {
  if (!selected || voting) return;

  setVoting(true);
  setError("");
  setSuccess("");

  try {
    await API.post("/b1/poll/share/vote", {
      token,
      option_id: selected,
    });

    setSuccess("Vote submitted");

    // optimistic lock after voting
    setPoll(prev => ({
      ...prev,
      viewer: {
        ...prev.viewer,
        selected_option: selected,
        can_vote: false,
      }
    }));

  } catch (err) {
    setError(err?.response?.data?.issue || "Vote failed");
  } finally {
    setVoting(false);
  }
};


// ---------- LOADING ----------
if (loading)
  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center">
      Loading poll...
    </div>
  );


// ---------- ACCESS BLOCK UI ----------
if (gated) {

  const loginRedirect =
    `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;

  let title = "Access Restricted";
  let description = message;

  if (access === "login_required") {
    title = "Login required";
    description = message || "Please sign in to view this poll";
  }

  if (access === "whitelist_required") {
    title = "Authorized account required";
    description = message || "Please login with an approved email";
  }

  if (access === "not_whitelisted") {
    title = "You cannot participate";
    description = message || "You are not whitelisted for this poll";
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">

        <div className="text-2xl font-semibold">{title}</div>
        <div className="text-gray-400">{description}</div>

        <div className="space-y-3 blur-sm pointer-events-none select-none">
          {[1,2,3].map(i => (
            <div key={i} className="px-4 py-3 rounded-xl bg-white/10 border border-white/10">
              Option {i}
            </div>
          ))}
        </div>

        {(access === "login_required" || access === "whitelist_required") && (
          <button
            onClick={() => navigate(loginRedirect)}
            className="px-6 py-3 bg-indigo-600 rounded-xl hover:bg-indigo-500 w-full"
          >
            Sign in to continue
          </button>
        )}

        {access === "not_whitelisted" && (
          <div className="space-y-3">
            <button
              onClick={async () => {
                try { await API.post("/b1/auth/logout"); } catch {}
                navigate(loginRedirect);
              }}
              className="px-6 py-3 bg-amber-600 rounded-xl hover:bg-amber-500 w-full"
            >
              Login with another account
            </button>

            <div className="text-xs text-gray-500">
              The current account does not have permission to access this poll
            </div>
          </div>
        )}

      </div>
    </div>
  );
}


// ---------- NORMAL POLL VIEW ----------
return (
  <div className="min-h-screen bg-[#0b0f19] text-white p-6">
    <div className="max-w-2xl mx-auto space-y-6">

      <h1 className="text-3xl font-semibold text-center">
        {poll?.content?.question}
      </h1>

      {poll?.behavior?.show_live_results && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <span className={`w-2 h-2 rounded-full ${
            ws?.status === "open" ? "bg-green-400 animate-pulse" : "bg-gray-500"
          }`} />
          {ws?.status === "open"
            ? <span>Live · {ws.viewers} watching</span>
            : <span>Connecting...</span>}
        </div>
      )}

      <div className="space-y-3">
        {poll?.content?.options?.map(opt => (
          <button
            key={opt.option_id}
            disabled={!poll.viewer?.can_vote}
            onClick={() => setSelected(opt.option_id)}
            className={`w-full text-left px-4 py-3 rounded-xl border transition
              ${selected === opt.option_id
                ? "bg-indigo-600/40 border-indigo-400"
                : "bg-white/10 border-white/10 hover:bg-white/20"}`}
          >
            {opt.text}

            {poll.viewer?.can_view_results && (
              <span className="float-right text-sm text-gray-300">
                {opt.votes ?? 0} votes
              </span>
            )}
          </button>
        ))}
      </div>

      {poll.viewer?.can_vote && (
        <>
          <button
            onClick={submitVote}
            disabled={!selected || voting}
            className="w-full py-3 bg-indigo-600 rounded-xl hover:bg-indigo-500 disabled:opacity-40"
          >
            {voting ? "Submitting vote..." : "Submit Vote"}
          </button>

          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}
          {success && (
            <div className="text-green-400 text-sm text-center">{success}</div>
          )}
        </>
      )}

    </div>
  </div>
);
}
