import { Request, Response, Router } from 'express';
import { isAuth } from '@root/middlewares/isAuth';

import ResponseBuilder from '@services/responseBuilder';
import log from '@services/logger';

import MessageCodes from '@root/messageCodes';

import { AppDataSource } from '@database/DataSource';
import NUMBER from '@database/DataSchema/NUMBER';
import User from '@models/User';
import Upvote from '@models/Upvote';
import Post from '@models/Post';
import Downvote from '@models/Downvote';
import { UserSession } from '@models/UserSession';
import { pruneOldSession } from '@routes/auth';

const UserRepository = AppDataSource.getRepository(User);
const PostRepository = AppDataSource.getRepository(Post);
const UpvoteRepository = AppDataSource.getRepository(Upvote);
const DownvoteRepository = AppDataSource.getRepository(Downvote);
const UserSessionRepository = AppDataSource.getRepository(UserSession);

const user = Router();

user.use(isAuth);
user.post('/:id', isAuth, logout);
user.get('/:id', getUserByID);
user.post('/logout', isAuth, logout);
user.get('/current/userUpvotes', isAuth, getUserUpvotes);
user.get('/current/userDownvotes', isAuth, getUserDownvotes);
user.get('/current/me', isAuth, me);
user.get('/current/posts', isAuth, userPosts);

user.put('/updateAvatar', isAuth, updateAvatar);

module.exports = user;

export async function me(req: Request, res: Response) {
	const userID = parseInt(req.headers.userID!.toString());

	UserRepository.findOne({
		where: {
			id: userID,
		},
	})
		.then((existedUser) => {
			if (!existedUser) {
				// d bh chay vao day duoc luon
				return ResponseBuilder.InternalServerError(res);
			}

			return ResponseBuilder.Ok(res, existedUser);
		})
		.catch((err) => {
			log.error(err);
			return ResponseBuilder.InternalServerError(res);
		});
}

export async function logout(req: Request, res: Response) {
	const _sessionID = req.headers.sessionID;
	const _userID = req.headers.userID;

	if (!_sessionID) return ResponseBuilder.Unauthorize(res, 'Invalid session');
	if (!_userID) return ResponseBuilder.Unauthorize(res, 'Invalid user ID');

	const sessionID = _sessionID.toString();
	const userID = parseInt(_userID.toString(), 10);

	const userSession = await UserSessionRepository.findOne({
		where: { id: sessionID },
		relations: {
			user: true,
		},
	});

	if (!userSession) return ResponseBuilder.Unauthorize(res, 'Invalid session');

	try {
		await UserSessionRepository.createQueryBuilder()
			.delete()
			.where('id = :id', { id: sessionID })
			.execute();

		pruneOldSession(userID).catch((err) => {
			log.error(err);
		});

		return ResponseBuilder.Ok(res, userSession);
	} catch (err) {
		log.error(err);
		return ResponseBuilder.InternalServerError(res);
	}
}

export async function getUserByID(req: Request, res: Response) {
	const _userID = req.params.id;

	const parsed = NUMBER.safeParse(_userID);

	if (parsed.error) {
		return ResponseBuilder.BadRequest(res, parsed.error);
	}

	const userID = parsed.data;

	UserRepository.findOne({
		where: { id: userID },
	})
		.then((existedUser) => {
			if (!existedUser)
				return ResponseBuilder.NotFound(res, MessageCodes.USER_MAIL_EXISTED);

			return ResponseBuilder.Ok(res, existedUser);
		})
		.catch((err) => {
			log.error(err);
			ResponseBuilder.InternalServerError(res);
		});
}

export async function getUserUpvotes(req: Request, res: Response) {
	try {
		const userUpVotes = await UpvoteRepository.find({
			relations: { post: true },
			order: { createdAt: 'DESC' },
		});

		const result = userUpVotes.reduce((acc: any, curr: Upvote) => {
			return [...acc, curr.post];
		}, []);

		log.info(result);
		return ResponseBuilder.Ok(res, result);
	} catch (e) {
		log.error(e);
		return ResponseBuilder.InternalServerError(res);
	}
}

export async function userPosts(req: Request, res: Response) {
	log.info(req.headers.userID);
	const userID = parseInt(req.headers.userID!.toString(), 10);

	PostRepository.find({
		where: {
			user: { id: userID },
		},
		relations: {
			user: true,
		},
	})
		.then((posts) => {
			return ResponseBuilder.Ok(res, posts);
		})
		.catch((err) => {
			log.error(err);
			return ResponseBuilder.InternalServerError(res);
		});
}

export async function getUserDownvotes(req: Request, res: Response) {
	try {
		const userDownvotes = await DownvoteRepository.find({
			relations: { post: true },
			order: { createdAt: 'DESC' },
		});

		const result = userDownvotes.reduce((acc: any, curr: Downvote) => {
			return [...acc, curr.post];
		}, []);

		log.info(result);
		return ResponseBuilder.Ok(res, result);
	} catch (e) {
		log.error(e);
		return ResponseBuilder.InternalServerError(res, e);
	}
}

export async function updateAvatar(req: Request, res: Response) {
	const userID = parseInt(req.headers.userID!.toString(), 10);
	const avatar = req.body.avatar;

	if (!avatar || avatar.length == 0)
		return ResponseBuilder.BadRequest(res, 'AVATAR_MISSING');

	const existedUser = await UserRepository.findOne({
		where: {
			id: userID,
		},
	});

	existedUser!.avatar = avatar;

	await UserRepository.save(existedUser!);
	return ResponseBuilder.Ok(res, existedUser!);
}
