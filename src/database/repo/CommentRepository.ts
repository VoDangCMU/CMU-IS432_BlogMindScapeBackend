import { z } from "zod";
import { DATE, NUMBER, STRING, URL } from "./CommonSchemas";
import { USER_RESPONSE_SCHEMA } from "./UserRepository";

export const COMMENT_CREATE_SCHEMA = z.object({
  id: NUMBER.optional(),
  body: STRING.min(10),
  attachment: STRING.url().nullable().optional(),
  postID: NUMBER,
});

export const COMMENT_RESPONSE_SCHEMA = z.object({
  id: NUMBER.optional(),
  body: STRING,
  attachment: URL.nullable().optional(),
  issueAt: DATE,
  user: USER_RESPONSE_SCHEMA.optional(),
});

export const COMMENT_UPDATE_SCHEMA = z.object({
  id: NUMBER,
  body: STRING,
  attachment: STRING.url().optional(),
});
