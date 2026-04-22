import express from "express";
import verifyToken from "../middleware/auth.middleware.js";
import { getUser, updateUser, getActivity, deleteUser } from "../controller/user.controller.js";
const router = express.Router();

router.get("/me", verifyToken, getUser);
router.put("/me", verifyToken, updateUser);
router.get("/me/activity/:year", verifyToken, getActivity);
router.delete("/me", verifyToken, deleteUser);
export default router;
