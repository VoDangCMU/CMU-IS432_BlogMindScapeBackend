import { NextFunction, Request, Response } from "express";
import { decodeToken } from "@services/jwt";
import ResponseBuilder from "@services/responseBuilder";
import log from "@services/logger";

export function isAuth(req: Request, res: Response, next: NextFunction) {
  log('info', "Begin Authorization");
  if (req.cookies || req.headers.authorization) {
    log('info', "Detecting cookies and headers");
    // Cookie based 
    if (req.cookies.jwt) {
      log('info', 'Cookie detected');
      log('info', 'Begin decoding');

      const payload = decodeToken(req.cookies.jwt)
      if (payload) {
        log('info', 'Logged in with payload', payload);
        req.headers['userID'] = payload;
        return next();
      }
    }

    // header based
    if (req.headers.authorization) {
      log('info', 'Authorization header detected');
      log('info', 'Begin decoding');
      const payload = decodeToken(req.headers.authorization)
      if (payload) {
        log('info', 'Logged in with payload', payload);
        req.headers['userID'] = payload;
        return next();
      }
    }
  }
  return ResponseBuilder.Forbidden(res, "Please Login to access to this resource.")
}