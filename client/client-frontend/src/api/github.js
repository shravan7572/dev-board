import axios from "axios";
const BASE_URL=import.meta.env.VITE_BASE_URL

 export const getgithubdata=(githubUsername)=>
    axios.get(`${BASE_URL}/api/fetch/${githubUsername}`)