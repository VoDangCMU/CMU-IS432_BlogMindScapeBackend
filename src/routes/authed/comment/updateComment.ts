import { Request, Response } from "express";
import { Models, AppDataSource } from "../../../database";
import ResponseBuilder from "@services/responseBuilder";
import CommentSchema from "../../../schemas/CommentSchema";
import C from "../../../schemas/Schemas";
import log from "@services/logger";

const User = Models.User;
const Post = Models.Post;
const Comment = Models.Comment;
const commentRepository = AppDataSource.getRepository(Comment);

export default async function updateComment(req: Request, res: Response) {
  try {
    const reqBody = CommentSchema.UpdateSchema.parse(req.body);
    const userID = C.NUMBER.parse(req.headers["userID"]);
  
    log('info', reqBody)

    const existedComment = await commentRepository.findOne({
      where: {
        id: reqBody.id
      },
      relations: {
        user: true,
        post: {
          user: true
        }
      }
    })

    log('info', existedComment)
  
    if (!existedComment) return ResponseBuilder.NotFound(res, "COMMENT_NOT_FOUND");
    if (existedComment.user.id != userID || existedComment.post.user.id != userID) 
      return ResponseBuilder.Forbidden(res, "NOT_OWN_COMMENT_OR_POST")

    await commentRepository.update(reqBody.id, reqBody);

    const updatedComment = await commentRepository.findOne({ where: { id: reqBody.id }});
    log('info', existedComment, updatedComment);
    return ResponseBuilder.Ok(res, CommentSchema.ResponseSchema.parse(updatedComment));
  } catch(e) {
    log('warn', e)
    return ResponseBuilder.BadRequest(res, e);
  }
}