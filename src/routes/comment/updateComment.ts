import {Request, Response} from "express";
import ResponseBuilder from "@services/responseBuilder";
import log from "@services/logger";
import NUMBER from "@database/DataSchema/NUMBER";
import CommentRepository from "@database/repo/CommentRepository";
import STRING from "@database/DataSchema/STRING";
import {z} from "zod";

const CommentUpdateDataParser = z.object({
	body: STRING.optional(),
	attachment: STRING.url().optional(),
	id: NUMBER
})

export default async function updateComment(req: Request, res: Response) {
	let reqBody, userID;

	try {
		reqBody = CommentUpdateDataParser.parse(req.body);
		userID = NUMBER.parse(req.headers["userID"]);
	} catch (e) {
		log.warn(e);
		return ResponseBuilder.BadRequest(res, e);
	}

	try {
		log.info(reqBody);
		const existedComment = await CommentRepository.findOne({
			where: {id: reqBody.id,},
			relations: {
				user: true,
				post: {user: true,},
			},
		});

		log.info(existedComment);

		if (!existedComment)
			return ResponseBuilder.NotFound(res, "COMMENT_NOT_FOUND");
		if (existedComment.user.id != userID)
			return ResponseBuilder.Forbidden(res, "NOT_OWN_COMMENT");

		await CommentRepository.update(reqBody.id, reqBody);

		const updatedComment = await CommentRepository.findOne({
			where: {id: reqBody.id},
		});

		log.info(existedComment, updatedComment);

		return ResponseBuilder.Ok(
			res,
			updatedComment!
		);
	} catch (e) {
		log.error(e);
		return ResponseBuilder.InternalServerError(res);
	}
}
