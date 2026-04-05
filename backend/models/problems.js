const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/codearena")
  .then(() => console.log("problem db is connected"))
  .catch((err) => console.log(err));

const problemSchema = new mongoose.Schema({
  topic: String,
  name: String,
  description: String,
  templateCode: String,
  testcases: [
    {
      input: String,
      output: String,
    },
  ],
  sampleTestCases: [
    {
      input: String,
      output: String,
    },
  ],
  totalTestCases: Number,
  level: { type: String, enum: ["easy", "medium", "hard"] },
  constraints: [{ type: String }],
});

module.exports = mongoose.model("Problem", problemSchema);
