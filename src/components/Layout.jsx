import Navbar from "../components/Navbar"

import { Outlet } from "react-router-dom"


export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-white">
      <Navbar />

      {/* page spacing container */}
      <main className="px-4 pt-6 md:pt-8 pb-12">
        <Outlet />
      </main>
    </div>
  )
}