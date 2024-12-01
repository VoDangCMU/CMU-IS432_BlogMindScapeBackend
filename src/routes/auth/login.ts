import UserRepository from "@database/repo/UserRepository";
import log from "@services/logger";
import ResponseBuilder from "@services/responseBuilder";
import {compare} from "@services/hasher";
import {signToken} from "@services/jwt";
import {CookieOptions, Request, Response} from "express";
import {createSession, pruneOldSession} from "@database/repo/UserSessionRepository";
import {z} from "zod";

export const LoginCredentialsParser = z.object({
	username: z.string(),
	password: z.string(),
	keepLogin: z.union([z.string(), z.boolean()]),
})

function getTokenExpiredDate() {
	let expiresDate = new Date();
	expiresDate.setDate(expiresDate.getDate() + 7);

	return expiresDate;
}

export default async function (req: Request, res: Response) {
	let parsed = LoginCredentialsParser.safeParse(req.body);

	if (parsed.error) {
		log.warn(parsed.error);
		return ResponseBuilder.BadRequest(res, parsed.error);
	}

	const credentials = parsed.data;

	try {
		const user = await UserRepository.findOne({
			where: [
				{username: credentials.username},
				{mail: credentials.username},
			],
			select: {username: true, password: true, id: true}
		});

		// Invalid username or password
		if (!user || !compare(credentials.password, user.password))
			return ResponseBuilder.BadRequest(res, "Incorrect username or password");

		const userSession = await createSession(user);
		const token = signToken({
			userID: user.id.toString(),
			sessionID: userSession.id
		});

		log.info(userSession);
		log.info("token", token);

		const expiresDate = getTokenExpiredDate();

		const cookieOps: CookieOptions = {
			expires: credentials.keepLogin ? expiresDate : undefined,
			sameSite: "lax",
		};

		const loggedInUser = await UserRepository.findOne({
			where: {username: user.username}
		})

		log.info(loggedInUser)
		log.info("Pruning old session");
		await pruneOldSession(user.id);

		return res.cookie("jwt", token, cookieOps).status(200).json({token, user: loggedInUser});
	} catch (e) {
		log.error(e);
		return ResponseBuilder.InternalServerError(res);
	}
}