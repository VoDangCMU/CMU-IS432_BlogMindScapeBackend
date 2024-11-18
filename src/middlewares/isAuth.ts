import { NextFunction, Request, Response } from "express";
import { decodeToken } from "@services/jwt";
import ResponseBuilder from "@services/responseBuilder";
import log from "@services/logger";
import UserSessionRepository from "@database/repo/UserSessionRepository";

export function isAuth(req: Request, res: Response, next: NextFunction) {
  log.info("Begin Authorization");
  if (req.cookies || req.headers.authorization) {
		let userID: string = "",
			sessionID: string = "";
    log.info("Detecting cookies and headers");
    // Cookie based
    if (req.cookies.jwt) {
      log.info("Cookie detected");
      log.info("Begin decoding");

      const payload = decodeToken(req.cookies.jwt);
      if (payload) {
				userID = payload.userID as string;
				sessionID = payload.sessionID as string;
      }
    }

    // header based
    if (req.headers.authorization) {
      log.info("Authorization header detected");
      log.info("Begin decoding");
      const payload = decodeToken(req.headers.authorization);
      if (payload) {
	      userID = payload.userID as string;
	      sessionID = payload.sessionID as string;
      }
    }
	  req.headers.userID = userID;
	  req.headers.sessionID = sessionID;

		UserSessionRepository.findOneOrFail({
			where: {id: sessionID},
			relations: {
				user: true
			}
		})
			.then((session) => {
				log.info("Logged in as ", session.user);
				return next();
			})
			.catch((err) => {
				return ResponseBuilder.Forbidden(
					res,
					"Invalid Session."
				);
			})
  }
}
