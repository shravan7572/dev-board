const express=require("express");
const mongoose=require("mongoose");
const{Profileviewmodel}=require("../models/profileviewdb");
const { UserModel } = require("../models/user");
const {UAParser}=require("ua-parser-js");
const User_Auth = require("../middleware/user_auth");

const Profileviewroute=express.Router();

Profileviewroute.post("/:username",async function (req,res){
try{
    const username=req.params.username;
     
    const finduser=await UserModel.findOne({username:username});
    if(!finduser){
        return res.status(404).json({
            message:"User not Found!!!"
        })
    }
    const profileId=finduser._id

     const uaString = req.headers['user-agent'];

     const parser= new UAParser(uaString);
     const result=parser.getResult();

     const profiledata = new Profileviewmodel({
        profileId:profileId,
        browser:result.browser.name||"unknown",
        device:result.device.type||"desktop",
        os:result.os.name||"unknown",
     })

     await profiledata.save();

     res.status(200).json({
        success:true,
        message:"Activity logged successfully!" ,
        profiledata
     })
}
catch(e){
    res.status(500).json({
        message:e.message
    })
}

    
})

Profileviewroute.get("/stats", User_Auth, async (req, res) => {
    try {
        const totalviews = await Profileviewmodel.countDocuments({ 
            profileId: req.userid 
        })

        const browserbreakdown = await Profileviewmodel.aggregate([
            { $match: { profileId: req.userid } },
            { $group: { _id: "$browser", count: { $sum: 1 } } }
        ])

        res.json({ totalviews, browserbreakdown })
    } catch(e) {
        res.status(500).json({ message: e.message })
    }
})



module.exports=Profileviewroute