import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import Dashboard from "./pages/dashboard"
import Landing from "./pages/landing"
import Profilepage from "./pages/publicprofile"
import NotFound404 from"./pages/404page"

    function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token")
    const navigate = useNavigate()

    if(!token) {
        navigate("/")
        return null
    }

    return children
}

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                    <Dashboard />
                    </ProtectedRoute>} />
                <Route path="/:username" element={<Profilepage />} />
                <Route path="*" element={<NotFound404 />} />
            </Routes>


        </BrowserRouter>
    )
}

export default App