import {Request, Response} from "express";
import UserSessionRepository from "@database/repo/UserSessionRepository";
import userSessionRepository from "@database/repo/UserSessionRepository";
import {UserSession} from "@models/UserSession";
import ResponseBuilder from "@services/responseBuilder";
import log from "@services/logger";

export async function logout(req: Request, res: Response) {
	const _sessionID = req.headers.sessionID;

	if (!_sessionID) return ResponseBuilder.Unauthorize(res, "Invalid session");

	const sessionID = _sessionID.toString();

	const userSession = await UserSessionRepository.findOne({
		where: {id: sessionID},
		relations: {
			user: true
		}
	})

	if (!userSession) return ResponseBuilder.Unauthorize(res, "Invalid session");

	try {
		await UserSessionRepository
			.createQueryBuilder()
			.delete()
			.where("id = :id", {id: sessionID})
			.execute();

		return ResponseBuilder.Ok(res, userSession);
	} catch (err) {
		log.error(err);
		return ResponseBuilder.InternalServerError(res);
	}
}