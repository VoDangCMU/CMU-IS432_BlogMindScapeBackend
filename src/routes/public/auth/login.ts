import UserRepository, {getUserByEmailOrUsername, USER_LOGIN_PARAMS_SCHEMA} from "@database/repo/UserRepository";
import log from "@services/logger";
import ResponseBuilder from "@services/responseBuilder";
import {compare} from "@services/hasher";
import {signToken} from "@services/jwt";
import {CookieOptions, Request, Response} from "express";
import UserSessionRepository, {createSession, pruneOldSession} from "@database/repo/UserSessionRepository";

export default async function (req: Request, res: Response) {
	let parsed = USER_LOGIN_PARAMS_SCHEMA.safeParse(req.body);

	if (parsed.error) {
		log.warn(parsed.error);
		return ResponseBuilder.BadRequest(res, parsed.error);
	}

	try {
		const reqBody = parsed.data;
		const user = await getUserByEmailOrUsername(reqBody?.username);

		if (user) {
			log.info(user)
			if (compare(reqBody.password, user.password)) {
				const userSession = await createSession(user);
				const token = signToken({
					userID: user.id.toString(),
					sessionID: userSession.id
				});

				log.info(userSession);
				log.info(token);

				let expiresDate = new Date();
				expiresDate.setDate(expiresDate.getDate() + 7);

				const cookieOps: CookieOptions = {
					expires: reqBody.keepLogin ? expiresDate : undefined,
					sameSite: "lax",
				};

				const loggedInUser = await UserRepository.findOne({
					where: {username: user.username}
				})

				log.info(loggedInUser)

				log.info("Pruning old session");
				pruneOldSession(user.id)
					.catch(err => {
						log.error(err);
					})

				return res.cookie("jwt", token, cookieOps).status(200).json({token, user: loggedInUser});
			}
		}
		return ResponseBuilder.NotFound(res, "Could not find user or wrong password");
	} catch (e) {
		log.error(e);
		return ResponseBuilder.InternalServerError(res);
	}
}