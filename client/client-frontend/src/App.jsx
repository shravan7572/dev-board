import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "./pages/dashboard"
import Landing from "./pages/landing"
import Profilepage from "./pages/publicprofile"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/:username" element={<Profilepage />} />
            </Routes>


        </BrowserRouter>
    )
}

export default App