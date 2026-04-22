import express from "express";
import { login, signup, me, logout } from "../controller/auth.controller.js";
import verifyToken from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", login);

router.post("/signup", signup);

router.get("/me", verifyToken, me);

router.post("/logout", logout);

export default router;
