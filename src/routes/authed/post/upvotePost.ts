import { Request, Response } from "express";
import ResponseBuilder from "@services/responseBuilder";
import { AppDataSource, Models } from "@database/index";
import C from "@schemas/Schemas";
import PostSchema from "@schemas/PostSchema";

const User = Models.User;
const Post = Models.Post;
const postRepository = AppDataSource.getRepository(Post);
const userRepository = AppDataSource.getRepository(User);

export default async function upvotePost(req: Request, res: Response) {
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
      PostSchema.ResponseSchema.parse(existedPost)
    );
  } catch (e) {
    return ResponseBuilder.BadRequest(res, e);
  }
}
