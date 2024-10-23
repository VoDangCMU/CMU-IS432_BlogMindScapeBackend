import { Request, Response } from "express";
import ResponseBuilder from "@services/responseBuilder";
import C from "@database/repo/CommonSchemas";
import log from "@services/logger";
import postRepository, { findOnePost, POST_RESPONSE_SCHEMA } from "@database/repo/PostRepository";
import { findOneUser } from "@database/repo/UserRepository";

export default async function upvotePost(req: Request, res: Response) {
  let postID, userID;

  try {
    postID = C.NUMBER.parse(req.params.id);
    userID = parseInt(req.headers["userID"] as string, 10);
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
        upvotedUsers: true,
      },
    });

    if (!user) return ResponseBuilder.NotFound(res, "USER");
    if (!existedPost) return ResponseBuilder.NotFound(res, "POST");
    if (existedPost.upvotedUsers.some((e) => e.id == user.id))
      return ResponseBuilder.BadRequest(res, "ALREADY_UPVOTED");

    existedPost.upvotedUsers.push(user);
    existedPost.upvote++;

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
