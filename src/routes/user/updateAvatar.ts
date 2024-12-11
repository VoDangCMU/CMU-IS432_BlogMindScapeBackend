import {Request, Response} from "express";
import ResponseBuilder from "@services/responseBuilder";
import UserRepository from "@database/repo/UserRepository";

export default async function updateAvatar(req: Request, res: Response) {
	const userID = parseInt(req.headers.userID!.toString(), 10);
	const avatar = req.body.avatar;

	if (!avatar || avatar.length == 0)
		return ResponseBuilder.BadRequest(res, "AVATAR_MISSING");

	const existedUser = await UserRepository.findOne({
		where: {
			id: userID
		}
	});

	existedUser!.avatar = avatar;

	await UserRepository.save(existedUser!);
	return ResponseBuilder.Ok(res, existedUser!);
}