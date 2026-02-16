export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <div className="w-10 h-10 border-4 border-white/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
      <span className="text-sm">{text}</span>
    </div>
  )
}
