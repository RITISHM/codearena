import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../config/env.js";

// const JWT_SECRET = process.env.JWT_SECRET || "secret";

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log(JWT_SECRET);

  if (!token) return res.status(401).json({ message: "not logged in " });
  try {
    console.log(JWT_SECRET);
    const decode = jwt.verify(token, JWT_SECRET);
    req.user = decode;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid Token", error: e.message });
  }
};

export default verifyToken;
