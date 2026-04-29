import express from "express";
import verifyToken from "../middleware/auth.middleware.js";
import requireAdmin from "../middleware/admin.middleware.js";
import {
  getStats,
  getUsers,
  getUser,
  updateRole,
  updateStatus,
  deleteUser,
  getProblems,
  getProblem,
  createProblem,
  updateProblem,
  deleteProblem,
  getRecentActivity,
  getActiveUsers,
  getUserGrowth,
  getMatchStats,
  getSubmissionStats,
} from "../controller/admin.controller.js";

const router = express.Router();

// All admin routes require auth + admin role
router.use(verifyToken, requireAdmin);

// Dashboard
router.get("/stats", getStats);

// User management
router.get("/users", getUsers);
router.get("/users/:id", getUser);
router.put("/users/:id/role", updateRole);
router.put("/users/:id/status", updateStatus);
router.delete("/users/:id", deleteUser);

// Problem management
router.get("/problems", getProblems);
router.get("/problems/:id", getProblem);
router.post("/problems", createProblem);
router.put("/problems/:id", updateProblem);
router.delete("/problems/:id", deleteProblem);

// Activity & Analytics
router.get("/activity/recent", getRecentActivity);
router.get("/activity/users", getActiveUsers);
router.get("/activity/growth", getUserGrowth);
router.get("/activity/matches", getMatchStats);
router.get("/activity/submissions", getSubmissionStats);

export default router;
