const express = require("express");
const { UserModel } = require("../models/user");
const User_Auth = require("../middleware/User_Auth");

const Profileroute = express.Router();

Profileroute.get("/:username", async (req, res) => {

    const username = req.params.username

    try {
        const checktheusername = await UserModel.findOne({ username: username }).select("-password");

        if (!checktheusername) {
            return res.status(404).json({
                message: "User not found"
            })
        }


        res.json({
            checktheusername
        })

    } catch (e) {
        res.status(500).json({
            message: "something went wrong"
        })
    }

})


Profileroute.put("/", User_Auth, async (req, res) => {

    const { name, bio, photo, github, linkedin, twitter } = req.body;

    try {
      const userprofile=await UserModel.findByIdAndUpdate(
            req.userid,
            req.body,      // updates with whatever they send
            { new: true }  // returns updated document
        ).select("-password")

        res.json({userprofile})

    } catch (e) {
        res.json({
            message:"unable to uppdate"
        })

    }

})





module.exports = Profileroute