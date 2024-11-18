import {NextFunction, Request, Response} from "express";
import env from "@root/env";
import ResponseBuilder from "@services/responseBuilder";

export default function isStaging(req: Request, res: Response, next: NextFunction) {
	if (env.ENV == "staging") return next();

	return ResponseBuilder.Forbidden(res);
}