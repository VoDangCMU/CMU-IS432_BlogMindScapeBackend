import { Request, Response } from "express";
import ResponseBuilder from "@services/responseBuilder";
import { AppDataSource } from "@database/DataSource";
import C from "@schemas/Schemas";
import PostSchema from "@schemas/PostSchema";
import Post from "@database/models/Post";
import User from "@database/models/User";
import log from "@services/logger";

const postRepository = AppDataSource.getRepository(Post);
const userRepository = AppDataSource.getRepository(User);

export default async function unUpvotePost(req: Request, res: Response) {
  let postID, userID;

  try {
    postID = C.NUMBER.parse(req.params.id);
    userID = C.NUMBER.parse(req.headers["userID"]);
  } catch (e) {
    log("warn", e);
    return ResponseBuilder.BadRequest(res, e);
  }

  try {
    const user = await userRepository.findOne({
      where: { id: userID },
    });

    const existedPost = await postRepository.findOne({
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

    await postRepository.save(existedPost);
    return ResponseBuilder.Ok(
      res,
      PostSchema.ResponseSchema.parse(existedPost)
    );
  } catch (e) {
    log("error", e);
    return ResponseBuilder.InternalServerError(res);
  }
}
