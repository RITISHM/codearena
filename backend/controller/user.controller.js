import userService from '../service/user.service.js';

export const getUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await userService.getUserById(userId);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const data = req.body;
    const user = await userService.updateUserById(userId, data);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.user.userId, req.body.password);
    res.status(200).json(user);
  } catch (err) {
    if (err.message === 'Invalid PAssword') return res.status(401).json({ error: err.message });
    res.status(500).json({ error: err.message });
  }
};

export const getActivity = async (req, res) => {
  try {
    const activity = await userService.getActivity(req.user.userId, req.params.year);
    res.status(200).json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRecentMatches = async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const matches = await userService.getRecentMatches(req.user.userId, limit);
    res.status(200).json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPaginatedMatches = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await userService.getPaginatedMatches(req.user.userId, page, limit);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
