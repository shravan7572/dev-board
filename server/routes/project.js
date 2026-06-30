const express = require("express");
const { ProjectModel } = require("../models/projectdb");
const User_Auth = require("../middleware/User_Auth");
const { UserModel } = require("../models/user");
const projectupload = require("../utils/projectupload");
const ProjectRoute = express.Router();

function parseTechstack(techstack) {
    if (Array.isArray(techstack)) return techstack;
    if (typeof techstack === "string" && techstack.trim()) {
        return techstack.split(",").map((item) => item.trim()).filter(Boolean);
    }
    return [];
}

function parseFeatured(value) {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") return value === "true";
    return false;
}

ProjectRoute.post("/project", User_Auth, projectupload.single("thumbnail"), async (req, res) => {
    const thumbnail = req.file?.path || "";

    try {
        const { title, description, techstack, liveurl, githuburl, featured } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Project title is required" });
        }

        const projectdetail = await ProjectModel.create({
            userid: req.userid,
            title,
            description,
            techstack: parseTechstack(techstack),
            liveurl,
            githuburl,
            thumbnail,
            featured: parseFeatured(featured),
        });

        res.status(201).json({ message: "Project added", projectdetail });
    } catch (e) {
        res.status(500).json({
            message: e.message,
        });
    }
});

ProjectRoute.get("/project/:username", async function (req, res) {
    const username = req.params.username;

    try {
        const checkusername = await UserModel.findOne({ username }).select("-password");

        if (!checkusername) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const projectdetailshow = await ProjectModel.find({
            userid: checkusername._id.toString(),
        }).sort({ featured: -1 });

        res.json({ projectdetailshow });
    } catch (e) {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
});

ProjectRoute.put("/project/update/:id", User_Auth, projectupload.single("thumbnail"), async function (req, res) {
    try {
        const checkid = await ProjectModel.findById(req.params.id);

        if (!checkid) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        if (checkid.userid !== req.userid) {
            return res.status(403).json({
                message: "Not authorized",
            });
        }

        const updates = {};
        const allowed = ["title", "description", "techstack", "liveurl", "githuburl", "featured"];
        for (const field of allowed) {
            if (req.body[field] !== undefined) {
                updates[field] = field === "techstack"
                    ? parseTechstack(req.body[field])
                    : field === "featured"
                        ? parseFeatured(req.body[field])
                        : req.body[field];
            }
        }

        if (req.file) {
            updates.thumbnail = req.file.path || "";
        }

        const updatedprojectdetail = await ProjectModel.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        );

        res.json({
            updatedprojectdetail,
        });
    } catch (e) {
        res.status(500).json({
            message: e.message,
        });
    }
});

ProjectRoute.delete("/project/:id", User_Auth, async function (req, res) {
    try {
        const checkid = await ProjectModel.findById(req.params.id);

        if (!checkid) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        if (checkid.userid !== req.userid) {
            return res.status(403).json({
                message: "Not authorized",
            });
        }

        await ProjectModel.findByIdAndDelete(req.params.id);

        res.json({
            message: "Project deleted successfully",
        });
    } catch (e) {
        res.status(500).json({
            message: e.message,
        });
    }
});

module.exports = ProjectRoute;
