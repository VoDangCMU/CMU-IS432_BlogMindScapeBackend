import { Request, Response } from "express";
import ResponseBuilder from "@services/responseBuilder";
import C from "@database/repo/CommonSchemas";
import log from "@services/logger";
import postRepository, { findOnePost, POST_RESPONSE_SCHEMA, POST_UPDATE_SCHEMA } from "@database/repo/PostRepository";

export default async function updatePost(req: Request, res: Response) {
  let reqBody, userID;

  try {
    reqBody = POST_UPDATE_SCHEMA.parse(req.body);
    userID = C.NUMBER.parse(req.headers["userID"]);
  } catch (e) {
    log.warn(e);
    return ResponseBuilder.BadRequest(res, e);
  }

  try {
    const existedPost = await findOnePost({
      where: { id: reqBody.id },
    });

    if (!existedPost) ResponseBuilder.NotFound(res, "POST_NOT_FOUND");
    if (existedPost?.user.id != userID)
      ResponseBuilder.Forbidden(res, "NOT_OWN_POST");

    await postRepository.save(reqBody);

    const updatedPost = await findOnePost({
      where: { id: reqBody.id },
      relations: { user: true },
    });

    return ResponseBuilder.Ok(
      res,
      POST_RESPONSE_SCHEMA.parse(updatedPost!)
    );
  } catch (e) {
    log.error(e);
    return ResponseBuilder.InternalServerError(res, e);
  }
}
