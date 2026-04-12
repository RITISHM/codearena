import mongoose from "mongoose";

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

export default mongoose.model("Problem", problemSchema);
