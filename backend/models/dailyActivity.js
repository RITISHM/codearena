const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/codearena")
  .then(() => console.log("activity db is connected"))
  .catch((err) => console.log(err));

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  count: { type: Number, required: true },
});

activitySchema.index({ userId: 1 });

module.exports = mongoose.model("DailyActivity", activitySchema);
