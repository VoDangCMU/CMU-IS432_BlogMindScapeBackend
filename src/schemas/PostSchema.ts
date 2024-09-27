import { z } from "zod";
import CommonSchema from "./Common";
import UserSchema from "./UserSchema";

const CreatePostDataValidator = z.object({
  title: z.string(),
  body: z.string(),
});

const PasswordlessPost = z.object({
  id: CommonSchema.NumberSchema,
  title: z.string(),
  body: z.string(),
  upvote: CommonSchema.NumberSchema,
  downvote: CommonSchema.NumberSchema,
  user: UserSchema.PasswordlessUserSchema.optional(),
  upvotedUsers: z.array(UserSchema.PasswordlessUserSchema).optional(),
  downvotedUsers: z.array(UserSchema.PasswordlessUserSchema).optional(),
});

const UpdatePostParamsValidator = z.object({
  id: CommonSchema.NumberSchema,
  title: z.string().optional(),
  body: z.string().optional(),
});

const PostSchema = {
  CreatePostDataValidator,
  PasswordlessPost,
  UpdatePostParamsValidator,
};

export default PostSchema;
module.exports = PostSchema;
