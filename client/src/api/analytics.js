import axios from "axios"

const BASE_URL = import.meta.env.VITE_BASE_URL
const getToken = () => localStorage.getItem("token")

export const trackView = (username) =>
    axios.post(`${BASE_URL}/api/view/${username}`)

export const getStats = () =>
    axios.get(`${BASE_URL}/api/view/stats`, {
        headers: { token: getToken() }
    })