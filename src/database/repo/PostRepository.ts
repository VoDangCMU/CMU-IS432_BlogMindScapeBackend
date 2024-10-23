import { AppDataSource } from "@database/DataSource";
import Post from "@database/models/Post";
import { NUMBER, STRING } from "@database/repo/CommonSchemas";
import { z } from "zod";
import {
  findOneUser,
  USER_RESPONSE_SCHEMA,
  USERS_RESPONSE_SCHEMA,
} from "./UserRepository";

const postRepository = AppDataSource.getRepository(Post);

export const BASE_POST = z.object({
  id: NUMBER.optional(),
  title: STRING,
  body: STRING,
  upvote: NUMBER,
  downvote: NUMBER,
});

export const POST_CREATE_SCHEMA = z.object({
  title: STRING,
  body: STRING,
});

export const POST_RESPONSE_SCHEMA = BASE_POST.extend({
  user: USER_RESPONSE_SCHEMA.optional(),
  upvotedUsers: USERS_RESPONSE_SCHEMA,
  downvotedUsers: USERS_RESPONSE_SCHEMA,
  comments: USERS_RESPONSE_SCHEMA,
});

export const POST_UPDATE_SCHEMA = z.object({
  id: NUMBER,
  title: STRING.optional(),
  body: STRING.optional(),
});

declare type BasePost = z.TypeOf<typeof BASE_POST>;
declare type PostCreateSchema = z.TypeOf<typeof POST_CREATE_SCHEMA>;

export async function createPost(
  params: PostCreateSchema,
  authorID: number | string
) {
  const _authorID = NUMBER.parse(authorID);
  const author = await findOneUser({ where: { id: _authorID } });

  if (!author) throw new Error("USER_NOT_FOUND");

  let createdPost = new Post();

  createdPost.title = params.title;
  createdPost.body = params.body;
  createdPost.user = author;

  await postRepository.save(createdPost);

  return createdPost;
}

export async function findPostByID(postID: number | string) {
  const post = await postRepository.findOne({
    where: { id: NUMBER.parse(postID) },
  });

  return post;
}

export async function deletePost(postID: number | string) {
  postRepository.delete(postID);
}

export const findPost = postRepository.find;
export const findOnePost = postRepository.findOne;

export default postRepository;
