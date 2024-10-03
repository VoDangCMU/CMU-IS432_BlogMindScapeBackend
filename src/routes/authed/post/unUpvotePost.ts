import { Request, Response } from "express";
import { CommonSchema, PostSchema } from "../../../schemas";
import ResponseBuilder from "../../../services/responseBuilder";
import { AppDataSource, Models } from "../../../database";

const User = Models.User;
const Post = Models.Post;
const postRepository = AppDataSource.getRepository(Post);
const userRepository = AppDataSource.getRepository(User);

export default async function unUpvotePost(req: Request, res: Response) {
  try {
    const postID = CommonSchema.NUMBER.parse(req.params.id);
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
    if (!existedPost.upvotedUsers.some((e) => e.id == user.id))
      return ResponseBuilder.BadRequest(res, "NOT_UPVOTED_YET");

    existedPost.upvotedUsers = existedPost.upvotedUsers.filter(
      (e) => e.id != userID
    );
    existedPost.upvote--;

    await postRepository.save(existedPost);
    return ResponseBuilder.Ok(
      res,
      PostSchema.GET.parse(existedPost)
    );
  } catch (e) {
    return ResponseBuilder.BadRequest(res, e);
  }
}
