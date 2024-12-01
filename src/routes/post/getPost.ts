import {Request, Response} from "express";
import ResponseBuilder from "@services/responseBuilder";
import log from "@services/logger";
import PostRepository from "@database/repo/PostRepository";
import MessageCodes from "@root/messageCodes";
import CommentRepository from "@database/repo/CommentRepository";
import DownvoteRepository from "@database/repo/DownvoteRepository";
import UpvoteRepository from "@database/repo/UpvoteRepository";
import NUMBER from "@database/DataSchema/NUMBER";

export async function getPostByID(req: Request, res: Response) {
	log.info(__filename)
	const parsedPostID = NUMBER.safeParse(req.params.id);

	if (parsedPostID.error) {
		log.warn(parsedPostID.error)
		return ResponseBuilder.BadRequest(res, parsedPostID.error);
	}
	const postID = parsedPostID.data;
	PostRepository.findOne({where: {id: postID}, relations: {user: true}})
		.then(existedPost => {
			if (!existedPost) return ResponseBuilder.NotFound(res, MessageCodes.POST_NOT_EXISTED);

			log.info(existedPost);
			return ResponseBuilder.Ok(res, existedPost);
		})
		.catch((err) => {
			log.error(err);
			ResponseBuilder.InternalServerError(res);
		})
}

export async function getPostComments(req: Request, res: Response) {
	let postID;

	const parsedPostId = NUMBER.safeParse(req.params.postId);

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

export async function getPostDownvotes(req: Request, res: Response) {
	let postID;

	const parsedPostId = NUMBER.safeParse(req.params.postId);

	if (parsedPostId.error) {
		log.warn(parsedPostId.error);

		return ResponseBuilder.BadRequest(res, parsedPostId.error);
	}

	const postId = parsedPostId.data;

	DownvoteRepository.find({
		where: {
			post: {
				id: postId
			}
		},
		relations: {user: true}
	})
		.then((downvotes) => {
			const users = downvotes.map(e => e.user);

			return ResponseBuilder.Ok(res, users);
		})
		.catch((err) => {
			log.error(err);
			return ResponseBuilder.InternalServerError(res);
		})
}

export async function getPostUpvotes(req: Request, res: Response) {
	let postID;

	const parsedPostId = NUMBER.safeParse(req.params.postId);

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