import { z } from "zod";
import { NUMBER, STRING } from "./Schemas";
import UserSchema from "./UserSchema";
import CommentSchema from "./CommentSchema";

const BASE_POST = z.object({
  id: NUMBER.optional(),
  title: STRING,
  body: STRING,
  upvote: NUMBER,
  downvote: NUMBER,
});

const CreateSchema = z.object({
  title: STRING,
  body: STRING,
});

const ResponseSchema = BASE_POST.extend({
  user: UserSchema.ResponseSchema.optional(),
  upvotedUsers: z.array(UserSchema.ResponseSchema).optional(),
  downvotedUsers: z.array(UserSchema.ResponseSchema).optional(),
  comments: z.array(CommentSchema.ResponseSchema).optional(),
});

const UpdateSchema = z.object({
  id: NUMBER,
  title: STRING.optional(),
  body: STRING.optional(),
});

const PostSchema = {
  CreateSchema,
  ResponseSchema,
  UpdateSchema,
};

export default PostSchema;
module.exports = PostSchema;
