import { Request, Response } from "express";
import ResponseBuilder from "@services/responseBuilder";
import C from "@database/repo/CommonSchemas";
import log from "@services/logger";
import PostRepository, { POST_SCHEMA, POST_UPDATE_SCHEMA } from "@database/repo/PostRepository";

export default async function updatePost(req: Request, res: Response) {
  let reqBody, userID;

  try {
    reqBody = POST_UPDATE_SCHEMA.parse(req.body);
    userID = C.NUMBER.parse(req.headers["userID"]);
  } catch (e) {
    log.warn(e);
    return ResponseBuilder.BadRequest(res, e);
  }

  log.info(reqBody, userID);

  try {
    const existedPost = await PostRepository.findOne({
      where: { id: reqBody.id },
      relations: {user: true}
    });

    log.info(existedPost);

    if (!existedPost) return ResponseBuilder.NotFound(res, "POST_NOT_FOUND");
    if (existedPost.user.id != userID)
      return ResponseBuilder.Forbidden(res, "NOT_OWN_POST");

    existedPost.upvote++;

    await PostRepository.save(existedPost);

    const updatedPost = await PostRepository.findOne({
      where: { id: reqBody.id },
      relations: { user: true },
    });

    return ResponseBuilder.Ok(
      res,
      POST_SCHEMA.parse(updatedPost!)
    );
  } catch (e) {
    log.error(e);
    return ResponseBuilder.InternalServerError(res, e);
  }
}
