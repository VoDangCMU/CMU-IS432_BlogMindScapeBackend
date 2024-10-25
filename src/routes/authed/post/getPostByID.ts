import { Request, Response } from "express";
import ResponseBuilder from "@services/responseBuilder";
import C from "@database/repo/CommonSchemas";
import log from "@services/logger";
import postRepository, { POST_RESPONSE_SCHEMA } from "@database/repo/PostRepository";

export default async function getPostByID(req: Request, res: Response) {
  let postID;
  try {
    postID = C.NUMBER.parse(req.params.id);
  } catch (e) {
    log.warn(e);
    ResponseBuilder.BadRequest(res, e);
  }
  try {
    const existedPost = await postRepository.findOne({
      where: { id: postID },
      relations: {
        user: true,
        upvotedUsers: true,
        downvotedUsers: true,
        comments: {
          user: true,
        },
      },
    });

    log.info(existedPost);

    if (existedPost)
      return ResponseBuilder.Ok(
        res,
        POST_RESPONSE_SCHEMA.parse(existedPost)
      );
    return ResponseBuilder.NotFound(res, "POST_NOT_FOUND");
  } catch (e) {
    log.error(e);
    ResponseBuilder.InternalServerError(res);
  }
}
