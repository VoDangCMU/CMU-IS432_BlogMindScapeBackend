import { Request, Response } from "express";
import { AppDataSource, Models } from "@database/index";
import ResponseBuilder from "@services/responseBuilder";
import C from "@schemas/Schemas";
import PostSchema from "@schemas/PostSchema";

const User = Models.User;
const Post = Models.Post;
const postRepository = AppDataSource.getRepository(Post);
const userRepository = AppDataSource.getRepository(User);

export default async function downvotePost(req: Request, res: Response) {
  try {
    const postID = C.NUMBER.parse(req.params.id);
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
    if (existedPost.downvotedUsers.some((e) => e.id == user.id))
      return ResponseBuilder.BadRequest(res, "ALREADY_DOWNVOTE");
    if (existedPost.upvotedUsers.some((e) => e.id == user.id))
      return ResponseBuilder.BadRequest(res, "ALREADY_UPVOTED");

    existedPost.downvotedUsers.push(user);
    existedPost.downvote++;

    await postRepository.save(existedPost);
    return ResponseBuilder.Ok(
      res,
      PostSchema.ResponseSchema.parse(existedPost)
    );
  } catch (e) {
    return ResponseBuilder.BadRequest(res, e);
  }
}
