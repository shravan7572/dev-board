const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Skillschema = new Schema({
    userid: { type: String, required: true },
    name: { type: String, required: true },
    level: { type: String, },
    icon: { type: String, },
    category: { type: String, },
    yearsExp: { type: Number, },
    featured: { type: Boolean, },
});

const SkillModel = mongoose.model("SKilldata", Skillschema);

module.exports = { SkillModel }