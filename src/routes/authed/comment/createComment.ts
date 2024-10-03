import { Request, Response } from "express";
import { Models, AppDataSource } from "../../../database";
import { CommonSchema, CommentSchema } from "../../../schemas";
import ResponseBuilder from "../../../services/responseBuilder";

const User = Models.User;
const Post = Models.Post;
const Comment = Models.Comment;
const postRepository = AppDataSource.getRepository(Post);
const userRepository = AppDataSource.getRepository(User);
const commentRepository = AppDataSource.getRepository(Comment);

export default async function createComment(req: Request, res: Response) {
  try {
    const reqBody = CommentSchema.CREATE_SCHEMA.parse(req.body);
    const userID = CommonSchema.NUMBER.parse(req.headers["userID"]);
  
    const user = await userRepository.findOne({ where: { id: userID } });
    const post = await postRepository.findOne({ where: { id: reqBody.postID } });
  
    if (!user) return ResponseBuilder.NotFound(res, "USER_NOT_FOUND");
    if (!post) return ResponseBuilder.NotFound(res, "POST_NOT_FOUND");
  
    let createdComment = new Comment();

    if (reqBody.attachment) createdComment.attachment = reqBody.attachment;
    createdComment.body = reqBody.body;
    createdComment.user = user;
    createdComment.post = post;
  
    await commentRepository.save(createdComment);
    return ResponseBuilder.Ok(res, createdComment);
  } catch(e) {
    return ResponseBuilder.BadRequest(res, e);
  }
}
