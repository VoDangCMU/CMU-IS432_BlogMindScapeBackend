import User from "@database/models/User";
import {AppDataSource} from "@database/DataSource";
import {z} from "zod";
import {BOOLEAN, DATE, MAIL, NUMBER, STRING} from "@database/repo/CommonSchemas";
import {hash} from "@services/hasher";
import MessageCodes from "@root/messageCodes";

const UserRepository = AppDataSource.getRepository(User);

export const USER_SCHEMA = z.object({
	id: NUMBER.optional(),
	username: STRING,
	mail: MAIL,
	dateOfBirth: DATE,
	fullname: STRING,
})

export const USER_CREATE_SCHEMA = USER_SCHEMA.extend({
	password: STRING,
});

export const USER_LOGIN_PARAMS_SCHEMA = z.object({
	username: z.string(),
	password: z.string(),
	keepLogin: BOOLEAN,
});

declare type UserCreateParams = z.TypeOf<typeof USER_CREATE_SCHEMA>;

export async function createUser(params: UserCreateParams) {
	let user = new User();

	user.dateOfBirth = new Date(params.dateOfBirth);
	user.fullname = params.fullname;
	user.mail = params.mail;
	user.username = params.username;
	user.password = hash(params.password);

	await UserRepository.save(user);

	return USER_SCHEMA.parse(user);
}

export async function getUserByEmailOrUsername(param: string) {
	let user = await UserRepository
		.createQueryBuilder()
		.addSelect("User.password")
		.where("username = :param or mail = :param", {param})
		.getOne();

	return user;
}

export async function isUserExisted(idOrUsernameOrMail: string) {
	let user = await UserRepository
		.createQueryBuilder()
		.select("id")
		.where("id = :param or username = :param or mail = :param", {param: idOrUsernameOrMail})
		.getOne();

	if (user !== null) return;

	throw new Error(MessageCodes.USER_NOT_EXISTED)
}

export async function isUserNotExisted(idOrUsernameOrMail: string) {
	let user = await UserRepository
		.createQueryBuilder()
		.select("id")
		.where("id = :param or username = :param or mail = :param", {param: idOrUsernameOrMail})
		.getOne();

	if (user == null) return;

	throw new Error(MessageCodes.USER_EXISTED);
}

export default UserRepository;
