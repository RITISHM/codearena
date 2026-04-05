const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/codearena")
  .then(() => console.log("User db is connected"))
  .catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: Date },
  joined: { type: Date, default: Date.now },
  win: { type: Number, default: 0 },
  matches: { type: Number, default: 0 },
  region: String,
  github: String,
  level: { type: String, enum: ["beginner", "intermediate", "advanced"] },
});

module.exports = mongoose.model("User", userSchema);
