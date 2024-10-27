import {Request, Response} from "express";
import ResponseBuilder from "@services/responseBuilder";
import log from "@services/logger";
import PostRepository from "@database/repo/PostRepository";
import MessageCodes from "@root/messageCodes";
import C from "@database/repo/CommonSchemas";

export default async function getPostByID(req: Request, res: Response) {
	const parsedPostID = C.NUMBER.safeParse(req.params.id);

	if (parsedPostID.error) {
		return ResponseBuilder.BadRequest(res, parsedPostID.error);
	}
	const postID = parsedPostID.data;
	PostRepository.findOne({where: {id: postID}, relations: {user: true}, select: {user: {}}})
		.then(existedPost => {
			if (!existedPost) return ResponseBuilder.NotFound(res, MessageCodes.POST_NOT_EXISTED);

			return ResponseBuilder.Ok(res, existedPost);
		})
		.catch((err) => {
			log.error(err);
			ResponseBuilder.InternalServerError(res);
		})
}
