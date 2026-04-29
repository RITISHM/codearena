import adminService from "../service/admin.service.js";

// ─── Dashboard ───────────────────────────────────────────────────
export const getStats = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Users ───────────────────────────────────────────────────────
export const getUsers = async (req, res) => {
  try {
    const { page, limit, search, role, status } = req.query;
    const result = await adminService.getAllUsers(page, limit, search, role, status);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await adminService.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const updateRole = async (req, res) => {
  try {
    const user = await adminService.updateUserRole(req.params.id, req.body.role);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const user = await adminService.updateUserStatus(req.params.id, req.body.status);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const result = await adminService.deleteUserById(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// ─── Problems ────────────────────────────────────────────────────
export const getProblems = async (req, res) => {
  try {
    const { page, limit, search, difficulty } = req.query;
    const result = await adminService.getAllProblems(page, limit, search, difficulty);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProblem = async (req, res) => {
  try {
    const problem = await adminService.getProblemById(req.params.id);
    res.json(problem);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const createProblem = async (req, res) => {
  try {
    const problem = await adminService.createProblem(req.body);
    res.status(201).json(problem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateProblem = async (req, res) => {
  try {
    const problem = await adminService.updateProblem(req.params.id, req.body);
    res.json(problem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteProblem = async (req, res) => {
  try {
    const result = await adminService.deleteProblem(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// ─── Activity ────────────────────────────────────────────────────
export const getRecentActivity = async (req, res) => {
  try {
    const { limit } = req.query;
    const activity = await adminService.getRecentActivity(limit);
    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getActiveUsers = async (req, res) => {
  try {
    const { days } = req.query;
    const result = await adminService.getActiveUsers(days);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserGrowth = async (req, res) => {
  try {
    const { months } = req.query;
    const data = await adminService.getUserGrowthData(months);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMatchStats = async (req, res) => {
  try {
    const stats = await adminService.getMatchStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSubmissionStats = async (req, res) => {
  try {
    const stats = await adminService.getSubmissionStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
