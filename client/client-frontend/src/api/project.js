import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL

const getoken = () => localStorage.getItem("token")

export const getproject = (username) =>
    axios.get(`${BASE_URL}/api/project/${username}`)

export const addproject = (data) =>
    axios.post(`${BASE_URL}/api/project`, data, {
        headers: {
            token: getoken()
        }
    })

export const updatedproject = (id) =>
    axios.put(`${BASE_URL}/api/project/update${id}`, {
        headers: {
            token: getoken()
        }
    })

export const deleteproject = (id) =>
    axios.delete(`${BASE_URL}/api/project/${id}`, {
        headers: {
            token: getoken()
        }
    })
