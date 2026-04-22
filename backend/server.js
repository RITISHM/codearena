import { PORT, DB_URL } from "./config/env.js";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

const app = express();
await mongoose
  .connect(DB_URL)
  .then(() => console.log("db is connected ✅"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth", authRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "Healthy",
  });
});

app.listen(PORT, () => {
  console.log(PORT);
});
