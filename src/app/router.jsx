import { createBrowserRouter } from "react-router-dom"
import Protected from "./protected"
import { API } from "../api/client"

// public
import Landing from "../pages/public/Landing"
import Login from "../pages/public/Login"
import Signup from "../pages/public/Signup"

// dashboard
import Home from "../pages/dashboard/Home"
import CreatePoll from "../pages/dashboard/CreatePoll"
import EditPoll from "../pages/dashboard/EditPoll"
import SharePoll from "../pages/public/SharePoll"

// poll
import Poll from "../pages/poll/Poll"
import ShareVote from "../pages/poll/ShareVote"
import Result from "../pages/poll/Result"

import AppLayout from "../components/Layout"

// ---------- LOADER ----------
async function pollLoader({ params }) {
  const res = await API.get(`/b1/poll/${params.pollId}`)
  return {
    ...res.data.poll,
    viewer: res.data.viewer
  }
}


export const router = createBrowserRouter([
  // PUBLIC
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },

  // AUTHENTICATED APP
  {
    element: <AppLayout />,   // ⭐ THEME LAYER
    children: [
      {
        element: <Protected />,   // ⭐ AUTH LAYER
        children: [
          { path: "/home", element: <Home /> },
          { path: "/create", element: <CreatePoll /> },
          { path: "/edit/:pollId", element: <EditPoll />, loader: pollLoader },
          { path: "/poll/:pollId", element: <Poll />, loader: pollLoader },
          { path: "/share", element: <SharePoll /> },
          { path: "/results/:pollId", element: <Result /> }
        ]
      }
    ]
  },

  // PUBLIC SHARE PAGE (NO AUTH BUT STILL NEED THEME)
  {
    element: <AppLayout />,
    children: [
      { path: "/s/:pollId", element: <ShareVote />, loader: pollLoader }
    ]
  }
])