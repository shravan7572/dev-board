const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const tempotp = new Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    otp: { type: String },
    otpexpiry: { type: Date },

})
const TemoOtpModel=mongoose.model("tempotp",tempotp)
module.exports = { TemoOtpModel};