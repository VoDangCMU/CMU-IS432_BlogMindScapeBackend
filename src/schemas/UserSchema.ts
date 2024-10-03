import { z } from "zod";
import CommonSchema from "./Common";

const FULL = z.object({
  id: CommonSchema.NUMBER.optional(),
  username: z.string(),
  mail: z.string().email(),
  fullname: z.string(),
  dateOfBirth: CommonSchema.DateSchema,
  password: z.string(),
});

const PASSLESS = z.object({
  id: CommonSchema.NUMBER.optional(),
  username: z.string(),
  mail: z.string().email(),
  fullname: z.string(),
  dateOfBirth: CommonSchema.DateSchema,
});

const LOGIN_PARAMS = z.object({
  username: z.string(),
  password: z.string(),
  keepLogin: z.enum(["true", "false"]).transform((value) => value === "true"),
});

const UserSchema = {
  FULL,
  LOGIN_PARAMS,
  PASSLESS,
};

export default UserSchema;
module.exports = UserSchema;
