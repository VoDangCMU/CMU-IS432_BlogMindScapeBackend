import { Request, Response } from "express";
import ResponseBuilder from "@services/responseBuilder";
import log from "@services/logger";
import {
  POST_CREATE_SCHEMA,
  POST_RESPONSE_SCHEMA,
  createPost,
} from "@database/repo/PostRepository";

export default async function _createPost(req: Request, res: Response) {
  const parsed = POST_CREATE_SCHEMA.safeParse(req.body);
  const userID = parseInt(req.headers["userID"] as string, 10);

  if (parsed.error) {
    log.warn(parsed.error);
    return ResponseBuilder.BadRequest(res, parsed.error);
  }

  const reqBody = parsed.data;

  try {
    const createdPost = await createPost(reqBody, userID);

    log.info(createdPost);

    return ResponseBuilder.Ok(res, POST_RESPONSE_SCHEMA.parse(createdPost));
  } catch (e) {
    log.warn(e);
    return ResponseBuilder.InternalServerError(res);
  }
}
