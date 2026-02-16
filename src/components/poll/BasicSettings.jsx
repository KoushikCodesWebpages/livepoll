import CardSection from "../ui/CardSection"
import Switch from "../ui/Switch"
import Select from "../ui/Select"

export default function BasicSettings({ form, update }) {
  return (
    <CardSection title="Basic Settings">

      <Select
        value={form.visibility}
        onChange={(v) => update("visibility", v)}
        options={[
          { value: "public", label: "Public" },
          { value: "authenticated", label: "Authenticated users" },
          { value: "whitelist", label: "Email whitelist" },
          { value: "link", label: "Private link" }
        ]}
      />

      {form.visibility === "whitelist" && (
        <input
          placeholder="comma separated emails"
          value={form.allowed_emails}
          onChange={e => update("allowed_emails", e.target.value)}
          className="w-full p-3 rounded-lg bg-white/10 border border-white/10"
        />
      )}

      <Switch
        label="Allow vote change"
        checked={form.allow_change}
        onChange={v => update("allow_change", v)}
      />

      <Switch
        label="Anonymous voting"
        checked={form.anonymous}
        onChange={v => update("anonymous", v)}
      />

    </CardSection>
  )
}
