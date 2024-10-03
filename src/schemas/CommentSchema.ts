import { z } from "zod";
import CommonSchema from "./Common";
import PostSchema from "./PostSchema";
import UserSchema from "./UserSchema";

const CREATE_SCHEMA = z.object({
  id: CommonSchema.NUMBER.optional(),
  body: z.string(),
  attachment: z.string().url().optional(),
  postID: CommonSchema.NUMBER
});

const GET = z.object({
  id: CommonSchema.NUMBER.optional(),
  body: z.string(),
  attachment: z.string().url().nullable().optional(),
  user: UserSchema.PASSLESS.optional()
});

const CommentSchema = {
  CREATE_SCHEMA,
  GET
};

export default CommentSchema;
module.exports = CommentSchema;
