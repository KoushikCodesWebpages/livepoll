import { createBrowserRouter } from "react-router-dom"
import Protected from "./protected"

import Landing from "../pages/public/Landing"
import Login from "../pages/public/Login"
import Signup from "../pages/public/Signup"

import Home from "../pages/dashboard/Home"
import MyPolls from "../pages/dashboard/MyPolls"
import CreatePoll from "../pages/dashboard/CreatePoll"
import EditPoll from "../pages/dashboard/EditPoll"
import SharePoll from "../pages/dashboard/SharePoll"

import Poll from "../pages/poll/Poll"
import ShareVote from "../pages/poll/ShareVote"
import Result from "../pages/poll/Result"

export const router = createBrowserRouter([
{ path: "/", element: <Landing /> },
{ path: "/login", element: <Login /> },
{ path: "/signup", element: <Signup /> },

{
element: <Protected />,
children: [
{ path: "/home", element: <Home /> },
{ path: "/my-polls", element: <MyPolls /> },
{ path: "/create", element: <CreatePoll /> },
{ path: "/edit/:pollId", element: <EditPoll /> },
{ path: "/share/:pollId", element: <SharePoll /> },
{ path: "/poll/:pollId", element: <Poll /> },
{ path: "/results/:pollId", element: <Result /> }
]
},

{ path: "/s/:pollId", element: <ShareVote /> }
])
