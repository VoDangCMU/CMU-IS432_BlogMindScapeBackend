import { NextFunction, Request, Response } from "express";
import { decodeToken } from "../services/jwt";
import ResponseBuilder from "../services/responseBuilder";

export function isAuth(req: Request, res: Response, next: NextFunction) {
  if (req.cookies || req.headers.authorization) {
    // Cookie based 
    if (req.cookies.jwt) {
      const payload = decodeToken(req.cookies.jwt)
      if (payload) {
        req.headers['userID'] = payload;
        return next();
      }
    }

    // header based
    if (req.headers.authorization) {
      const payload = decodeToken(req.headers.authorization)
      if (payload) {
        req.headers['userID'] = payload;
        return next();
      }
    }
  }
  return ResponseBuilder.Forbidden(res, "Please Login to access to this resource.")
}