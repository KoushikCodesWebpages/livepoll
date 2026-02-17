import CardSection from "../ui/CardSection"
import Switch from "../ui/Switch"
import { useEffect } from "react"

export default function AdvancedSettings({ form, update, advanced }) {

  // hydrate defaults ONLY when user opens advanced
  useEffect(() => {
    if (!advanced) return

    const defaults = {
      randomize_options: false,
      allow_custom_option: false,
      hide_results_until_end: false,
      show_voters: false,
      unique_ip: false,
      auto_close: false
    }

    Object.entries(defaults).forEach(([key, value]) => {
      if (form[key] === undefined) update(key, value)
    })

  }, [advanced])

  return (
    <div className={`transition-all duration-300 overflow-hidden ${advanced ? "max-h-[900px] opacity-100" : "max-h-0 opacity-0"}`}>
      <div className="space-y-6">

        <CardSection title="Behavior">

          <Switch
            label="Shuffle options"
            checked={!!form.randomize_options}
            onChange={v => update("randomize_options", v)}
          />

          <Switch
            label="Allow custom option"
            checked={!!form.allow_custom_option}
            onChange={v => update("allow_custom_option", v)}
          />

          <Switch
            label="Hide results until end"
            checked={!!form.hide_results_until_end}
            onChange={v => update("hide_results_until_end", v)}
          />

          <Switch
            label="Show voters"
            checked={!!form.show_voters}
            onChange={v => update("show_voters", v)}
          />

          <Switch
            label="Unique IP"
            checked={!!form.unique_ip}
            onChange={v => update("unique_ip", v)}
          />

          <Switch
            label="Auto close"
            checked={!!form.auto_close}
            onChange={v => update("auto_close", v)}
          />

        </CardSection>

      </div>
    </div>
  )
}
