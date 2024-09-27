import { Request, Response } from "express";
import { CommonSchema, PostSchema } from "../../../schemas";
import { AppDataSource, Models } from "../../../database";
import ResponseBuilder from "../../../services/responseBuilder";

const User = Models.User;
const Post = Models.Post;
const postRepository = AppDataSource.getRepository(Post);
const userRepository = AppDataSource.getRepository(User);

export default async function unDownvotePost(req: Request, res: Response) {
  try {
    const postID = CommonSchema.NumberSchema.parse(req.params.id);
    const userID = parseInt(req.headers["userID"] as string, 10);

    const user = await userRepository.findOne({
      where: { id: userID },
    });

    const existedPost = await postRepository.findOne({
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
      PostSchema.PasswordlessPost.parse(existedPost)
    );
  } catch (e) {
    return ResponseBuilder.BadRequest(res, e);
  }
}
