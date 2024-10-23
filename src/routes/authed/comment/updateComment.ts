import { Request, Response } from "express";
import { AppDataSource } from "@database/DataSource";
import ResponseBuilder from "@services/responseBuilder";
import C from "@database/repo/CommonSchemas";
import log from "@services/logger";
import Comment from "@database/models/Comment";
import { COMMENT_RESPONSE_SCHEMA, COMMENT_UPDATE_SCHEMA } from "@database/repo/CommentRepository";

const commentRepository = AppDataSource.getRepository(Comment);

export default async function updateComment(req: Request, res: Response) {
  let reqBody, userID;

  try {
    reqBody = COMMENT_UPDATE_SCHEMA.parse(req.body);
    userID = C.NUMBER.parse(req.headers["userID"]);
  } catch (e) {
    log.warn(e);
    return ResponseBuilder.BadRequest(res, e);
  }

  try {
    log.info(reqBody);
    const existedComment = await commentRepository.findOne({
      where: {
        id: reqBody.id,
      },
      relations: {
        user: true,
        post: {
          user: true,
        },
      },
    });

    log.info(existedComment);

    if (!existedComment)
      return ResponseBuilder.NotFound(res, "COMMENT_NOT_FOUND");
    if (existedComment.user.id != userID)
      return ResponseBuilder.Forbidden(res, "NOT_OWN_COMMENT");

    await commentRepository.update(reqBody.id, reqBody);

    const updatedComment = await commentRepository.findOne({
      where: { id: reqBody.id },
    });

    log.info(existedComment, updatedComment);

    return ResponseBuilder.Ok(
      res,
      COMMENT_RESPONSE_SCHEMA.parse(updatedComment)
    );
  } catch (e) {
    log.error(e);
    return ResponseBuilder.InternalServerError(res);
  }
}
