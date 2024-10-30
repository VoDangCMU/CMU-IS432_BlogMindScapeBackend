import {Request, Response} from "express";
import ResponseBuilder from "@services/responseBuilder";
import C from "@database/repo/CommonSchemas";
import log from "@services/logger";
import PostRepository, {POST_SCHEMA} from "@database/repo/PostRepository";
import UserRepository from "@database/repo/UserRepository";
import UpvoteRepository, {createUpvote} from "@database/repo/UpvoteRepository";
import MessageCodes from "@root/messageCodes";
import DownvoteRepository from "@database/repo/DownvoteRepository";

export default async function upvotePost(req: Request, res: Response) {
	let postID, userID;

	try {
		postID = C.NUMBER.parse(req.params.id);
		userID = parseInt(req.headers["userID"] as string, 10);
	} catch (e) {
		log.warn(e);
		return ResponseBuilder.BadRequest(res, e);
	}

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

		await createUpvote(user, existedPost);
		existedPost.upvote++;

		await PostRepository.save(existedPost);
		return ResponseBuilder.Ok(
			res,
			POST_SCHEMA.parse(existedPost)
		);
	} catch (e) {
		log.error(e);
		return ResponseBuilder.InternalServerError(res, e);
	}
}
