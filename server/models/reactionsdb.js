const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const reactiondata= new Schema({
    profileID:{
        type:String,
        required:true,                                                                                                                                                                                                                                                                                                                                                                          
    },
     visitorID:{
        type:String,
        required:true,
                                                                                                                                                                                                                                                                                                                                                                            
    },
     type:{
        type:String,
        required:true,
        enum: ["fire", "heart", "clap"]                                                                                                                                                                                                                                                                                                                                                                          
    },
     createdAt:{
           type: Date,
        default: Date.now
                                                                                                                                                                                                                                                                                                                                                                            
    }
})

const reactionModel=mongoose.model("reactiondata",reactiondata);
module.exports={reactionModel}