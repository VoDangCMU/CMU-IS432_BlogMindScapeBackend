import { z } from "zod";
import { BOOLEAN, DATE, MAIL, NUMBER, STRING } from "./Schemas";

const BASE_USER = z.object({
  id: NUMBER.optional(),
  username: STRING,
  mail: MAIL,
  dateOfBirth: DATE,
  fullname: STRING,
});

const CreateSchema = BASE_USER.extend({
  password: STRING,
});

const ResponseSchema = BASE_USER;

const LoginParamsSchema = z.object({
  username: z.string(),
  password: z.string(),
  keepLogin: BOOLEAN,
});

const UserParser = {
  CreateSchema,
  ResponseSchema,
  LoginParamsSchema,
};

export default UserParser;
module.exports = UserParser;
