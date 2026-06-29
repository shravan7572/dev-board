const express = require("express");
const { UserModel } = require("../models/user");
const User_Auth = require("../middleware/User_Auth");
const { upload } = require("../utils/cloudinary");

const Profileroute = express.Router();

const PROFILE_FIELDS = ["githubUsername", "bio", "photo", "github", "linkedin", "twitter", "theme"];

Profileroute.post("/upload-avatar", User_Auth, upload.single("avatar"), async function (req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded" });
        }

        const image_url = req.file.path;
        await UserModel.findByIdAndUpdate(req.userid, {
            photo: image_url,
        });

        res.json({
            message: "Photo uploaded successfully",
            photo: image_url,
        });
    } catch (e) {
        res.status(500).json({
            message: e.message,
        });
    }
});

Profileroute.get("/:username", async (req, res) => {
    const username = req.params.username;

    try {
        const checktheusername = await UserModel.findOne({ username }).select("-password");

        if (!checktheusername) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.json({
            checktheusername,
        });
    } catch (e) {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
});

Profileroute.put("/", User_Auth, async (req, res) => {
    const updates = {};
    for (const field of PROFILE_FIELDS) {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    }

    try {
        const userprofile = await UserModel.findByIdAndUpdate(
            req.userid,
            updates,
            { new: true }
        ).select("-password");

        if (!userprofile) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ userprofile });
    } catch (e) {
        res.status(500).json({
            message: "Unable to update profile",
        });
    }
});

module.exports = Profileroute;
