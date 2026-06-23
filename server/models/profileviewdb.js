const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const viewdata=new Schema({
    profileId:{type:String,required:true},
    browser:{type:String,default:"unknown"},
    device:{type:String,default:"desktop"},
    os:{type:String,default:"unknown"},
    viewAt:{type:Date,default:Date.now},

})

const Profileviewmodel=mongoose.model("profileview",viewdata);
module.exports={Profileviewmodel}