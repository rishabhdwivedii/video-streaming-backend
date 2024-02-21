import jwt from "jsonwebtoken";
import { Users } from "../db";
import { Request, Response, NextFunction } from "express";
require("dotenv").config();

export interface User {
  username: string;
  password: string;
}

export const generateJwt = (user: User) => {
  const payload = { username: user.username };
  return jwt.sign(payload, process.env.SECRET!, { expiresIn: "1h" });
};

export const userAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;
  const user = await Users.findOne({ username, password });
  if (user) {
    next();
  } else {
    res.status(403).json({ message: "User authentication failed" });
  }
};

export const authenticateJwt = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRET!, (err, user) => {
      console.log(user);
      if (err) {
        return res.sendStatus(403);
      }
      if (!user) {
        return res.sendStatus(403);
      }

      req.headers["user"] = JSON.stringify(user);
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
