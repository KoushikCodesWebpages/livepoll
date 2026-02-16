import CardSection from "../ui/CardSection"

export default function QuestionCard({ form, update }) {
  return (
    <CardSection title="Question">

      <input
        placeholder="Ask something..."
        value={form.question}
        onChange={e => update("question", e.target.value)}
        required
        className="w-full p-3 rounded-lg bg-white/10 border border-white/10 focus:border-indigo-500 outline-none"
      />

      <textarea
        placeholder="Optional description"
        value={form.description}
        onChange={e => update("description", e.target.value)}
        className="w-full p-3 rounded-lg bg-white/10 border border-white/10"
      />

    </CardSection>
  )
}
