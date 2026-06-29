const express = require("express");
const { Profileviewmodel } = require("../models/profileviewdb");
const { UserModel } = require("../models/user");
const { UAParser } = require("ua-parser-js");
const User_Auth = require("../middleware/User_Auth");

const Profileviewroute = express.Router();

Profileviewroute.get("/stats", User_Auth, async (req, res) => {
    try {
        const profileId = req.userid.toString();

        const totalviews = await Profileviewmodel.countDocuments({
            profileId,
        });

        const browserbreakdown = await Profileviewmodel.aggregate([
            { $match: { profileId } },
            { $group: { _id: "$browser", count: { $sum: 1 } } },
        ]);

        res.json({ totalviews, browserbreakdown });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

Profileviewroute.post("/:username", async function (req, res) {
    try {
        const username = req.params.username;

        const finduser = await UserModel.findOne({ username });
        if (!finduser) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const profileId = finduser._id.toString();
        const uaString = req.headers["user-agent"];
        const parser = new UAParser(uaString);
        const result = parser.getResult();

        const profiledata = new Profileviewmodel({
            profileId,
            browser: result.browser.name || "unknown",
            device: result.device.type || "desktop",
            os: result.os.name || "unknown",
        });

        await profiledata.save();

        res.status(200).json({
            success: true,
            message: "Activity logged successfully",
        });
    } catch (e) {
        res.status(500).json({
            message: e.message,
        });
    }
});

module.exports = Profileviewroute;
