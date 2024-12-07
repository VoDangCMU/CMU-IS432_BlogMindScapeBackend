import {Request, Response} from "express";
import ResponseBuilder from "@services/responseBuilder";
import log from "@services/logger";
import PostRepository from "@database/repo/PostRepository";
import UserRepository from "@database/repo/UserRepository";
import DownvoteRepository, {createDownvote} from "@database/repo/DownvoteRepository";
import UpvoteRepository, {createUpvote} from "@database/repo/UpvoteRepository";
import MessageCodes from "@root/messageCodes";
import NUMBER from "@database/DataSchema/NUMBER";
import STRING from "@database/DataSchema/STRING";
import {z} from "zod";
import {emitNotification} from "@root/socket/client";
import {createNotification} from "@database/repo/NotificationRepository";

const PostUpdateDataParser = z.object({
	id: NUMBER,
	title: STRING.optional(),
	body: STRING.optional(),
})

export async function downvotePost(req: Request, res: Response) {
	const parsedPostID = NUMBER.safeParse(req.params.id);
	const parsedUserID = NUMBER.safeParse(req.headers["userID"]);

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
		return ResponseBuilder.Ok(res, existedPost);
	} catch (e) {
		log.error(e);
		return ResponseBuilder.InternalServerError(res, e);
	}
}

export async function updatePost(req: Request, res: Response) {
	let reqBody, userID;

	try {
		reqBody = PostUpdateDataParser.parse(req.body);
		userID = NUMBER.parse(req.headers["userID"]);
	} catch (e) {
		log.warn(e);
		return ResponseBuilder.BadRequest(res, e);
	}

	log.info(reqBody, userID);

	try {
		const existedPost = await PostRepository.findOne({
			where: {id: reqBody.id},
			relations: {user: true}
		});

		log.info(existedPost);

		if (!existedPost) return ResponseBuilder.NotFound(res, "POST_NOT_FOUND");
		if (existedPost.user.id != userID)
			return ResponseBuilder.Forbidden(res, "NOT_OWN_POST");

		existedPost.title = reqBody.title ? reqBody.title : existedPost.title;
		existedPost.body = reqBody.body ? reqBody.body : existedPost.body;

		await PostRepository.save(existedPost);

		return ResponseBuilder.Ok(
			res,
			existedPost!
		);
	} catch (e) {
		log.error(e);
		return ResponseBuilder.InternalServerError(res, e);
	}
}

export async function upvotePost(req: Request, res: Response) {
	let postID, userID;

	try {
		postID = NUMBER.parse(req.params.id);
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

		await createNotification("upvote", existedPost.user, user)
		emitNotification(existedPost.user);

		return ResponseBuilder.Ok(
			res,
			existedPost
		);
	} catch (e) {
		log.error(e);
		return ResponseBuilder.InternalServerError(res, e);
	}
}