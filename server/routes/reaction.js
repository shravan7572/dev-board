const express = require("express");
const { reactionModel } = require("../models/reactionsdb");
const { UserModel } = require("../models/user");

const ReactionRoute = express.Router();

const getCounts = async (profileID) => {
    const [fireCount, heartCount, clapCount] = await Promise.all([
        reactionModel.countDocuments({ profileID, type: "fire" }),
        reactionModel.countDocuments({ profileID, type: "heart" }),
        reactionModel.countDocuments({ profileID, type: "clap" }),
    ]);
    return { fire: fireCount, heart: heartCount, clap: clapCount };
};

ReactionRoute.get("/:username", async function (req, res) {
    try {
        const user = await UserModel.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const profileID = user._id.toString();
        const visitorID = req.query.visitorId || req.ip;
        const counts = await getCounts(profileID);

        const userReactions = {
            fire: !!(await reactionModel.exists({ profileID, visitorID, type: "fire" })),
            heart: !!(await reactionModel.exists({ profileID, visitorID, type: "heart" })),
            clap: !!(await reactionModel.exists({ profileID, visitorID, type: "clap" })),
        };

        res.json({ counts, userReactions });
    } catch (e) {
        res.status(500).json({
            message: e.message,
        });
    }
});

ReactionRoute.post("/:username", async function (req, res) {
    try {
        const user = await UserModel.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const profileID = user._id.toString();
        const visitorID = req.body.visitorId || req.ip;
        const { type } = req.body;

        if (!["fire", "heart", "clap"].includes(type)) {
            return res.status(400).json({ message: "Invalid reaction type" });
        }

        const existing = await reactionModel.findOne({ profileID, visitorID, type });

        if (existing) {
            await reactionModel.deleteOne({ _id: existing._id });
        } else {
            await reactionModel.create({ profileID, visitorID, type });
        }

        const counts = await getCounts(profileID);
        const userReactions = {
            fire: !!(await reactionModel.exists({ profileID, visitorID, type: "fire" })),
            heart: !!(await reactionModel.exists({ profileID, visitorID, type: "heart" })),
            clap: !!(await reactionModel.exists({ profileID, visitorID, type: "clap" })),
        };

        res.json({ counts, userReactions });
    } catch (e) {
        res.status(500).json({
            message: e.message,
        });
    }
});

module.exports = ReactionRoute;
