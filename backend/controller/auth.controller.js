import authService from "../service/auth.service.js";

export const login = async (req, res) => {
  try {
    const token = await authService.login(req.body);
    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "Login successful",
      });
  } catch (e) {
    return res.status(401).json({ error: e.message });
  }
};

export const signup = async (req, res) => {
  try {
    const { token, user } = await authService.signup(req.body);
    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ message: "Signup successful", user: user });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

export const me = (req, res) => {
  return res.json({
    isLogged: true,
    user: req.user,
  });
};

export const logout = (req, res) => {
  return res.clearCookie("token").json({ message: "Logged out" });
};
