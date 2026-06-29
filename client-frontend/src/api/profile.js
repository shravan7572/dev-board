import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL

const getoken = () => localStorage.getItem("token")

export const getprofile = (username) =>
    axios.get(`${BASE_URL}/api/profile/${username}`)

export const updateprofle = (data) =>
    axios.put(`${BASE_URL}/api/profile`, data, {
        headers: {
            token: getoken()
        }
    })
