import {Request, Response} from "express";
import ResponseBuilder from "@services/responseBuilder";
import C from "@database/repo/CommonSchemas";
import log from "@services/logger";
import PostRepository from "@database/repo/PostRepository";
import UserRepository from "@database/repo/UserRepository";
import MessageCodes from "@root/messageCodes";
import DownvoteRepository from "@database/repo/DownvoteRepository";

export default async function unDownvotePost(req: Request, res: Response) {
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
		const existedUser = await UserRepository.findOneBy({id: userID});
		const existedPost = await PostRepository.findOne({
			where: {id: postID},
			relations: {
				user: true,
			},
		});

		if (!existedUser) return ResponseBuilder.NotFound(res, MessageCodes.USER_NOT_EXISTED);
		if (!existedPost) return ResponseBuilder.NotFound(res, MessageCodes.POST_NOT_EXISTED);

		const existedDownvote = await DownvoteRepository.findOne({
			where: {
				user: {id: existedUser.id},
				post: {id: existedPost.id}
			},
			relations: {user: true, post: true}
		});

		if (!existedDownvote) return ResponseBuilder.BadRequest(res, MessageCodes.NOT_DOWNVOTE_YET);

		existedPost.downvote--;
		await PostRepository.save(existedPost);

		ResponseBuilder.Ok(
			res,
			existedPost
		);
	} catch (err) {
		log.error(err);
		return ResponseBuilder.InternalServerError(res, err);
	}
}
