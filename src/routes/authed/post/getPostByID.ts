import { Request, Response } from "express";
import { Models, AppDataSource } from "../../../database";
import { PostSchema, CommonSchema } from "../../../schemas";
import ResponseBuilder from "../../../services/responseBuilder";

const Post = Models.Post;
const postRepository = AppDataSource.getRepository(Post);

export default async function getPostByID(req: Request, res: Response) {
  try {
    const id = CommonSchema.NUMBER.parse(req.params.id);
    const existedPost = await postRepository.findOne({
      where: { id: id },
      relations: {
        user: true,
        upvotedUsers: true,
        downvotedUsers: true,
        comments: {
          user: true
        }
      },
    });

    if (existedPost)
      return ResponseBuilder.Ok(
        res,
        PostSchema.GET.parse(existedPost)
      );
    return ResponseBuilder.NotFound(res, "POST_NOT_FOUND");
  } catch (e) {
    ResponseBuilder.BadRequest(res, e);
  }
}
