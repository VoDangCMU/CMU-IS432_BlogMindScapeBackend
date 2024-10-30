import {Request, Response} from "express";
import ResponseBuilder from "@services/responseBuilder";
import C from "@database/repo/CommonSchemas";
import log from "@services/logger";
import PostRepository, {POST_SCHEMA,} from "@database/repo/PostRepository";
import UserRepository from "@database/repo/UserRepository";
import DownvoteRepository, {createDownvote} from "@database/repo/DownvoteRepository";
import UpvoteRepository from "@database/repo/UpvoteRepository";
import MessageCodes from "@root/messageCodes";

export default async function downvotePost(req: Request, res: Response) {
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

	try {
		const user = await UserRepository.findOne({
			where: {id: userID},
		});

		const existedPost = await PostRepository.findOne({
			where: {id: postID},
			relations: {
				user: true,
			},
		});

		if (!user) return ResponseBuilder.NotFound(res, MessageCodes.USER_NOT_EXISTED);
		if (!existedPost) return ResponseBuilder.NotFound(res, MessageCodes.POST_NOT_EXISTED);

		const existedDownvote = await DownvoteRepository.findOne({
			where: {
				user: {id: user.id},
				post: {id: existedPost.id}
			},
			relations: {user: true, post: true}
		})

		const existedUpvote = await UpvoteRepository.findOne({
			where: {
				user: {id: user.id},
				post: {id: existedPost.id}
			},
			relations: {user: true, post: true}
		})

		if (existedDownvote) return ResponseBuilder.BadRequest(res, MessageCodes.ALREADY_DOWNVOTE);
		if (existedUpvote) return ResponseBuilder.BadRequest(res, MessageCodes.ALREADY_UPVOTE);

		await createDownvote(user, existedPost);
		existedPost.downvote++;

		await PostRepository.save(existedPost);
		return ResponseBuilder.Ok(res, POST_SCHEMA.parse(existedPost));
	} catch (e) {
		log.error(e);
		return ResponseBuilder.InternalServerError(res, e);
	}
}
