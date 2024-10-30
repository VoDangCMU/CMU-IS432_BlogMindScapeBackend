import {Request, Response} from "express";
import ResponseBuilder from "@services/responseBuilder";
import C from "@database/repo/CommonSchemas";
import log from "@services/logger";
import PostRepository, {POST_SCHEMA} from "@database/repo/PostRepository";
import CommentRepository from "@database/repo/CommentRepository";
import MessageCodes from "@root/messageCodes";
import UpvoteRepository from "@database/repo/UpvoteRepository";

export default async function getPostUpvotes(req: Request, res: Response) {
	let postID;

	const parsedPostId = C.NUMBER.safeParse(req.params.postId);

	if (parsedPostId.error) {
		log.warn(parsedPostId.error);

		return ResponseBuilder.BadRequest(res, parsedPostId.error);
	}

	const postId = parsedPostId.data;

	UpvoteRepository.find({
		where: {
			post: {
				id: postId
			}
		},
		relations: {user: true}
	})
		.then((upvotes) => {
			const users = upvotes.map(e => e.user);

			return ResponseBuilder.Ok(res, users);
		})
		.catch((err) => {
			log.error(err);
			return ResponseBuilder.InternalServerError(res);
		})
}
