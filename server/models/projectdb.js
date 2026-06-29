const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Projectdata = new Schema({
    userid: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    techstack: { type: [String] },
    liveurl: { type: String },
    githuburl: { type: String },
    thumbnail: { type: String },
    featured: { type: Boolean, default: false },
});



const ProjectModel=mongoose.model("Projectdata",Projectdata);

module.exports={ProjectModel}