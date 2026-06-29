import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export function extractGithubUsername(github) {
    if (!github) return null;
    const trimmed = github.trim();
    if (!trimmed.includes("/")) return trimmed;
    const match = trimmed.match(/github\.com\/([^/?#]+)/i);
    return match ? match[1] : trimmed;
}

export const getgithubdata = (githubUsername) =>
    axios.get(`${BASE_URL}/api/fetch/${githubUsername}`);
