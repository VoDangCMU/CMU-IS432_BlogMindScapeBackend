import { Request, Response, Router } from 'express';
import { isAuth } from '@root/middlewares/isAuth';
import { z } from 'zod';
import STRING from '@database/DataSchema/STRING';
import NUMBER from '@database/DataSchema/NUMBER';
import { AppDataSource } from '@database/DataSource';
import Comment from '@models/Comment';
import User from '@models/User';
import Post from '@models/Post';
import log from '@services/logger';
import ResponseBuilder from '@services/responseBuilder';
import { createNotification } from '@services/notification';
import { emitNotification } from '@root/socket/client';

const CommentRepository = AppDataSource.getRepository(Comment);
const UserRepository = AppDataSource.getRepository(User);
const PostRepository = AppDataSource.getRepository(Post);

const CommentCreationDataParser = z.object({
	body: STRING,
	attachment: STRING,
	postID: NUMBER,
});
const CommentUpdateDataParser = z.object({
	body: STRING.optional(),
	attachment: STRING.url().optional(),
	id: NUMBER,
});

const comment = Router();

comment.use(isAuth);
comment.post('/', createComment);
comment.put('/', updateComment);
comment.delete('/:id', deleteComment);

module.exports = comment;

export async function createComment(req: Request, res: Response) {
	let reqBody, userID;

	try {
		reqBody = CommentCreationDataParser.parse(req.body);
		userID = NUMBER.parse(req.headers['userID']);
	} catch (e) {
		log.warn(e);
		return ResponseBuilder.BadRequest(res, e);
	}

	try {
		const user = await UserRepository.findOne({ where: { id: userID } });
		const post = await PostRepository.findOne({
			where: { id: reqBody.postID },
			relations: {
				user: true,
			},
		});

		if (!user) return ResponseBuilder.NotFound(res, 'USER_NOT_FOUND');
		if (!post) return ResponseBuilder.NotFound(res, 'POST_NOT_FOUND');

		let createdComment = new Comment();

		if (reqBody.attachment) createdComment.attachment = reqBody.attachment;
		createdComment.body = reqBody.body;
		createdComment.user = user;
		createdComment.post = post;

		await CommentRepository.save(createdComment);

		log.info(createdComment);

		await createNotification('comment', post.user, user);
		emitNotification(post.user);

		return ResponseBuilder.Ok(res, createdComment);
	} catch (e) {
		log.error(e);
		return ResponseBuilder.InternalServerError(res);
	}
}
export async function deleteComment(req: Request, res: Response) {
	let commentID, userID;

	try {
		commentID = NUMBER.parse(req.params.id);
		userID = NUMBER.parse(req.headers['userID']);
	} catch (e) {
		log.warn(e);
		return ResponseBuilder.BadRequest(res, e);
	}

	try {
		const existedComment = await CommentRepository.findOne({
			where: {
				id: commentID,
			},
			relations: {
				user: true,
				post: {
					user: true,
				},
			},
		});

		log.info(existedComment);

		if (!existedComment)
			return ResponseBuilder.NotFound(res, 'COMMENT_NOT_FOUND');
		if (
			existedComment.user.id != userID ||
			existedComment.post.user.id != userID
		)
			return ResponseBuilder.Forbidden(res, 'NOT_OWN_COMMENT_OR_POST');

		await CommentRepository.delete(commentID);

		return ResponseBuilder.Ok(res, existedComment);
	} catch (e) {
		log.error('error', e);
		return ResponseBuilder.InternalServerError(res);
	}
}
export async function updateComment(req: Request, res: Response) {
	let reqBody, userID;

	try {
		reqBody = CommentUpdateDataParser.parse(req.body);
		userID = NUMBER.parse(req.headers['userID']);
	} catch (e) {
		log.warn(e);
		return ResponseBuilder.BadRequest(res, e);
	}

	try {
		log.info(reqBody);
		const existedComment = await CommentRepository.findOne({
			where: { id: reqBody.id },
			relations: {
				user: true,
				post: { user: true },
			},
		});

		log.info(existedComment);

		if (!existedComment)
			return ResponseBuilder.NotFound(res, 'COMMENT_NOT_FOUND');
		if (existedComment.user.id != userID)
			return ResponseBuilder.Forbidden(res, 'NOT_OWN_COMMENT');

		await CommentRepository.update(reqBody.id, reqBody);

		const updatedComment = await CommentRepository.findOne({
			where: { id: reqBody.id },
		});

		log.info(existedComment, updatedComment);

		return ResponseBuilder.Ok(res, updatedComment!);
	} catch (e) {
		log.error(e);
		return ResponseBuilder.InternalServerError(res);
	}
}
