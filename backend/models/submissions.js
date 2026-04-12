import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Match",
    required: true,
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  language: { type: String, required: true },
  memoryUsed: Number,
  executionTime: Number,
  status: {
    type: String,
    enum: ["accepted", "wrong_answer", "runtime_error", "compile_error"],
  },
  createdAt: { type: Date, default: Date.now },
  code: { type: String, required: true },
  testcase: {
    total: { type: Number, default: 0 },
    passed: { type: Number, default: 0 },
  },
});

submissionSchema.index({ matchId: 1, userId: 1 });

submissionSchema.index({ matchId: 1, userId: 1, problemId: 1 });

export default mongoose.model("Submission", submissionSchema);
