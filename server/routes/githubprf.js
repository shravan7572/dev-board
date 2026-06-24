const express = require("express");
const axios = require("axios");

const GithubRoute = express.Router();
GithubRoute.get("/:githubUsername", async function (req, res) {
    try {
        const githubUsername = req.params.githubUsername;
        
        const response = await axios.get(`https://api.github.com/users/${githubUsername}`, {
            headers: {
                "User-Agent": "DevBoard-App"
            }
        })

        const {
            name,
            avatar_url,
            bio,
            public_repos,
            followers,
            following
        } = response.data;

        return res.status(200).json({
            name,
            avatar_url,
            bio,
            public_repos,
            followers,
            following
        });

    } catch (e) {
        if (e.response && e.response.status === 404) {
            return res.status(404).json({ message: "GitHub account not found on GitHub servers." });
        }
        return res.status(500).json({ message: e.message });
    }
});







module.exports = GithubRoute;