#!/usr/bin/env bash
set -e


################################

# TAILWIND CONFIG

################################
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
theme: { extend: {} },
plugins: [],
}
EOF

cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

################################

# MAIN ROUTER ENTRY

################################
cat > src/main.jsx << 'EOF'
import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { router } from "./app/router"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
<React.StrictMode> <RouterProvider router={router} />
</React.StrictMode>
)
EOF

################################

# FOLDERS

################################
mkdir -p src/app
mkdir -p src/pages/public
mkdir -p src/pages/dashboard
mkdir -p src/pages/poll
mkdir -p src/components/layout
mkdir -p src/components/poll
mkdir -p src/components/ui
mkdir -p src/hooks
mkdir -p src/api
mkdir -p public

################################

# PROTECTED ROUTE

################################
cat > src/app/protected.jsx << 'EOF'
import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export default function Protected() {
const { user, loading } = useAuth()

if (loading) return <div className="p-10">Loading...</div>
if (!user) return <Navigate to="/login" replace />

return <Outlet />
}
EOF

################################

# ROUTER

################################
cat > src/app/router.jsx << 'EOF'
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
EOF

################################

# HOOKS

################################
echo 'export const useAuth = () => ({ user: null, loading: false })' > src/hooks/useAuth.js
echo 'export const useSocket = () => ({})' > src/hooks/useSocket.js

################################

# API CLIENT

################################
echo 'export default {}' > src/api/client.js

################################

# PLACEHOLDER PAGES

################################
pages=(
"public/Landing"
"public/Login"
"public/Signup"
"dashboard/Home"
"dashboard/MyPolls"
"dashboard/CreatePoll"
"dashboard/EditPoll"
"dashboard/SharePoll"
"poll/Poll"
"poll/ShareVote"
"poll/Result"
)

for page in "${pages[@]}"; do
path="src/pages/$page.jsx"
name=$(basename $page)
mkdir -p "$(dirname $path)"
echo "export default function $name(){return <div className='p-10'>$name Page</div>}" > $path
done

################################

# NETLIFY SPA REDIRECT

################################
echo "/* /index.html 200" > public/_redirects

echo ""
echo "Frontend structure ready!"
echo "Run: npm run dev"
echo "Open: http://localhost:3000"
