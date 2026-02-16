export default function SubmitBar({ loading, submit, mode = "create" }) {
  const isEdit = mode === "edit";

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0b0f19]/90 backdrop-blur border-t border-white/10 p-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={submit}
          disabled={loading}
          className="w-full py-3 bg-indigo-600 rounded-xl hover:bg-indigo-500 transition text-lg font-medium disabled:opacity-60"
        >
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
  );
}
