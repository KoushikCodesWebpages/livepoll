import CardSection from "../ui/CardSection"
import Switch from "../ui/Switch"

export default function AdvancedSettings({ form, update, advanced }) {
  return (
    <div className={`transition-all duration-300 overflow-hidden ${advanced ? "max-h-[900px] opacity-100" : "max-h-0 opacity-0"}`}>
      <div className="space-y-6">

        <CardSection title="Behavior">
          <Switch label="Shuffle options"
            checked={form.randomize_options}
            onChange={v => update("randomize_options", v)}
          />

          <Switch label="Allow custom option"
            checked={form.allow_custom_option}
            onChange={v => update("allow_custom_option", v)}
          />

          <Switch label="Hide results until end"
            checked={form.hide_results_until_end}
            onChange={v => update("hide_results_until_end", v)}
          />

          <Switch label="Show voters"
            checked={form.show_voters}
            onChange={v => update("show_voters", v)}
          />

          <Switch label="Unique IP"
            checked={form.unique_ip}
            onChange={v => update("unique_ip", v)}
          />

          <Switch label="Auto close"
            checked={form.auto_close}
            onChange={v => update("auto_close", v)}
          />
        </CardSection>

        <CardSection title="Schedule">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="datetime-local"
              value={form.start_at}
              onChange={e => update("start_at", e.target.value)}
              className="p-3 rounded-lg bg-white/10 border border-white/10"
            />

            <input
              type="datetime-local"
              value={form.end_at}
              onChange={e => update("end_at", e.target.value)}
              className="p-3 rounded-lg bg-white/10 border border-white/10"
            />
          </div>
        </CardSection>

      </div>
    </div>
  )
}
