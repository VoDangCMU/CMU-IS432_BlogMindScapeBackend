import { NextFunction, Request, Response } from "express";
import { decodeToken } from "../services/jwt";

export function isAuth(req: Request, res: Response, next: NextFunction) {
  if (req.cookies) {
    if (req.cookies.jwt) {
      const payload = decodeToken(req.cookies.jwt)
      if (payload) return next();
    }
  }
  return res.status(401).json({
    message: "Please login to access this resource!"
  })
}