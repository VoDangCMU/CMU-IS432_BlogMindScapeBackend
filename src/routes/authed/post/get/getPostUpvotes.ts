import { Request, Response } from "express";
import ResponseBuilder from "@services/responseBuilder";
import C from "@database/repo/CommonSchemas";
import log from "@services/logger";
import PostRepository, { POST_SCHEMA } from "@database/repo/PostRepository";
import CommentRepository from "@database/repo/CommentRepository";
import MessageCodes from "@root/messageCodes";

export default async function getPostUpvotes(req: Request, res: Response) {
	let postID;

	const parsedPostId = C.NUMBER.safeParse(req.params.postId);

	if (parsedPostId.error) {
		log.warn(parsedPostId.error);

		return ResponseBuilder.BadRequest(res, parsedPostId.error);
	}

	const postId = parsedPostId.data;

	PostRepository
		.findOne({where: {id: postId}, relations: {upvotedUsers: true}})
		.then((post) => {
			if (!post)
				return ResponseBuilder.NotFound(res, MessageCodes.POST_NOT_EXISTED);

			return ResponseBuilder.Ok(res, post.upvotedUsers);
		})
}
