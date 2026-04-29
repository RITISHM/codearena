import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
  problemId: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  problemSlug: { type: String, unique: true, required: true },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
  constraints: [{ type: String }],
  hints: [{ type: String }],
  examples: [
    {
      exampleNum: { type: Number, required: true },
      exampleText: { type: String, required: true },
      images: [{ type: String }],
    },
  ],
  codeSnippets: { type: Map, of: String },
  totalTestCases: { type: Number, required: true },
  testcases: [
    { input: { type: String, required: true }, output: { type: String, required: true } },
  ],
});

export default mongoose.model("Problem", problemSchema);
