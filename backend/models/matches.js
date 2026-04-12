import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  players: {
    player1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    player2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  status: {
    type: String,
    enum: ["ongoing", "completed", "aborted"],
    default: "ongoing",
  },
  left_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  problemsId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Problem" }],
  points: {
    player1: { type: Number, default: 0 },
    player2: { type: Number, default: 0 },
  },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  startedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

matchSchema.index({ "players.player1": 1, "players.player2": 1 });

export default mongoose.model("Match", matchSchema);
