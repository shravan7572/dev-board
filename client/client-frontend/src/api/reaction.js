import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL

const getoken = () => localStorage.getItem("token")

export const getreaction = (username) =>
    axios.get(`${BASE_URL}/api/reaction/${username}`)

export const addreaction = (username,type) =>
    axios.post(`${BASE_URL}/api/reaction/${username}`, data, {type})
