import UserRepository, {createUser, isUserNotExisted, USER_CREATE_SCHEMA} from "@database/repo/UserRepository";
import log from "@services/logger";
import ResponseBuilder from "@services/responseBuilder";
import MessageCodes from "@root/messageCodes";
import {Response, Request} from "express";

export default async function(req: Request, res: Response) {
	const parsed = USER_CREATE_SCHEMA.safeParse(req.body);

	if (parsed.error) {
		log.warn(parsed.error);
		return ResponseBuilder.BadRequest(res, parsed.error);
	}

	const reqBody = parsed.data

	UserRepository.findOne({
		where: [
			{mail: reqBody?.mail},
			{username: reqBody.username}
		]
	})
		.then(existedUser => {
			if (existedUser) return ResponseBuilder.BadRequest(res, MessageCodes.USER_MAIL_EXISTED);

			createUser(reqBody)
				.then(createdUser => {
					ResponseBuilder.Ok(res, createdUser);
				})
		})
		.catch(err => {
			log.error(err);
			return ResponseBuilder.InternalServerError(res);
		})
}