import { Request, Response } from "express";
import { AppDataSource } from "@database/DataSource";
import ResponseBuilder from "@services/responseBuilder";
import CommentSchema from "@schemas/CommentSchema";
import C from "@schemas/Schemas";
import log from "@services/logger";
import Post from "@database/models/Post";
import User from "@database/models/User";
import Comment from "@database/models/Comment";

const postRepository = AppDataSource.getRepository(Post);
const userRepository = AppDataSource.getRepository(User);
const commentRepository = AppDataSource.getRepository(Comment);

export default async function createComment(req: Request, res: Response) {
  let reqBody, userID;

  try {
    reqBody = CommentSchema.CreateSchema.parse(req.body);
    userID = C.NUMBER.parse(req.headers["userID"]);
  } catch (e) {
    log("warn", e);
    return ResponseBuilder.BadRequest(res, e);
  }

  try {
    const user = await userRepository.findOne({ where: { id: userID } });
    const post = await postRepository.findOne({
      where: { id: reqBody.postID },
    });

    if (!user) return ResponseBuilder.NotFound(res, "USER_NOT_FOUND");
    if (!post) return ResponseBuilder.NotFound(res, "POST_NOT_FOUND");

    let createdComment = new Comment();

    if (reqBody.attachment) createdComment.attachment = reqBody.attachment;
    createdComment.body = reqBody.body;
    createdComment.user = user;
    createdComment.post = post;

    await commentRepository.save(createdComment);

    log("info", createdComment);

    return ResponseBuilder.Ok(
      res,
      CommentSchema.ResponseSchema.parse(createdComment)
    );
  } catch (e) {
    log("error", e);
    return ResponseBuilder.InternalServerError(res);
  }
}
