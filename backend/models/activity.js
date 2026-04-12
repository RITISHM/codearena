import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  count: { type: Number, required: true },
});

activitySchema.index({ userId: 1 });

export default mongoose.model("Activity", activitySchema);
