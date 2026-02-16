export default function CardSection({ title, children }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {children}
    </div>
  )
}