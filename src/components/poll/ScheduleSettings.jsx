import CardSection from "../ui/CardSection"
import Select from "../ui/Select"

export default function ScheduleSettings({ form, update }) {

  return (
    <CardSection title="Schedule">

      {/* START */}
      <div className="space-y-3">
        <label className="text-sm text-gray-400">Start</label>

        <div className="flex gap-2 flex-wrap">

          <Select
            value={form.start_mode}
            onChange={(v) => update("start_mode", v)}
            options={[
              { value: "now", label: "Now" },
              { value: "minutes", label: "In minutes" },
              { value: "hours", label: "In hours" },
              { value: "days", label: "In days" },
              { value: "date", label: "Specific time" }
            ]}
          />

          {form.start_mode !== "now" && form.start_mode !== "date" && (
            <input
              type="number"
              min="1"
              value={form.start_value || ""}
              onChange={e => update("start_value", e.target.value)}
              placeholder="amount"
              className="w-28 p-3 rounded-lg bg-white/10 border border-white/10"
            />
          )}

          {form.start_mode === "date" && (
            <input
              type="datetime-local"
              value={form.start_date || ""}
              onChange={e => update("start_date", e.target.value)}
              className="p-3 rounded-lg bg-white/10 border border-white/10"
            />
          )}

        </div>
      </div>


      {/* END */}
      <div className="space-y-3 mt-6">
        <label className="text-sm text-gray-400">End</label>

        <div className="flex gap-2 flex-wrap">

          <Select
            value={form.end_mode}
            onChange={(v) => update("end_mode", v)}
            options={[
              { value: "minutes", label: "After minutes" },
              { value: "hours", label: "After hours" },
              { value: "days", label: "After days" },
              { value: "date", label: "Until time" }
            ]}
          />

          {form.end_mode !== "date" && (
            <input
              type="number"
              min="1"
              value={form.end_value || ""}
              onChange={e => update("end_value", e.target.value)}
              placeholder="amount"
              className="w-28 p-3 rounded-lg bg-white/10 border border-white/10"
            />
          )}

          {form.end_mode === "date" && (
            <input
              type="datetime-local"
              value={form.end_date || ""}
              onChange={e => update("end_date", e.target.value)}
              className="p-3 rounded-lg bg-white/10 border border-white/10"
            />
          )}

        </div>
      </div>

    </CardSection>
  )
}

export function computeSchedule(form) {
  const now = new Date()
  let start = new Date(now)

  // start
  if (form.start_mode === "minutes")
    start = new Date(now.getTime() + form.start_value * 60000)

  if (form.start_mode === "hours")
    start = new Date(now.getTime() + form.start_value * 3600000)

  if (form.start_mode === "days")
    start = new Date(now.getTime() + form.start_value * 86400000)

  if (form.start_mode === "date")
    start = new Date(form.start_date)

  // end
  let end = new Date(start)

  if (form.end_mode === "minutes")
    end = new Date(start.getTime() + form.end_value * 60000)

  if (form.end_mode === "hours")
    end = new Date(start.getTime() + form.end_value * 3600000)

  if (form.end_mode === "days")
    end = new Date(start.getTime() + form.end_value * 86400000)

  if (form.end_mode === "date")
    end = new Date(form.end_date)

  return {
    start_at: start.toISOString(),
    expires_at: end.toISOString()
  }
}