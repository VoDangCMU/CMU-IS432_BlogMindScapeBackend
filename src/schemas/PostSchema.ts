import { z } from "zod";
import CommonSchema from "./Common";
import UserSchema from "./UserSchema";
import CommentSchema from "./CommentSchema";

const CREATE = z.object({
  title: z.string(),
  body: z.string(),
});

const GET = z.object({
  id: CommonSchema.NUMBER,
  title: z.string(),
  body: z.string(),
  upvote: CommonSchema.NUMBER,
  downvote: CommonSchema.NUMBER,
  user: UserSchema.PASSLESS.optional(),
  upvotedUsers: z.array(UserSchema.PASSLESS).optional(),
  downvotedUsers: z.array(UserSchema.PASSLESS).optional(),
  comments: z.array(CommentSchema.GET).optional()
});

const UPDATE = z.object({
  id: CommonSchema.NUMBER,
  title: z.string().optional(),
  body: z.string().optional(),
});

const PostSchema = {
  CREATE,
  GET,
  UPDATE,
};

export default PostSchema;
module.exports = PostSchema;
