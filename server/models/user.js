const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpexpiry: { type: Date },
    githubUsername: { type: String },
    bio: { type: String },
    photo: { type: String },
    github: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    theme: { type: String, default: "purple" },
});

const UserModel = mongoose.model("Userdata", UserSchema);

module.exports = { UserModel };