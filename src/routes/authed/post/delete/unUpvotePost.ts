import { Request, Response } from "express";
import ResponseBuilder from "@services/responseBuilder";
import C from "@database/repo/CommonSchemas";
import log from "@services/logger";
import PostRepository, { POST_SCHEMA } from "@database/repo/PostRepository";
import UserRepository from "@database/repo/UserRepository";
import UpvoteRepository from "@database/repo/UpvoteRepository";
import MessageCodes from "@root/messageCodes";

export default async function unUpvotePost(req: Request, res: Response) {
  let postID, userID;

  try {
    postID = C.NUMBER.parse(req.params.id);
    userID = C.NUMBER.parse(req.headers["userID"]);
  } catch (e) {
    log.warn(e);
    return ResponseBuilder.BadRequest(res, e);
  }

  try {
    const user = await UserRepository.findOne({
      where: { id: userID },
    });

    const existedPost = await PostRepository.findOne({
      where: { id: postID },
      relations: {
        user: true,
      },
    });

    if (!user) return ResponseBuilder.NotFound(res, MessageCodes.USER_NOT_EXISTED);
    if (!existedPost) return ResponseBuilder.NotFound(res, MessageCodes.POST_NOT_EXISTED);

    const existedUpvote = await UpvoteRepository.findOne({
      where: {
        user: {id: user.id},
        post: {id: existedPost.id}
      },
      relations: {user: true, post: true}
    })

    if (!existedUpvote) return ResponseBuilder.NotFound(res, MessageCodes.NOT_UPVOTE_YET);

    await UpvoteRepository.delete(existedUpvote);
    existedPost.upvote--;

    await PostRepository.save(existedPost);
    return ResponseBuilder.Ok(
      res,
        POST_SCHEMA.parse(existedPost)
    );
  } catch (e) {
    log.error(e);
    return ResponseBuilder.InternalServerError(res);
  }
}
