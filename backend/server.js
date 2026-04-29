import { PORT, DB_URL } from "./config/env.js";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import User from "./models/users.js";

const app = express();

await mongoose
  .connect(DB_URL)
  .then(() => console.log("db is connected ✅"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

// Public leaderboard endpoint — no auth required
app.get("/leaderboard", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const users = await User.find({ status: "active" })
      .select("username win matches region joined")
      .sort({ win: -1, matches: 1 })
      .limit(limit);

    const leaderboard = users.map((u, i) => ({
      rank: i + 1,
      username: u.username,
      wins: u.win || 0,
      matches: u.matches || 0,
      winRate: u.matches > 0 ? Math.round((u.win / u.matches) * 100) : 0,
      region: u.region || '',
      joined: u.joined,
    }));
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/health", (req, res) => {
  res.json({
    status: "Healthy",
  });
});

app.listen(PORT, () => {
  console.log(PORT);
});
