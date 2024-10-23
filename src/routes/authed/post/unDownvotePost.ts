import { Request, Response } from "express";
import ResponseBuilder from "@services/responseBuilder";
import C from "@database/repo/CommonSchemas";
import log from "@services/logger";
import postRepository, { findOnePost, POST_RESPONSE_SCHEMA } from "@database/repo/PostRepository";
import { findOneUser } from "@database/repo/UserRepository";

export default async function unDownvotePost(req: Request, res: Response) {
  let postID, userID;

  try {
    postID = C.NUMBER.parse(req.params.id);
    userID = C.NUMBER.parse(req.headers["userID"]);
  } catch (e) {
    log.warn(e);
    return ResponseBuilder.BadRequest(res, e);
  }
  
  try {
    const user = await findOneUser({
      where: { id: userID },
    });

    const existedPost = await findOnePost({
      where: { id: postID },
      relations: {
        user: true,
        downvotedUsers: true,
        upvotedUsers: true,
      },
    });

    if (!user) return ResponseBuilder.NotFound(res, "USER_NOT_FOUND");
    if (!existedPost) return ResponseBuilder.NotFound(res, "POST_NOT_FOUND");
    if (!existedPost.downvotedUsers.some((e) => e.id == user.id))
      return ResponseBuilder.BadRequest(res, "NOT_DOWNVOTE_YET");

    existedPost.downvotedUsers = existedPost.downvotedUsers.filter(
      (e) => e.id != userID
    );
    existedPost.downvote--;

    await postRepository.save(existedPost);
    return ResponseBuilder.Ok(
      res,
      POST_RESPONSE_SCHEMA.parse(existedPost)
    );
  } catch (e) {
    log.error(e);
    return ResponseBuilder.InternalServerError(res, e);
  }
}
