import {Request, Response} from "express";
import ResponseBuilder from "@services/responseBuilder";
import C from "@database/repo/CommonSchemas";
import log from "@services/logger";
import CommentRepository from "@database/repo/CommentRepository";

export default async function getPostComments(req: Request, res: Response) {
	let postID;

	const parsedPostId = C.NUMBER.safeParse(req.params.postId);

	if (parsedPostId.error) {
		log.warn(parsedPostId.error);

		return ResponseBuilder.BadRequest(res, parsedPostId.error);
	}

	const postId = parsedPostId.data;

	CommentRepository.find({
		where: {post: {id: postID}},
		relations: {user: true}
	})
		.then(comments => {
			return ResponseBuilder.Ok(res, comments);
		})
		.catch(err => {
			log.error(err);
			return ResponseBuilder.InternalServerError(res, err);
		})
}
