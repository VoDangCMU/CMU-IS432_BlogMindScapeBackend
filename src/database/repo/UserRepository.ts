import User from "@database/models/User";
import { AppDataSource } from "@database/DataSource";
import { z } from "zod";
import { BOOLEAN, DATE, MAIL, NUMBER, STRING } from "@database/repo/CommonSchemas";
import { hash } from "@services/hasher";

const userRepository = AppDataSource.getRepository(User);

// Parser
export const BASE_USER = z.object({
  id: NUMBER.optional(),
  username: STRING,
  mail: MAIL,
  dateOfBirth: DATE,
  fullname: STRING,
});

export const USER_CREATE_SCHEMA = BASE_USER.extend({
  password: STRING,
});

export const USER_RESPONSE_SCHEMA = BASE_USER;
export const USERS_RESPONSE_SCHEMA = z.array(BASE_USER);

export const USER_LOGIN_PARAMS_SCHEMA = z.object({
  username: z.string(),
  password: z.string(),
  keepLogin: BOOLEAN,
});

declare type UserCreateParams = z.TypeOf<typeof USER_CREATE_SCHEMA>;
declare type BaseUser = z.TypeOf<typeof BASE_USER>;

declare type UserQueryParams = {
  id: number | undefined;
  username: string | undefined;
  mail: string | undefined;
  dateOfBirth: string | Date | undefined;
  fullname: string | undefined;
};

export async function createUser(params: UserCreateParams) {
  let user = new User();

  user.dateOfBirth = new Date(params.dateOfBirth);
  user.fullname = params.fullname;
  user.mail = params.mail;
  user.username = params.username;
  user.password = hash(params.password);

  await userRepository.save(user);

  return user;
}

export async function findUserByID(id: number | string) {
  const _id = NUMBER.parse(id);

  const user = await userRepository.findOne({ where: { id: _id } });

  return user;
}

export const findUser = userRepository.find;
export const findOneUser = userRepository.findOne;

export default userRepository;
