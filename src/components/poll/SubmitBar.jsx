export default function SubmitBar({
  loading,
  submit,
  mode = "create",
  disabled = false,
  reason = ""
}) {

  const isEdit = mode === "edit"
  const isBlocked = loading || disabled

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0b0f19]/90 backdrop-blur border-t border-white/10 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">

      <div className="max-w-3xl mx-auto space-y-2">

        {/* REASON */}
        {disabled && !loading && (
          <div className="text-center text-sm text-red-400">
            {reason}
          </div>
        )}

        <button
          onClick={submit}
          disabled={isBlocked}
          className={`w-full py-3 rounded-xl text-lg font-medium transition flex items-center justify-center gap-2
            ${isBlocked
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500 text-white"}
          `}
        >

          {/* LOADING SPINNER */}
          {loading && (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}

          {loading
            ? isEdit
              ? "Updating poll..."
              : "Creating poll..."
            : isEdit
              ? "Update Poll"
              : "Create Poll"}
        </button>

      </div>
    </div>
  )
}
