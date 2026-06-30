const express = require("express");
const { SkillModel } = require("../models/skilldb");
const User_Auth = require("../middleware/User_Auth");
const { UserModel } = require("../models/user");
const SkillRoute = express.Router();

SkillRoute.post("/skill", User_Auth, async function (req, res) {
    const { name, level, icon, category, yearsExp, featured } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Skill name is required" });
    }

    try {
        const skillboard = await SkillModel.create({
            userid: req.userid,
            name,
            level,
            icon,
            category,
            yearsExp,
            featured,
        });

        res.status(201).json({ skillboard });
    } catch (e) {
        res.status(500).json({
            message: e.message,
        });
    }
});

SkillRoute.get("/skill/:username", async function (req, res) {
    const username = req.params.username;

    try {
        const checktheusername = await UserModel.findOne({ username }).select("-password");

        if (!checktheusername) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const checkandgetallskills = await SkillModel.find({
            userid: checktheusername._id.toString(),
        }).sort({ featured: -1 });

        res.json({
            checkandgetallskills,
        });
    } catch (e) {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
});

SkillRoute.delete("/skill/:id", User_Auth, async function (req, res) {
    try {
        const getskillsbyid = await SkillModel.findById(req.params.id);

        if (!getskillsbyid) {
            return res.status(404).json({
                message: "Skill not found",
            });
        }

        if (getskillsbyid.userid !== req.userid) {
            return res.status(403).json({
                message: "Not authorized",
            });
        }

        await SkillModel.findByIdAndDelete(req.params.id);

        res.json({
            message: "Skill deleted successfully",
        });
    } catch (e) {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
});

SkillRoute.put("/skill/:id", User_Auth, async function (req, res) {
    const { name, level, icon, category, yearsExp, featured } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Skill name is required" });
    }

    try {
        const skill = await SkillModel.findById(req.params.id);

        if (!skill) {
            return res.status(404).json({
                message: "Skill not found",
            });
        }

        if (skill.userid !== req.userid) {
            return res.status(403).json({
                message: "Not authorized",
            });
        }

        const updatedSkill = await SkillModel.findByIdAndUpdate(
            req.params.id,
            { name, level, icon, category, yearsExp, featured },
            { new: true }
        );

        res.json({ skillboard: updatedSkill });
    } catch (e) {
        res.status(500).json({
            message: e.message,
        });
    }
});

module.exports = SkillRoute;
