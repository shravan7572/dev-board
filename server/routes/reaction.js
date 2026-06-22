const express = require("express");
const mongoose = require("mongoose");
const { reactionModel } = require("../models/reactionsdb");
const { UserModel } = require("../models/user");

const ReactionRoute = express.Router();

//counts the reactions using same logic in both routes
const getCounts = async (profileID) => {
    const [fireCount, heartCount, clapCount] = await Promise.all([
        reactionModel.countDocuments({ profileID, type: "fire" }),
        reactionModel.countDocuments({ profileID, type: "heart" }),
        reactionModel.countDocuments({ profileID, type: "clap" })
    ])
    return { fire: fireCount, heart: heartCount, clap: clapCount }
}

ReactionRoute.get("/:username", async function (req, res) {
    try {
        const username = req.params.username;

        const user = await UserModel.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const counts = await getCounts(user._id);
        res.json({ counts })
    }
    catch (e) {
        res.json({
            messgae: e.message
        })
    }
})

ReactionRoute.post("/:username", async function (req, res) {
    try {
        const username = req.params.username;

        const user = await UserModel.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const profileID =user._id.toString()
        const visitorID = req.ip;
        const { type } = req.body;

        console.log("visitorId:", req.ip)
console.log("type:", req.body.type)
console.log("user:", user)

        if (!["fire", "heart", "clap"].includes(type)) {
            return res.status(400).json({ message: "Invalid reaction type" })
        }

        const existing = await reactionModel.findOne({ profileID, visitorID, type })

        if (existing) {
            await reactionModel.deleteOne({ _id: existing._id })
        } else {
            await reactionModel.create({ profileID, visitorID, type })
        }

        const counts = await getCounts(profileID);
        res.json({ counts })
    }
    catch (e) {
        res.json({
            messgae: e.message
        })
    }


})






module.exports = ReactionRoute;