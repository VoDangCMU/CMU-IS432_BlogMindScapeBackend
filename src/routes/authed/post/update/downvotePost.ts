import {Request, Response} from "express";
import ResponseBuilder from "@services/responseBuilder";
import C from "@database/repo/CommonSchemas";
import log from "@services/logger";
import PostRepository, {POST_SCHEMA,} from "@database/repo/PostRepository";
import UserRepository from "@database/repo/UserRepository";

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
				downvotedUsers: true,
				upvotedUsers: true,
			},
		});

		if (!user) return ResponseBuilder.NotFound(res, "USER_NOT_FOUND");
		if (!existedPost) return ResponseBuilder.NotFound(res, "POST_NOT_FOUND");
		if (existedPost.downvotedUsers.some((e) => e.id == user.id))
			return ResponseBuilder.BadRequest(res, "ALREADY_DOWNVOTE");
		if (existedPost.upvotedUsers.some((e) => e.id == user.id))
			return ResponseBuilder.BadRequest(res, "ALREADY_UPVOTED");

		existedPost.downvotedUsers.push(user);
		existedPost.downvote++;

		await PostRepository.save(existedPost);
		return ResponseBuilder.Ok(res, POST_SCHEMA.parse(existedPost));
	} catch (e) {
		log.error(e);
		return ResponseBuilder.InternalServerError(res, e);
	}
}
