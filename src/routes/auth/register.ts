import UserRepository, {createUser} from "@database/repo/UserRepository";
import log from "@services/logger";
import ResponseBuilder from "@services/responseBuilder";
import MessageCodes from "@root/messageCodes";
import {Request, Response} from "express";
import {z} from "zod";
import DATE from "@database/DataSchema/DATE";
import STRING from "@database/DataSchema/STRING";

const RegisterDataParser = z.object({
	username: STRING,
	mail: STRING,
	password: STRING,
	dateOfBirth: DATE,
	fullname: STRING,
	avatar: STRING.optional(),
})

export default async function (req: Request, res: Response) {
	const parsed = RegisterDataParser.safeParse(req.body);

	if (parsed.error) {
		log.warn(parsed.error);
		return ResponseBuilder.BadRequest(res, parsed.error);
	}

	const rawRegisterData = parsed.data

	UserRepository.findOne({
		where: [
			{mail: rawRegisterData?.mail},
			{username: rawRegisterData.username}
		]
	})
		.then(existedUser => {
			if (existedUser) return ResponseBuilder.BadRequest(res, MessageCodes.USER_MAIL_EXISTED);

			createUser(rawRegisterData)
				.then(createdUser => {
					ResponseBuilder.Ok(res, createdUser);
				})
		})
		.catch(err => {
			log.error(err);
			return ResponseBuilder.InternalServerError(res);
		})
}