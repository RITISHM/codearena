import User from "../models/users.js";

const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    next();
  } catch (e) {
    return res.status(500).json({ message: "Server error", error: e.message });
  }
};

export default requireAdmin;
