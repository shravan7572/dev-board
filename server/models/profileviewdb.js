const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const viewdata=new Schema({
    profileId:{type:String,required:true},
    browser:{type:String},
    device:{type:String},
    os:{type:String},
    viewAt:{type:Date,default:Date.now},

})

const Profileviewmodel=mongoose.model("profileview",viewdata);
module.exports={Profileviewmodel}