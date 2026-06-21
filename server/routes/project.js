const express = require("express");
const { ProjectModel } = require("../models/projectdb");
const User_Auth = require("../middleware/User_Auth");
const { UserModel } = require("../models/user");

const ProjectRoute = express.Router();

ProjectRoute.post("/project", User_Auth, async (req, res) => {

    try {
        const { title, description, techstack, liveurl, githuburl, thumbnail, featured } = req.body;
        const projectdetail = await ProjectModel.create({
            userid: req.userid,
            title: title,
            description: description,
            techstack: techstack,
            liveurl: liveurl,
            githuburl: githuburl
            , thumbnail: thumbnail,
            featured: featured
        })
        res.json({ message: "detail added !", projectdetail })

    }
    catch (e) {
        res.status(500).json({
            message: e.message
        })
    }


})

ProjectRoute.get("/project/:username",async function(req,res){
    const username=req.params.username;
try {
 const checkusername=await UserModel.findOne({username:username}).select("-password");

 if(!checkusername){
    return res.status(404).json({
        message:"user not found"
    })
 }

    const projectdetailshow=await ProjectModel.find({userid:checkusername.id}).sort({featured:-1});


 res.json({projectdetailshow})

} catch (e) {

    res.status(500).json({
        message:"something went wrong"
    })
    
}

})

ProjectRoute.put("/project/update/:id",User_Auth,async function (req,res){

 const { title, description, techstack, liveurl, githuburl, thumbnail, featured } = req.body;

    const id=req.params.id;
    try {
        const checkid=await ProjectModel.findById(req.params.id);

        if(!checkid){
            return res.status(404).json({
                message:"Project not Found"
            })
        }

        if(checkid.userid!==req.userid){
          return  res.status(403).json({
                message:"not auhtenticatied"
            })
        }

      const updatedprojectdetail= await ProjectModel.findByIdAndUpdate(
           req.params.id,
            req.body,
            {new :true}
        )

        res.json({
            updatedprojectdetail
        })


    } catch (e) {
        res.status(500).json({
            message:e.message
        })
        
    }
    
})

ProjectRoute.delete("/project/:id",User_Auth,async function (req,res){

    const id=req.params.id;
    try {
        const checkid=await ProjectModel.findById(req.params.id);

        if(!checkid){
            return res.status(404).json({
                message:"Project not Found"
            })
        }

        if(checkid.userid!==req.userid){
          return  res.status(403).json({
                message:"not auhtenticatied"
            })
        }

      const updatedprojectdetail= await ProjectModel.findByIdAndDelete(req.params.id)

        res.json({
            message:"project Deleted Successfully!!!"
        })


    } catch (e) {
        res.status(500).json({
            message:e.message
        })
        
    }
    
})





module.exports = ProjectRoute