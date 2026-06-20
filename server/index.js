require("dotenv").config();
const express=require("express");
const mongoose=require("mongoose");
const app=express();
app.use(express.json())


const userroutes=require("./routes/auth");
const Profileroute=require("./routes/profile");

app.use("/api",userroutes)
app.use("/api/profile",Profileroute)






mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected "))
  .catch((err) => console.log("MongoDB Error ", err));

app.listen(5001, "0.0.0.0",()=>{
    console.log("You're server is running on http://localhost:5001/")
})