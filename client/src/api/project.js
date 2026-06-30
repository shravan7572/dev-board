import axios from "axios"
const BASE_URL = import.meta.env.VITE_BASE_URL

const getToken = () => localStorage.getItem("token")  // ← fix capital T

export const getproject = (username) =>
    axios.get(`${BASE_URL}/api/project/${username}`)  // ← matches backend ✅

export const addproject = (data) =>
    axios.post(`${BASE_URL}/api/project`, data, {
        headers: { 
            token: getToken(),  // ← fixed!
            "Content-Type": "multipart/form-data"
        }
    })

export const updatedproject = (id, data) =>
    axios.put(`${BASE_URL}/api/project/update/${id}`, data, {
        headers: { 
            token: getToken(),
            "Content-Type": "multipart/form-data"
        }
    })

export const deleteproject = (id) =>
    axios.delete(`${BASE_URL}/api/project/${id}`, {
        headers: { token: getToken() }
    })