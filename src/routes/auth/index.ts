import { CookieOptions, Request, Response, Router } from 'express';
import { AppDataSource } from '@database/DataSource';
import { UserSession } from '@models/UserSession';
import { z } from 'zod';
import log from '@services/logger';
import ResponseBuilder from '@services/responseBuilder';
import { compare, hash } from '@services/hasher';
import { signToken } from '@services/jwt';
import User from '@models/User';
import STRING from '@database/DataSchema/STRING';
import DATE from '@database/DataSchema/DATE';
import MessageCodes from '@root/messageCodes';

const UserRepository = AppDataSource.getRepository(User);
const UserSessionRepository = AppDataSource.getRepository(UserSession);

export const LoginCredentialsParser = z.object({
	username: z.string(),
	password: z.string(),
	keepLogin: z.union([z.string(), z.boolean()]),
});
export const RegisterDataParser = z.object({
	username: STRING,
	mail: STRING,
	password: STRING,
	dateOfBirth: DATE,
	fullname: STRING,
	avatar: STRING.optional(),
});

const auth = Router();

auth.post('/register', register);
auth.post('/login', login);

module.exports = auth;

export async function pruneOldSession(userID: number) {
	const sessions = await UserSessionRepository.createQueryBuilder()
		.innerJoin('user', 'user')
		.where('user.id = :id', { id: userID })
		.andWhere(`(SELECT EXTRACT(DAY FROM NOW() - expiredOn)) > 7`)
		.delete()
		.execute();
}
function getTokenExpiredDate() {
	let expiresDate = new Date();
	expiresDate.setDate(expiresDate.getDate() + 7);

	return expiresDate;
}
function addDays(date: Date, days: number) {
	const newDate = new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
	return newDate;
}

export async function login(req: Request, res: Response) {
	let parsed = LoginCredentialsParser.safeParse(req.body);

	if (parsed.error) {
		log.warn(parsed.error);
		return ResponseBuilder.BadRequest(res, parsed.error);
	}

	const credentials = parsed.data;

	try {
		const user = await UserRepository.findOne({
			where: [
				{ username: credentials.username },
				{ mail: credentials.username },
			],
			select: { username: true, password: true, id: true },
		});

		// Invalid username or password
		if (!user || !compare(credentials.password, user.password))
			return ResponseBuilder.BadRequest(res, 'Incorrect username or password');

		const userSession = new UserSession();

		userSession.user = user;
		userSession.expiredOn = addDays(new Date(), 7);

		await UserSessionRepository.save(userSession);

		const token = signToken({
			userID: user.id.toString(),
			sessionID: userSession.id,
		});

		log.info(userSession);
		log.info('token', token);

		const expiresDate = getTokenExpiredDate();

		const cookieOps: CookieOptions = {
			expires: credentials.keepLogin ? expiresDate : undefined,
			sameSite: 'lax',
		};

		const loggedInUser = await UserRepository.findOne({
			where: { username: user.username },
		});

		log.info(loggedInUser);
		log.info('Pruning old session');
		await pruneOldSession(user.id);

		return res
			.cookie('jwt', token, cookieOps)
			.status(200)
			.json({ token, user: loggedInUser });
	} catch (e) {
		log.error(e);
		return ResponseBuilder.InternalServerError(res);
	}
}
export async function register(req: Request, res: Response) {
	const parsed = RegisterDataParser.safeParse(req.body);

	if (parsed.error) {
		log.warn(parsed.error);
		return ResponseBuilder.BadRequest(res, parsed.error);
	}

	const rawRegisterData = parsed.data;

	const existedUser = await UserRepository.findOne({
		where: [
			{ mail: rawRegisterData?.mail },
			{ username: rawRegisterData.username },
		],
	});

	if (existedUser)
		return ResponseBuilder.BadRequest(res, MessageCodes.USER_MAIL_EXISTED);

	const user = new User();

	user.dateOfBirth = new Date(rawRegisterData.dateOfBirth);
	user.fullname = rawRegisterData.fullname;
	user.mail = rawRegisterData.mail;
	user.username = rawRegisterData.username;
	user.password = hash(rawRegisterData.password);
	if (rawRegisterData.avatar) user.avatar = rawRegisterData.avatar;

	await UserRepository.save(user);

	return ResponseBuilder.Ok(res, user);
}
