import CardSection from "../ui/CardSection"
import Switch from "../ui/Switch"
import Select from "../ui/Select"

export default function BasicSettings({ form, update }) {

  // -------- SAFE UI VALUES --------
  const visibility = form.visibility ?? "public"
  const allowedEmails = form.allowed_emails ?? ""
  const showLive = form.show_live_results ?? false
  const allowChange = form.allow_change ?? true
  const anonymous = form.anonymous ?? true

  // -------- HANDLERS --------
  const handleVisibility = (v) => {
    update("visibility", v)

    // clean whitelist if not needed
    if (v !== "whitelist") update("allowed_emails", "")
  }

  const handleEmails = (e) => {
    // normalize input → prevent trailing commas crash backend
    const clean = e.target.value
      .replace(/\s+/g, " ")
      .replace(/,,+/g, ",")
    update("allowed_emails", clean)
  }

  const handleLiveResults = (v) => {
    update("show_live_results", v)
    update("hide_results_until_end", !v) // keep consistent
  }

  return (
    <CardSection title="Basic Settings">

      {/* VISIBILITY */}
      <Select
        value={visibility}
        onChange={handleVisibility}
        options={[
          { value: "public", label: "Public" },
          { value: "authenticated", label: "Authenticated users" },
          { value: "whitelisted", label: "Email whitelist" },
          { value: "private", label: "Private link" }
        ]}
      />

      {/* WHITELIST */}
      {visibility === "whitelisted" && (
        <input
          placeholder="email1@mail.com, email2@mail.com"
          value={allowedEmails}
          onChange={handleEmails}
          className="w-full p-3 rounded-lg bg-white/10 border border-white/10 focus:border-indigo-500 outline-none"
        />
      )}

      {/* LIVE RESULTS */}
      <Switch
        label="Live results"
        description="Show results immediately after voting"
        checked={showLive}
        onChange={handleLiveResults}
      />

      {/* ALLOW CHANGE */}
      <Switch
        label="Allow vote change"
        checked={allowChange}
        onChange={(v) => update("allow_change", v)}
      />

      {/* ANONYMOUS */}
      <Switch
        label="Anonymous voting"
        checked={anonymous}
        onChange={(v) => update("anonymous", v)}
      />

    </CardSection>
  )
}
