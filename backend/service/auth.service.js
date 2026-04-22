import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import User from "../models/users.js";

const login = async (data) => {
  const user = await User.findOne({ email: data.email });
  if (!user) throw new Error("Invalid credentials");
  if (!(await user.verifyPassword(data.password)))
    throw new Error("Invalid credentials");
  const token = jwt.sign(
    {
      email: user.email,
      userId: user._id,
      username: user.username,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  );
  console.log(JWT_SECRET);
  return token;
};

const signup = async (data) => {
  const usernameTaken = await User.findOne({ username: data.username });
  if (usernameTaken) throw new Error("Username is taken");
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) throw new Error("User already exists");
  const user = await User.create(data);
  const token = jwt.sign(
    {
      email: user.email,
      userId: user._id,
      username: user.username,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  );
  console.log(JWT_SECRET);
  return { token, user };
};

export default { login, signup };
