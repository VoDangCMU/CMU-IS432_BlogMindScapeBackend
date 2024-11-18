import {Request, Response} from "express";
import ResponseBuilder from "@services/responseBuilder";
import C from "@database/repo/CommonSchemas";
import log from "@services/logger";
import PostRepository, {POST_SCHEMA} from "@database/repo/PostRepository";
import MessageCodes from "@root/messageCodes";
import UserRepository from "@database/repo/UserRepository";
import DownvoteRepository from "@database/repo/DownvoteRepository";
import UpvoteRepository from "@database/repo/UpvoteRepository";

export function _deletePost(req: Request, res: Response) {
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

export async function unDownvotePost(req: Request, res: Response) {
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

export async function unUpvotePost(req: Request, res: Response) {
	let postID, userID;

	try {
		postID = C.NUMBER.parse(req.params.id);
		userID = C.NUMBER.parse(req.headers["userID"]);
	} catch (e) {
		log.warn(e);
		return ResponseBuilder.BadRequest(res, e);
	}

	try {
		const user = await UserRepository.findOne({
			where: { id: userID },
		});

		const existedPost = await PostRepository.findOne({
			where: { id: postID },
			relations: {
				user: true,
			},
		});

		if (!user) return ResponseBuilder.NotFound(res, MessageCodes.USER_NOT_EXISTED);
		if (!existedPost) return ResponseBuilder.NotFound(res, MessageCodes.POST_NOT_EXISTED);

		const existedUpvote = await UpvoteRepository.findOne({
			where: {
				user: {id: user.id},
				post: {id: existedPost.id}
			},
			relations: {user: true, post: true}
		})

		if (!existedUpvote) return ResponseBuilder.NotFound(res, MessageCodes.NOT_UPVOTE_YET);

		await UpvoteRepository.delete(existedUpvote);
		existedPost.upvote--;

		await PostRepository.save(existedPost);
		return ResponseBuilder.Ok(
			res,
			POST_SCHEMA.parse(existedPost)
		);
	} catch (e) {
		log.error(e);
		return ResponseBuilder.InternalServerError(res);
	}
}
