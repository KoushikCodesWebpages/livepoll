import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { router } from "./app/router"
import { AuthProvider } from "./hooks/useAuth.jsx"
import "./index.css"
import ToastProvider from "./components/ui/ToastProvider"
import GlobalLoaderProvider from "./components/ui/GlobalLoader"


ReactDOM.createRoot(document.getElementById("root")).render(
<React.StrictMode> 
    <AuthProvider>
    <GlobalLoaderProvider>
        <ToastProvider>
        <RouterProvider router={router} />
        </ToastProvider>
    </GlobalLoaderProvider>
    </AuthProvider>
</React.StrictMode>
)
