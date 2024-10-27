import { Request, Response } from "express";
import ResponseBuilder from "@services/responseBuilder";
import C from "@database/repo/CommonSchemas";
import log from "@services/logger";
import PostRepository, { POST_SCHEMA } from "@database/repo/PostRepository";
import UserRepository from "@database/repo/UserRepository";

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
        upvotedUsers: true,
      },
    });

    if (!user) return ResponseBuilder.NotFound(res, "USER");
    if (!existedPost) return ResponseBuilder.NotFound(res, "POST");
    if (!existedPost.upvotedUsers.some((e) => e.id == user.id))
      return ResponseBuilder.BadRequest(res, "NOT_UPVOTED_YET");

    existedPost.upvotedUsers = existedPost.upvotedUsers.filter(
      (e) => e.id != userID
    );
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
