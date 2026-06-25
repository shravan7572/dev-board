const express = require("express");
const axios = require("axios");

const GithubRoute = express.Router();
GithubRoute.get("/:githubUsername", async function (req, res) {
    try {
        const githubUsername = req.params.githubUsername;

        const [userResponse, reposResponse] = await Promise.all([
            axios.get(`https://api.github.com/users/${githubUsername}`, {
                headers: { "User-Agent": "DevBoard-App" }
            }),
            axios.get(`https://api.github.com/users/${githubUsername}/repos?sort=stars&per_page=6`, {
                headers: { "User-Agent": "DevBoard-App" }
            })
        ])

        const { name, avatar_url, bio, public_repos, followers, following } = userResponse.data

        const repos = reposResponse.data.map(repo => ({
            name: repo.name,
            description: repo.description,
            stars: repo.stargazers_count,
            language: repo.language,
            url: repo.html_url
        }))

        return res.status(200).json({
            name,
            avatar_url,
            bio,
            public_repos,
            followers,
            following, repos
        });

    } catch (e) {
        if (e.response && e.response.status === 404) {
            return res.status(404).json({ message: "GitHub account not found on GitHub servers." });
        }
        return res.status(500).json({ message: e.message });
    }
});







module.exports = GithubRoute;