import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getreaction = (username, visitorId) =>
    axios.get(`${BASE_URL}/api/reaction/${username}`, { params: { visitorId } });

export const addreaction = (username, type, visitorId) =>
    axios.post(`${BASE_URL}/api/reaction/${username}`, { type, visitorId });
