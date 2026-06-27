import axios from "axios"

const BASE_URL = import.meta.env.VITE_BASE_URL

export const sendContact = (username, data) =>
    axios.post(`${BASE_URL}/api/contact/${username}`, data)