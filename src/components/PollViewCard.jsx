import { ArrowLeft, Pencil, Globe, Lock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ToggleBadge from "../components/ui/ToggleBadge";
import { useMemo } from "react";

export default function PollViewCard({ poll }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isOwner = user?.id === poll?.owner_id;

  // ---------- ACCESS TYPE RESOLVER ----------
const accessType = useMemo(() => {
  const access = poll?.access;
  if (!access) return "public";

  const v = (access.visibility || "").toLowerCase();
  const hasEmails = Array.isArray(access.allowed_emails) && access.allowed_emails.length > 0;
  const requireLogin = access.require_login === true;

  // WHITELIST (email list present)
  if (hasEmails) return "whitelisted";

  // PRIVATE (not public AND not authenticated AND not whitelist)
  if (
    !requireLogin &&
    v !== "public" &&
    v !== "" &&
    !v.includes("auth")
  ) return "private";

  // AUTHENTICATED USERS
  if (requireLogin || v.includes("auth")) return "authenticated";

  return "public";
}, [poll]);

  const accessConfig = {
    public: {
      label: "Public",
      icon: Globe,
      style: "bg-green-500/20 text-green-300 border-green-400/30",
    },
    authenticated: {
      label: "Login Required",
      icon: Users,
      style: "bg-blue-500/20 text-blue-300 border-blue-400/30",
    },
    private: {
      label: "Private",
      icon: Lock,
      style: "bg-red-500/20 text-red-300 border-red-400/30",
    },
    whitelisted: {
      label: "Whitelisted",
      icon: Users,
      style: "bg-yellow-500/20 text-yellow-300 border-yellow-400/30",
    },
  };

  const AccessIcon = accessConfig[accessType].icon;

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate("/home", { replace: true })}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {isOwner && (
          <button
            onClick={() => navigate(`/edit/${poll?.poll_id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition"
          >
            <Pencil size={16} />
            Edit
          </button>
        )}
      </div>

      {/* QUESTION CARD */}
      <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/10 border border-white/10 rounded-2xl p-6">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <h1 className="text-3xl font-semibold">
            {poll?.content?.question}
          </h1>

          <span
            className={`flex items-center gap-1 px-3 py-1 text-xs rounded-full border ${accessConfig[accessType].style}`}
          >
            <AccessIcon size={12} />
            {accessConfig[accessType].label}
          </span>
        </div>

        {/* OPTIONS */}
        <div className="space-y-3">
          {poll?.content?.options?.length ? (
            poll.content.options.map(opt => (
              <div
                key={opt.option_id}
                className="flex justify-between items-center px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
              >
                <span>{opt.text}</span>
                <span className="text-sm text-gray-300">
                  {opt.votes ?? 0} votes
                </span>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-sm">No options available</div>
          )}
        </div>
      </div>

      {/* SETTINGS PANELS */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* VOTING RULES */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
          <h3 className="text-lg font-semibold">Voting Rules</h3>

          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Max votes per user</span>
            <span className="font-medium">
              {poll?.vote?.max_votes_per_user ?? 1}
            </span>
          </div>

          <ToggleBadge label="Allow change vote" value={poll?.vote?.allow_change_vote} />
          <ToggleBadge label="Anonymous voting" value={poll?.vote?.anonymous_vote} />
          <ToggleBadge label="Unique session" value={poll?.vote?.unique_session} />
          <ToggleBadge label="Unique IP" value={poll?.vote?.unique_ip} />
        </div>

        {/* BEHAVIOR & ANALYTICS */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
          <h3 className="text-lg font-semibold">Behavior & Tracking</h3>

          <ToggleBadge label="Auto close" value={poll?.behavior?.auto_close} />
          <ToggleBadge label="Live results" value={poll?.behavior?.show_live_results} />
          <ToggleBadge label="Track views" value={poll?.analytics?.track_views} />
          <ToggleBadge label="Fraud detection" value={poll?.analytics?.fraud_detection} />
        </div>

      </div>

      {/* META FOOTER */}
      <div className="text-xs text-gray-500 text-center pt-4 border-t border-white/10">
        Created {poll?.meta?.created_at
          ? new Date(poll.meta.created_at).toLocaleString()
          : "—"} •
        Total votes {poll?.meta?.total_votes ?? 0} •
        Views {poll?.meta?.total_views ?? 0}
      </div>

    </div>
  );
}
