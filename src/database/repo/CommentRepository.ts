import { z } from "zod";
import { DATE, NUMBER, STRING, URL } from "./CommonSchemas";
import { USER_SCHEMA } from "./UserRepository";
import {AppDataSource} from "@database/DataSource";
import Comment from "@models/Comment";

const CommentRepository = AppDataSource.getRepository(Comment);

export const BASE_COMMENT = z.object({
  id: NUMBER.optional(),
  body: STRING.min(10),
  attachment: STRING.url().nullable().optional(),
})

export const COMMENT_CREATE_SCHEMA = BASE_COMMENT.extend({
  postID: NUMBER,
});

export const COMMENT_SCHEMA = BASE_COMMENT.extend({
  issueAt: DATE,
  user: USER_SCHEMA.optional(),
});

export const COMMENTS_SCHEMA = z.array(COMMENT_SCHEMA)

export const COMMENT_UPDATE_SCHEMA = z.object({
  id: NUMBER,
  body: STRING,
  attachment: STRING.url().optional(),
});

export default CommentRepository;