import axios from "axios"

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const signup = (data) =>
   axios.post(`${BASE_URL}/api/auth/signup`, data)
export const login = (data) =>{
     return axios.post(`${BASE_URL}/api/auth/login`, data)
}
export const verifyOtp = (data) =>
   axios.post(`${BASE_URL}/api/auth/otp-verify`, data)
export const resendOtp = (data) =>
   axios.post(`${BASE_URL}/api/auth/resend-otp`, data)