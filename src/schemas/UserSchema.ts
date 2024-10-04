import { z } from "zod";
import { BOOLEAN, DATE, MAIL, NUMBER, STRING } from "./Schemas";

const BASE_USER = {
  id: NUMBER.optional(),
  username: STRING,
  mail: MAIL,
  dateOfBirth: DATE,
  fullname: STRING
}

const CreateSchema = z.object({
  ...BASE_USER,
  password: STRING,
});

const ResponseSchema = z.object(BASE_USER);

const LoginParamsSchema = z.object({
  username: z.string(),
  password: z.string(),
  keepLogin: BOOLEAN,
});

const UserParser = {
  CreateSchema,
  ResponseSchema,
  LoginParamsSchema
};

export default UserParser;
module.exports = UserParser;
