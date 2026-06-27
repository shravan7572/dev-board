import axios from "axios"

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const signin = (data) =>
    axios.post(`${BASE_URL}/api/auth/signup`, data)

export const login = (data) =>
    axios.post(`${BASE_URL}/api/auth/login`, data)
