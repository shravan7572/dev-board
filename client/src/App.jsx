import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "./pages/dashboard"
import Landing from "./pages/landing"
import Profilepage from "./pages/publicprofile"
import NotFound404 from "./pages/404page"

function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token")
    if (!token) {
        return <Navigate to="/" replace />
    }
    return children
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route path="/:username" element={<Profilepage />} />
                <Route path="*" element={<NotFound404 />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App