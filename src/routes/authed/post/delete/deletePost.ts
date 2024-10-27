import {Request, Response} from "express";
import ResponseBuilder from "@services/responseBuilder";
import C from "@database/repo/CommonSchemas";
import log from "@services/logger";
import PostRepository from "@database/repo/PostRepository";
import MessageCodes from "@root/messageCodes";

export default function _deletePost(req: Request, res: Response) {
	const parsedPostID = C.NUMBER.safeParse(req.params.id);
	const parsedUserID = C.NUMBER.safeParse(req.headers["userID"]);

	if (parsedPostID.error) {
		log.warn(parsedPostID.error);
		return ResponseBuilder.BadRequest(res, parsedPostID.error);
	}

	if (parsedUserID.error) {
		log.warn(parsedUserID.error);
		return ResponseBuilder.BadRequest(res, parsedUserID.error);
	}

	const postID = parsedPostID.data;
	const userID = parsedUserID.data;

	PostRepository.findOne({
		where: {id: postID},
		relations: {user: true},
	})
		.then((existedPost) => {
			if (!existedPost) return ResponseBuilder.NotFound(res);

			if (existedPost.user.id != userID)
				return ResponseBuilder.Forbidden(res, MessageCodes.NOT_OWN_POST);

			PostRepository.delete(postID)
				.then(() => ResponseBuilder.Ok(res, existedPost));
		})
		.catch((err) => ResponseBuilder.InternalServerError(res, err));
}
