const express=require("express");
const mongoose=require("mongoose");
const{Profileviewmodel}=require("../models/profileviewdb");
const { UserModel } = require("../models/user");
const {UAParser}=require("ua-parser-js");

const Profileviewroute=express.Router();

Profileviewroute.get("/:username",async function (req,res){

    const username=req.params.username;
     
    const finduser=await UserModel.findOne({username:username});
    if(!finduser){
        return res.status(404).json({
            message:"User not Found!!!"
        })
    }

    


    
})



module.exports=Profileviewroute