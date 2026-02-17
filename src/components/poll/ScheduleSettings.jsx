import CardSection from "../ui/CardSection"
import Select from "../ui/Select"
import { useEffect } from "react"

export default function ScheduleSettings({ form, update }) {

  // ---------- defaults ----------
  useEffect(() => {
    if (!form.start_mode) update("start_mode", "now")
    if (!form.end_mode) update("end_mode", "hours")
  }, [])

  const number = (v) => Math.max(1, Number(v || 1))

  // ---------- compute start preview ----------
  const computeStartPreview = () => {

    const now = new Date()
    const n = (v) => Math.max(1, Number(v || 1))

    switch (form.start_mode) {
      case "minutes":
        return new Date(now.getTime() + n(form.start_value) * 60000)

      case "hours":
        return new Date(now.getTime() + n(form.start_value) * 3600000)

      case "days":
        return new Date(now.getTime() + n(form.start_value) * 86400000)

      case "date":
        return form.start_date ? new Date(form.start_date) : now

      default:
        return now
    }
  }

  const startPreview = computeStartPreview()

  // ---------- auto fix end when start changes ----------
  useEffect(() => {

    if (form.end_mode !== "date") return
    if (!form.end_date) return

    const end = new Date(form.end_date)

    if (end <= startPreview) {
      const fixed = new Date(startPreview.getTime() + 60000)
      update("end_date", fixed.toISOString().slice(0,16))
    }

  }, [form.start_mode, form.start_value, form.start_date])

  return (
    <CardSection title="Schedule">

      {/* ================= START ================= */}
      <div className="space-y-3">
        <label className="text-sm text-gray-400">Start time</label>

        <div className="flex flex-col sm:flex-row gap-2">

          <Select
            value={form.start_mode}
            onChange={(v) => update("start_mode", v)}
            options={[
              { value: "now", label: "Now" },
              { value: "minutes", label: "In minutes" },
              { value: "hours", label: "In hours" },
              { value: "days", label: "In days" },
              { value: "date", label: "Pick date" }
            ]}
          />

          {form.start_mode !== "now" && form.start_mode !== "date" && (
            <input
              type="number"
              min="1"
              value={form.start_value || 1}
              onChange={e => update("start_value", number(e.target.value))}
              className="w-full sm:w-32 p-3 rounded-lg bg-white/10 border border-white/10"
            />
          )}

          {form.start_mode === "date" && (
            <input
              type="datetime-local"
              value={form.start_date || ""}
              onChange={e => update("start_date", e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/10"
            />
          )}

        </div>
      </div>


      {/* ================= END ================= */}
      <div className="space-y-3 mt-6">
        <label className="text-sm text-gray-400">End time</label>

        <div className="flex flex-col sm:flex-row gap-2">

          <Select
            value={form.end_mode}
            onChange={(v) => update("end_mode", v)}
            options={[
              { value: "minutes", label: "After minutes" },
              { value: "hours", label: "After hours" },
              { value: "days", label: "After days" },
              { value: "date", label: "Pick date" }
            ]}
          />

          {form.end_mode !== "date" && (
            <input
              type="number"
              min="1"
              value={form.end_value || 1}
              onChange={e => update("end_value", number(e.target.value))}
              className="w-full sm:w-32 p-3 rounded-lg bg-white/10 border border-white/10"
            />
          )}

          {form.end_mode === "date" && (
            <input
              type="datetime-local"
              value={form.end_date || ""}
              onChange={e => update("end_date", e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/10"
            />
          )}

        </div>

        {/* live preview */}
        <p className="text-xs text-indigo-400">
          Poll will end {form.end_value || 1} {form.end_mode} after start
        </p>

        <p className="text-xs text-gray-500">
          Poll must last at least 1 minute
        </p>

      </div>

    </CardSection>
  )
}

export function computeSchedule(form) {

  const now = new Date()

  const parseNum = (v) => Math.max(1, Number(v || 1))

  let start = new Date(now)

  // ---------- START ----------
  switch (form.start_mode) {

    case "minutes":
      start = new Date(now.getTime() + parseNum(form.start_value) * 60000)
      break

    case "hours":
      start = new Date(now.getTime() + parseNum(form.start_value) * 3600000)
      break

    case "days":
      start = new Date(now.getTime() + parseNum(form.start_value) * 86400000)
      break

    case "date":
      if (!form.start_date) throw new Error("Start date required")
      start = new Date(form.start_date)
      break

    default:
      start = now
  }

  if (isNaN(start.getTime()))
    throw new Error("Invalid start time")

  // ---------- END ----------
  let end = new Date(start)

  switch (form.end_mode) {

    case "minutes":
      end = new Date(start.getTime() + parseNum(form.end_value) * 60000)
      break

    case "hours":
      end = new Date(start.getTime() + parseNum(form.end_value) * 3600000)
      break

    case "days":
      end = new Date(start.getTime() + parseNum(form.end_value) * 86400000)
      break

    case "date":
      if (!form.end_date) throw new Error("End date required")
      end = new Date(form.end_date)
      break

    default:
      end = new Date(start.getTime() + 3600000)
  }

  if (isNaN(end.getTime()))
    throw new Error("Invalid end time")

  // ---------- AUTO CORRECTIONS ----------

  // End must be after start
  if (end <= start)
    end = new Date(start.getTime() + 60000)

  // Minimum runtime: 1 min
  if ((end - start) < 60000)
    end = new Date(start.getTime() + 60000)

  // Scheduled polls must stay alive at least 2 min
  if (start > now && (end - start) < 120000)
    end = new Date(start.getTime() + 120000)

  // Prevent "ends immediately after appearing"
  if (start - now > 0 && end - now < 60000)
    end = new Date(start.getTime() + 60000)

  return {
    start_at: start.toISOString(),
    expires_at: end.toISOString()
  }
}
