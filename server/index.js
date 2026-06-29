require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5001;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.set("trust proxy", 1);
app.use(express.json());
app.use(cors({
    origin: CLIENT_URL,
    credentials: true,
}));

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
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});