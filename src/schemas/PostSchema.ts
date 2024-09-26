import { z } from 'zod';
import User from '../database/models/User';

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

const PostSchema = {
  CreatePostDataValidator,
  CreatePostResponseValidator
}

export default PostSchema;
module.exports = PostSchema;