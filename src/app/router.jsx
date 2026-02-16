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


// ---------- LOADER ----------
async function pollLoader({ params }) {
  const res = await API.get(`/b1/poll/${params.pollId}`)
  return res.data
}

export const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },

  {
    element: <Protected />,
    children: [
      { path: "/home", element: <Home /> },
      { path: "/create", element: <CreatePoll /> },

      // ⭐ now data loads BEFORE render
      { path: "/edit/:pollId", element: <EditPoll />, loader: pollLoader },
      { path: "/poll/:pollId", element: <Poll />, loader: pollLoader },

      { path: "/share", element: <SharePoll /> },
      { path: "/results/:pollId", element: <Result /> }
    ]
  },

  { path: "/s/:pollId", element: <ShareVote />, loader: pollLoader }
])
