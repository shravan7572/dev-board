import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL

const getToken = () => localStorage.getItem("token")

export const getprofile = (username) =>
    axios.get(`${BASE_URL}/api/profile/${username}`)

export const updateprofle = (data) =>
    axios.put(`${BASE_URL}/api/profile`, data, {
        headers: {
            token: getToken()
        }
    })

// Issue 2 fix: wires the existing POST /api/profile/upload-avatar backend route
export const uploadAvatar = (file) => {
    const formData = new FormData()
    formData.append("avatar", file)
    return axios.post(`${BASE_URL}/api/profile/upload-avatar`, formData, {
        headers: {
            token: getToken(),
            "Content-Type": "multipart/form-data",
        },
    })
}
