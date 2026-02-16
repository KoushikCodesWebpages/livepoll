import { Link } from "react-router-dom"

export default function Landing() {
return ( 
<div className="min-h-screen bg-[#0b0f19] text-white">
  {/* NAVBAR */}
  <nav className="flex justify-between items-center px-6 md:px-20 py-5 border-b border-white/10">
    <h1 className="text-xl font-semibold tracking-wide">
      LivePoll
    </h1>

    <div className="flex items-center gap-6 text-sm">
      <a href="#features" className="text-gray-300 hover:text-white">Features</a>
      <a href="#how" className="text-gray-300 hover:text-white">How it works</a>

      <Link to="/login" className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20">
        Login
      </Link>

      <Link to="/signup" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500">
        Start Free
      </Link>
    </div>
  </nav>


  {/* HERO */}
  <section className="text-center py-28 px-6">
    <h2 className="text-5xl md:text-6xl font-bold leading-tight">
      Run polls in real time.
      <br />
      <span className="text-indigo-400">See votes instantly.</span>
    </h2>

    <p className="mt-6 text-gray-400 max-w-2xl mx-auto text-lg">
      Create interactive polls for classrooms, meetings, streams, or communities.
      No refresh. No delay. Just live feedback.
    </p>

    <div className="mt-10 flex justify-center gap-4">
      <Link
        to="/signup"
        className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-lg font-medium"
      >
        Create a Poll
      </Link>

      <Link
        to="/login"
        className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-lg"
      >
        Join a Poll
      </Link>
    </div>
  </section>


  {/* FEATURES */}
  <section id="features" className="max-w-6xl mx-auto px-6 py-20">
    <h3 className="text-3xl font-semibold text-center mb-14">Features</h3>

    <div className="grid md:grid-cols-3 gap-8">

      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <h4 className="text-xl font-semibold mb-3">Realtime Voting</h4>
        <p className="text-gray-400">
          Watch vote counts update instantly for every participant — no refresh required.
        </p>
      </div>

      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <h4 className="text-xl font-semibold mb-3">Shareable Links</h4>
        <p className="text-gray-400">
          Send a simple link and anyone can vote using a secure access token.
        </p>
      </div>

      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <h4 className="text-xl font-semibold mb-3">Anonymous Mode</h4>
        <p className="text-gray-400">
          Collect honest feedback with optional anonymous participation.
        </p>
      </div>

    </div>
  </section>


  {/* HOW IT WORKS */}
  <section id="how" className="bg-white/5 py-20 px-6">
    <div className="max-w-5xl mx-auto text-center">

      <h3 className="text-3xl font-semibold mb-14">How it works</h3>

      <div className="grid md:grid-cols-3 gap-10 text-left">

        <div>
          <div className="text-indigo-400 text-2xl font-bold mb-2">1</div>
          <h4 className="text-lg font-semibold">Create</h4>
          <p className="text-gray-400 mt-2">
            Add a question and options in seconds.
          </p>
        </div>

        <div>
          <div className="text-indigo-400 text-2xl font-bold mb-2">2</div>
          <h4 className="text-lg font-semibold">Share</h4>
          <p className="text-gray-400 mt-2">
            Send the link to participants anywhere.
          </p>
        </div>

        <div>
          <div className="text-indigo-400 text-2xl font-bold mb-2">3</div>
          <h4 className="text-lg font-semibold">Watch Live</h4>
          <p className="text-gray-400 mt-2">
            Results update instantly as votes come in.
          </p>
        </div>

      </div>
    </div>
  </section>


  {/* CTA */}
  <section className="text-center py-24 px-6">
    <h3 className="text-4xl font-bold">
      Start collecting live feedback today
    </h3>

    <p className="text-gray-400 mt-4">
      Free to use. No installation required.
    </p>

    <Link
      to="/signup"
      className="inline-block mt-8 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-lg font-medium"
    >
      Create your first poll
    </Link>
  </section>


  {/* FOOTER */}
  <footer className="border-t border-white/10 py-8 text-center text-gray-500 text-sm">
    © {new Date().getFullYear()} LivePoll. All rights reserved.
  </footer>

</div>

)
}
