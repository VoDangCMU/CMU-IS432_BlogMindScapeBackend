import { z } from 'zod';
import CommonSchema from './Common';

const CreatePostDataValidator = z.object({
  title: z.string(),
  body: z.string()
});

const CreatePostResponseValidator = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  upvote: z.number(),
  downvote: z.number(),
  user: z.object({
    id: z.number(),
    username: z.string(),
    mail: z.string().email(),
    fullname: z.string(),
    dateOfBirth: z.date(),
  })
});

const UpdatePostParamsValidator = z.object({
  id: CommonSchema.NumberSchema,
  title: z.string().optional(),
  body: z.string().optional(),
});

const PostSchema = {
  CreatePostDataValidator,
  CreatePostResponseValidator,
  UpdatePostParamsValidator
}

export default PostSchema;
module.exports = PostSchema;