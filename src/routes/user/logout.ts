import {Request, Response} from "express";
import UserSessionRepository, {pruneOldSession} from "@database/repo/UserSessionRepository";
import userSessionRepository from "@database/repo/UserSessionRepository";
import {UserSession} from "@models/UserSession";
import ResponseBuilder from "@services/responseBuilder";
import log from "@services/logger";

export async function logout(req: Request, res: Response) {
	const _sessionID = req.headers.sessionID;
	const _userID = req.headers.userID;

	if (!_sessionID) return ResponseBuilder.Unauthorize(res, "Invalid session");
	if (!_userID) return ResponseBuilder.Unauthorize(res, "Invalid user ID");

	const sessionID = _sessionID.toString();
	const userID = parseInt(_userID.toString(), 10);

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

		pruneOldSession(userID)
			.catch((err) => {
				log.error(err);
			})

		return ResponseBuilder.Ok(res, userSession);
	} catch (err) {
		log.error(err);
		return ResponseBuilder.InternalServerError(res);
	}
}