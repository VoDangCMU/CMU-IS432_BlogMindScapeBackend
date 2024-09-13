import { NextFunction, Request, Response } from "express";

export function isAuth(req: Request, res: Response, next: NextFunction) {
  if (req.cookies) {
    if (req.cookies.jwt) return next();
  }
  return res.status(401).json({
    message: "Please login to access this resource!"
  })
}