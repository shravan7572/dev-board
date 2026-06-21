const express = require("express");
const mongoose = require("mongoose");
const { SkillModel } = require("../models/skilldb");
const User_Auth = require("../middleware/User_Auth");
const { UserModel } = require("../models/user");
const SkillRoute = express.Router();

SkillRoute.post("/skill", User_Auth, async function (req, res) {
    console.log("userid:", req.userid)  // ← add this
    console.log("body:", req.body)

    const { name, level, icon, category, yearsExp, featured } = req.body;

    try {
        const skillboard = await SkillModel.create({
            userid: req.userid,
            name,
            level,
            icon,
            category,
            yearsExp,
            featured
        })
        res.json({ skillboard })
    } catch (e) {
        res.status(500).json({
            message: e.message
        })
    }
})

SkillRoute.get("/skill/:username", async function (req, res) {
    const username = req.params.username

    try {
        const checktheusername = await UserModel.findOne({ username: username }).select("-password");

        if (!checktheusername) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const checkandgetallskills = await SkillModel.find({
            userid: checktheusername.id
        }).sort({ featured: -1 })

        res.json({
            checkandgetallskills
        })

    } catch (e) {
        res.status(500).json({
            message: "something went wrong"
        })
    }

})

SkillRoute.delete("/skill/:id",User_Auth,async function (req,res){
        
    try{
    const id=req.params.id;

        const getskillsbyid=await SkillModel.findById(req.params.id)

        if(!getskillsbyid){
             return res.status(404).json({
                message:"skill Not found"
            })
        }

        if(getskillsbyid.userid!==req.userid){
            return res.status(403).json({
                message:"not auhtorized"
            })
        }

        await SkillModel.findByIdAndDelete(req.params.id);

        res.json({
            message:"Skill deleted Successfully!!"
        })

    }catch(e){
        res.status(500).json({
            message:"something went wrong"
        })
    }


    
})



module.exports = SkillRoute;