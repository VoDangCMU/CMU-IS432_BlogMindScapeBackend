import { z } from "zod";
import { NUMBER, STRING, URL } from "./Schemas";
import UserSchema from "./UserSchema";

export const CreateSchema = z.object({
  id: NUMBER.optional(),
  body: STRING.min(10),
  attachment: STRING.url().nullable().optional(),
  postID: NUMBER
});

export const ResponseSchema = z.object({
  id: NUMBER.optional(),
  body: STRING,
  attachment: URL.nullable().optional(),
  user: UserSchema.ResponseSchema.optional()
});

export const UpdateSchema = z.object({
  id: NUMBER,
  body: STRING,
  attachment: STRING.url().optional(),
});

const CommentSchema = {
  CreateSchema,
  ResponseSchema,
  UpdateSchema
};

export default CommentSchema;
module.exports = CommentSchema;
