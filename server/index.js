require("dotenv").config();
const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors")
const app=express();
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173"
}))

const userroutes=require("./routes/auth");
const Profileroute=require("./routes/profile");
const SkillRoute=require("./routes/skill")
const ProjectRoute=require("./routes/project");
const ReactionRoute=require("./routes/reaction");
const Profileviewroute=require("./routes/profileview");
const ContactRoute=require("./routes/contact")
const GithubRoute=require("./routes/githubprf");

app.use("/api",userroutes)
app.use("/api/profile",Profileroute)
app.use("/api",SkillRoute)
app.use("/api",ProjectRoute)
app.use("/api/reaction",ReactionRoute)
app.use("/api/view",Profileviewroute)
app.use("/api/contact",ContactRoute)
app.use("/api/fetch",GithubRoute);






mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected "))
  .catch((err) => console.log("MongoDB Error ", err));

app.listen(5001, "0.0.0.0",()=>{
    console.log("You're server is running on http://localhost:5001/")
})