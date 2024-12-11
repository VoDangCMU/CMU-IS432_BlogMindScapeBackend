import { Request, Response, Router } from 'express';

import { isAuth } from '@root/middlewares/isAuth';
import { AppDataSource } from '@database/DataSource';
import User from '@models/User';
import Post from '@models/Post';
import { z } from 'zod';
import STRING from '@database/DataSchema/STRING';
import log from '@services/logger';
import ResponseBuilder from '@services/responseBuilder';
import NUMBER from '@database/DataSchema/NUMBER';
import MessageCodes from '@root/messageCodes';
import Comment from '@models/Comment';
import { createNotification } from '@services/notification';
import { emitNotification } from '@root/socket/client';
import Upvote from '@models/Upvote';
import Downvote from '@models/Downvote';

const UserRepository = AppDataSource.getRepository(User);
const PostRepository = AppDataSource.getRepository(Post);
const CommentRepository = AppDataSource.getRepository(Comment);
const UpvoteRepository = AppDataSource.getRepository(Upvote);
const DownvoteRepository = AppDataSource.getRepository(Downvote);

const PostCreationDataParser = z.object({
	title: STRING,
	body: STRING,
});
const PostUpdateDataParser = z.object({
	id: NUMBER,
	title: STRING.optional(),
	body: STRING.optional(),
});

const post = Router();

post.get('/:id', getPostByID);
post.post('/', isAuth, _createPost);
post.delete('/:id', isAuth, _deletePost);
post.put('/', isAuth, updatePost);
post.put('/upvote/:id', isAuth, upvotePost);
post.put('/downvote/:id', isAuth, downvotePost);
post.delete('/upvote/:id', isAuth, unUpvotePost);
post.delete('/downvote/:id', isAuth, unDownvotePost);

post.get('/comments/:postId', isAuth, getPostComments);
post.get('/upvotes/:postId', getPostUpvotes);
post.get('/downvotes/:postId', getPostDownvotes);

post.get('/status/upvote/:id', isAuth, isUpvoted);
post.get('/status/downvote/:id', isAuth, isDownvoted);
post.get('/status/vote/:id', isAuth, getVoteStatus);

post.get('/user/:id', getUserPosts);

module.exports = post;

export async function _createPost(req: Request, res: Response) {
	const parsed = PostCreationDataParser.safeParse(req.body);
	const userID: number = parseInt(req.headers.userID!.toString(), 10);

	if (parsed.error) {
		log.warn(parsed.error);
		return ResponseBuilder.BadRequest(res, parsed.error);
	}

	const rawPost = parsed.data;
	const author = await UserRepository.findOne({ where: { id: userID } });

	const createdPost = new Post();

	createdPost.title = rawPost.title;
	createdPost.body = rawPost.body;
	createdPost.user = author!;

	await PostRepository.save(createdPost);

	return ResponseBuilder.Ok(res, createdPost);
}

export function _deletePost(req: Request, res: Response) {
	const parsedPostID = NUMBER.safeParse(req.params.id);
	const parsedUserID = NUMBER.safeParse(req.headers['userID']);

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
		where: { id: postID },
		relations: { user: true },
	})
		.then((existedPost) => {
			if (!existedPost) return ResponseBuilder.NotFound(res);

			if (existedPost.user.id != userID)
				return ResponseBuilder.Forbidden(res, MessageCodes.NOT_OWN_POST);

			PostRepository.delete(postID).then(() =>
				ResponseBuilder.Ok(res, existedPost),
			);
		})
		.catch((err) => ResponseBuilder.InternalServerError(res, err));
}

export async function unDownvotePost(req: Request, res: Response) {
	const parsedPostID = NUMBER.safeParse(req.params.id);
	const parsedUserID = NUMBER.safeParse(req.headers['userID']);

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
		const existedUser = await UserRepository.findOneBy({ id: userID });
		const existedPost = await PostRepository.findOne({
			where: { id: postID },
			relations: {
				user: true,
			},
		});

		if (!existedUser)
			return ResponseBuilder.NotFound(res, MessageCodes.USER_NOT_EXISTED);
		if (!existedPost)
			return ResponseBuilder.NotFound(res, MessageCodes.POST_NOT_EXISTED);

		const existedDownvote = await DownvoteRepository.findOne({
			where: {
				user: { id: existedUser.id },
				post: { id: existedPost.id },
			},
			relations: { user: true, post: true },
		});

		if (!existedDownvote)
			return ResponseBuilder.BadRequest(res, MessageCodes.NOT_DOWNVOTE_YET);

		await DownvoteRepository.delete(existedDownvote.id);
		existedPost.downvote--;
		await PostRepository.save(existedPost);

		ResponseBuilder.Ok(res, existedPost);
	} catch (err) {
		log.error(err);
		return ResponseBuilder.InternalServerError(res, err);
	}
}

export async function unUpvotePost(req: Request, res: Response) {
	let postID, userID;

	log.info('Begin to un upvote');
	try {
		postID = NUMBER.parse(req.params.id);
		userID = NUMBER.parse(req.headers['userID']);
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

		if (!user)
			return ResponseBuilder.NotFound(res, MessageCodes.USER_NOT_EXISTED);
		if (!existedPost)
			return ResponseBuilder.NotFound(res, MessageCodes.POST_NOT_EXISTED);

		const existedUpvote = await UpvoteRepository.findOne({
			where: {
				user: { id: user.id },
				post: { id: existedPost.id },
			},
			relations: { user: true, post: true },
		});

		log.info(existedUpvote);

		if (!existedUpvote)
			return ResponseBuilder.NotFound(res, MessageCodes.NOT_UPVOTE_YET);

		await UpvoteRepository.delete(existedUpvote.id);
		existedPost.upvote--;

		await PostRepository.save(existedPost);
		return ResponseBuilder.Ok(res, existedPost);
	} catch (e) {
		log.error(e);
		return ResponseBuilder.InternalServerError(res);
	}
}

export async function getPostByID(req: Request, res: Response) {
	log.info(__filename);
	const parsedPostID = NUMBER.safeParse(req.params.id);

	if (parsedPostID.error) {
		log.warn(parsedPostID.error);
		return ResponseBuilder.BadRequest(res, parsedPostID.error);
	}
	const postID = parsedPostID.data;
	PostRepository.findOne({ where: { id: postID }, relations: { user: true } })
		.then((existedPost) => {
			if (!existedPost)
				return ResponseBuilder.NotFound(res, MessageCodes.POST_NOT_EXISTED);

			log.info(existedPost);
			return ResponseBuilder.Ok(res, existedPost);
		})
		.catch((err) => {
			log.error(err);
			ResponseBuilder.InternalServerError(res);
		});
}

export async function getPostComments(req: Request, res: Response) {
	const parsedPostId = NUMBER.safeParse(req.params.postId);

	if (parsedPostId.error) {
		log.warn(parsedPostId.error);

		return ResponseBuilder.BadRequest(res, parsedPostId.error);
	}

	const postId = parsedPostId.data;

	CommentRepository.find({
		where: { post: { id: postId } },
		relations: { user: true },
	})
		.then((comments) => {
			return ResponseBuilder.Ok(res, comments);
		})
		.catch((err) => {
			log.error(err);
			return ResponseBuilder.InternalServerError(res, err);
		});
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
				id: postId,
			},
		},
		relations: { user: true },
	})
		.then((downvotes) => {
			const users = downvotes.map((e) => e.user);

			return ResponseBuilder.Ok(res, users);
		})
		.catch((err) => {
			log.error(err);
			return ResponseBuilder.InternalServerError(res);
		});
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
				id: postId,
			},
		},
		relations: { user: true },
	})
		.then((upvotes) => {
			const users = upvotes.map((e) => e.user);

			return ResponseBuilder.Ok(res, users);
		})
		.catch((err) => {
			log.error(err);
			return ResponseBuilder.InternalServerError(res);
		});
}

export async function getUserPosts(req: Request, res: Response) {
	const userID = parseInt(req.params.id!.toString(), 10);

	PostRepository.find({
		where: {
			user: { id: userID },
		},
		relations: {
			user: true,
		},
	})
		.then((data) => {
			return ResponseBuilder.Ok(res, data);
		})
		.catch((err) => {
			log.error(err);
			return ResponseBuilder.InternalServerError(res);
		});
}

export async function isUpvoted(req: Request, res: Response) {
	const _postID = req.params.id;
	const userID = NUMBER.parse(req.headers.userID!);

	const parsed = NUMBER.safeParse(_postID);

	if (parsed.error) {
		return ResponseBuilder.BadRequest(res, parsed.error);
	}

	const postID = parsed.data;

	UpvoteRepository.findOne({
		where: {
			post: { id: postID },
			user: { id: userID },
		},
	})
		.then((existedUpvote) => {
			if (!existedUpvote) return ResponseBuilder.Ok(res, { isUpvoted: false });
			return ResponseBuilder.Ok(res, { isUpvoted: true });
		})
		.catch((err) => {
			log.error(err);
			return ResponseBuilder.InternalServerError(res);
		});
}

export async function isDownvoted(req: Request, res: Response) {
	const _postID = req.params.id;
	const userID = NUMBER.parse(req.headers.userID!);

	const parsed = NUMBER.safeParse(_postID);

	if (parsed.error) {
		return ResponseBuilder.BadRequest(res, parsed.error);
	}

	const postID = parsed.data;

	DownvoteRepository.findOne({
		where: {
			post: { id: postID },
			user: { id: userID },
		},
	})
		.then((existedDownvote) => {
			if (!existedDownvote)
				return ResponseBuilder.Ok(res, { isDownvoted: false });
			return ResponseBuilder.Ok(res, { isDownvoted: true });
		})
		.catch((err) => {
			log.error(err);
			return ResponseBuilder.InternalServerError(res);
		});
}

export async function getVoteStatus(req: Request, res: Response) {
	const _postID = req.params.id;
	const userID = NUMBER.parse(req.headers.userID!);

	const parsed = NUMBER.safeParse(_postID);

	if (parsed.error) {
		return ResponseBuilder.BadRequest(res, parsed.error);
	}

	const postID = parsed.data;

	try {
		const existedUpvote = await UpvoteRepository.findOne({
			where: {
				post: { id: postID },
				user: { id: userID },
			},
		});

		const existedDownvote = await DownvoteRepository.findOne({
			where: {
				post: { id: postID },
				user: { id: userID },
			},
		});

		log.info(existedDownvote, existedUpvote);

		return ResponseBuilder.Ok(res, {
			isDownvoted: existedDownvote !== null,
			isUpvoted: existedUpvote !== null,
		});
	} catch (err) {
		log.error(err);
		return ResponseBuilder.InternalServerError(res);
	}
}

export async function downvotePost(req: Request, res: Response) {
	const parsedPostID = NUMBER.safeParse(req.params.id);
	const parsedUserID = NUMBER.safeParse(req.headers['userID']);

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
			where: { id: userID },
		});

		const existedPost = await PostRepository.findOne({
			where: { id: postID },
			relations: {
				user: true,
			},
		});

		if (!user)
			return ResponseBuilder.NotFound(res, MessageCodes.USER_NOT_EXISTED);
		if (!existedPost)
			return ResponseBuilder.NotFound(res, MessageCodes.POST_NOT_EXISTED);

		const existedDownvote = await DownvoteRepository.findOne({
			where: {
				user: { id: user.id },
				post: { id: existedPost.id },
			},
			relations: { user: true, post: true },
		});

		const existedUpvote = await UpvoteRepository.findOne({
			where: {
				user: { id: user.id },
				post: { id: existedPost.id },
			},
			relations: { user: true, post: true },
		});

		if (existedDownvote)
			return ResponseBuilder.BadRequest(res, MessageCodes.ALREADY_DOWNVOTE);
		if (existedUpvote)
			return ResponseBuilder.BadRequest(res, MessageCodes.ALREADY_UPVOTE);

		const downvote = new Downvote();

		downvote.user = user;
		downvote.post = existedPost;

		await DownvoteRepository.save(downvote);

		existedPost.downvote++;

		await PostRepository.save(existedPost);

		await createNotification('downvote', existedPost.user, user);
		emitNotification(existedPost.user);

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
		userID = NUMBER.parse(req.headers['userID']);
	} catch (e) {
		log.warn(e);
		return ResponseBuilder.BadRequest(res, e);
	}

	log.info(reqBody, userID);

	try {
		const existedPost = await PostRepository.findOne({
			where: { id: reqBody.id },
			relations: { user: true },
		});

		log.info(existedPost);

		if (!existedPost) return ResponseBuilder.NotFound(res, 'POST_NOT_FOUND');
		if (existedPost.user.id != userID)
			return ResponseBuilder.Forbidden(res, 'NOT_OWN_POST');

		existedPost.title = reqBody.title ? reqBody.title : existedPost.title;
		existedPost.body = reqBody.body ? reqBody.body : existedPost.body;

		await PostRepository.save(existedPost);

		return ResponseBuilder.Ok(res, existedPost!);
	} catch (e) {
		log.error(e);
		return ResponseBuilder.InternalServerError(res, e);
	}
}

export async function upvotePost(req: Request, res: Response) {
	let postID, userID;

	try {
		postID = NUMBER.parse(req.params.id);
		userID = parseInt(req.headers['userID'] as string, 10);
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

		if (!user)
			return ResponseBuilder.NotFound(res, MessageCodes.USER_NOT_EXISTED);
		if (!existedPost)
			return ResponseBuilder.NotFound(res, MessageCodes.POST_NOT_EXISTED);

		const existedDownvote = await DownvoteRepository.findOne({
			where: {
				user: { id: user.id },
				post: { id: existedPost.id },
			},
			relations: { user: true, post: true },
		});

		const existedUpvote = await UpvoteRepository.findOne({
			where: {
				user: { id: user.id },
				post: { id: existedPost.id },
			},
			relations: { user: true, post: true },
		});

		if (existedDownvote)
			return ResponseBuilder.BadRequest(res, MessageCodes.ALREADY_DOWNVOTE);
		if (existedUpvote)
			return ResponseBuilder.BadRequest(res, MessageCodes.ALREADY_UPVOTE);

		const upvote = new Upvote();

		upvote.user = user;
		upvote.post = existedPost;

		await UpvoteRepository.save(upvote);

		existedPost.upvote++;

		await PostRepository.save(existedPost);

		await createNotification('upvote', existedPost.user, user);
		emitNotification(existedPost.user);

		return ResponseBuilder.Ok(res, existedPost);
	} catch (e) {
		log.error(e);
		return ResponseBuilder.InternalServerError(res, e);
	}
}
