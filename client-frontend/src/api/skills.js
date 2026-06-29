import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL

const getoken = () => localStorage.getItem("token")

export const getskills = (username) =>
    axios.get(`${BASE_URL}/api/skill/${username}`)

export const addskills = (data) =>
    axios.post(`${BASE_URL}/api/skill`, data, {
        headers: {
            token: getoken()
        }
    })

export const deleteskills = (id) =>
    axios.delete(`${BASE_URL}/api/skill/${id}`, {
        headers: {
            token: getoken()
        }
    })
