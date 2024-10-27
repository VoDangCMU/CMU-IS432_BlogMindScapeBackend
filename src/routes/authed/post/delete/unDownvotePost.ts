import {Request, Response} from "express";
import ResponseBuilder from "@services/responseBuilder";
import C from "@database/repo/CommonSchemas";
import log from "@services/logger";
import PostRepository, {POST_SCHEMA} from "@database/repo/PostRepository";
import UserRepository from "@database/repo/UserRepository";
import MessageCodes from "@root/messageCodes";

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

	UserRepository.findOneBy({id: userID})
		.then((existedUser) => {
			if (!existedUser) return ResponseBuilder.NotFound(res, MessageCodes.USER_NOT_EXISTED);
			PostRepository.findOne({
				where: {id: postID},
				relations: {
					user: true,
					downvotedUsers: true,
					upvotedUsers: true,
				},
			})
				.then((existedPost) => {
					if (!existedPost) return ResponseBuilder.NotFound(res, MessageCodes.POST_NOT_EXISTED);
					if (!existedPost.downvotedUsers.some((e) => e.id == existedUser.id))
						return ResponseBuilder.BadRequest(res, "NOT_DOWNVOTE_YET");

					existedPost.downvotedUsers = existedPost.downvotedUsers.filter(
						(e) => e.id != userID
					);
					existedPost.downvote--;

					PostRepository.save(existedPost)
						.then(() => ResponseBuilder.Ok(
							res,
							POST_SCHEMA.parse(existedPost)
						))
				})
		})
		.catch((err) => {
			log.error(err);
			return ResponseBuilder.InternalServerError(res, err);
		})
}
