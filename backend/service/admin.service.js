import User from "../models/users.js";
import Problem from "../models/problems.js";
import Match from "../models/matches.js";
import Submission from "../models/submissions.js";
import Activity from "../models/activity.js";

// ─── Dashboard Stats ─────────────────────────────────────────────
const getDashboardStats = async () => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [totalUsers, totalProblems, totalMatches, totalSubmissions, newUsers, onlineToday] =
    await Promise.all([
      User.countDocuments(),
      Problem.countDocuments(),
      Match.countDocuments(),
      Submission.countDocuments(),
      User.countDocuments({ joined: { $gte: sevenDaysAgo } }),
      Activity.distinct("userId", {
        date: { $gte: new Date(now.toISOString().split("T")[0]) },
      }).then((ids) => ids.length),
    ]);

  return { totalUsers, totalProblems, totalMatches, totalSubmissions, newUsers, onlineToday };
};

// ─── User Management ─────────────────────────────────────────────
const getAllUsers = async (page = 1, limit = 20, search = "", role = "", status = "") => {
  const query = {};
  if (search) {
    query.$or = [
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
    ];
  }
  if (role) query.role = role;
  if (status) query.status = status;

  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find(query)
      .select("-password")
      .sort({ joined: -1 })
      .skip(skip)
      .limit(Number(limit)),
    User.countDocuments(query),
  ]);

  return { users, total, page: Number(page), totalPages: Math.ceil(total / limit) };
};

const getUserById = async (id) => {
  const user = await User.findById(id).select("-password");
  if (!user) throw new Error("User not found");
  return user;
};

const updateUserRole = async (id, role) => {
  if (!["user", "admin"].includes(role)) throw new Error("Invalid role");
  const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-password");
  if (!user) throw new Error("User not found");
  return user;
};

const updateUserStatus = async (id, status) => {
  if (!["active", "banned"].includes(status)) throw new Error("Invalid status");
  const user = await User.findByIdAndUpdate(id, { status }, { new: true }).select("-password");
  if (!user) throw new Error("User not found");
  return user;
};

const deleteUserById = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new Error("User not found");
  return { message: "User deleted successfully" };
};

// ─── Problem Management ──────────────────────────────────────────
const getAllProblems = async (page = 1, limit = 20, search = "", difficulty = "") => {
  const query = {};
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { problemId: { $regex: search, $options: "i" } },
    ];
  }
  if (difficulty) query.difficulty = difficulty;

  const skip = (page - 1) * limit;
  const [problems, total] = await Promise.all([
    Problem.find(query).sort({ _id: -1 }).skip(skip).limit(Number(limit)),
    Problem.countDocuments(query),
  ]);

  return { problems, total, page: Number(page), totalPages: Math.ceil(total / limit) };
};

const getProblemById = async (id) => {
  const problem = await Problem.findById(id);
  if (!problem) throw new Error("Problem not found");
  return problem;
};

const createProblem = async (data) => {
  const existing = await Problem.findOne({
    $or: [{ problemId: data.problemId }, { problemSlug: data.problemSlug }],
  });
  if (existing) throw new Error("Problem with this ID or slug already exists");
  const problem = await Problem.create(data);
  return problem;
};

const updateProblem = async (id, data) => {
  const problem = await Problem.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!problem) throw new Error("Problem not found");
  return problem;
};

const deleteProblem = async (id) => {
  const problem = await Problem.findByIdAndDelete(id);
  if (!problem) throw new Error("Problem not found");
  return { message: "Problem deleted successfully" };
};

// ─── Activity & Analytics ────────────────────────────────────────
const getRecentActivity = async (limit = 30) => {
  const [recentSubmissions, recentMatches] = await Promise.all([
    Submission.find()
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate("userId", "username")
      .populate("problemId", "title difficulty"),
    Match.find()
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate("players.player1", "username")
      .populate("players.player2", "username"),
  ]);

  return { recentSubmissions, recentMatches };
};

const getActiveUsers = async (days = 7) => {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const activeUserIds = await Activity.distinct("userId", { date: { $gte: since } });
  const users = await User.find({ _id: { $in: activeUserIds } })
    .select("username email role status joined")
    .sort({ joined: -1 });
  return { users, count: users.length };
};

const getUserGrowthData = async (months = 6) => {
  const since = new Date();
  since.setMonth(since.getMonth() - months);

  const growth = await User.aggregate([
    { $match: { joined: { $gte: since } } },
    {
      $group: {
        _id: {
          year: { $year: "$joined" },
          month: { $month: "$joined" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  return growth.map((g) => ({
    label: `${g._id.year}-${String(g._id.month).padStart(2, "0")}`,
    count: g.count,
  }));
};

const getMatchStats = async () => {
  const stats = await Match.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  const result = { ongoing: 0, completed: 0, aborted: 0 };
  stats.forEach((s) => {
    result[s._id] = s.count;
  });
  return result;
};

const getSubmissionStats = async () => {
  const stats = await Submission.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  const result = { accepted: 0, wrong_answer: 0, runtime_error: 0, compile_error: 0 };
  stats.forEach((s) => {
    if (s._id) result[s._id] = s.count;
  });
  return result;
};

export default {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
  deleteUserById,
  getAllProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
  getRecentActivity,
  getActiveUsers,
  getUserGrowthData,
  getMatchStats,
  getSubmissionStats,
};
