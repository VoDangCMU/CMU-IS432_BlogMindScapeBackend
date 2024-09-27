import { Request, Response } from "express";
import { CommonSchema } from "../../../schemas";
import ResponseBuilder from "../../../services/responseBuilder";
import { AppDataSource, Models } from "../../../database";

const Post = Models.Post;
const postRepository = AppDataSource.getRepository(Post);

export default async function deletePost(req: Request, res: Response) {
  try {
    const postID = CommonSchema.NumberSchema.parse(req.params.id);
    const userID = parseInt(req.headers["userID"] as string, 10);

    const deletedPost = await postRepository.findOne({
      where: { id: postID },
      relations: { user: true },
    });

    if (!deletedPost) return ResponseBuilder.NotFound(res);

    if (deletedPost.user.id != userID)
      return ResponseBuilder.Forbidden(res, "NOT_OWN_POST");

    postRepository.delete(postID);

    return ResponseBuilder.Ok(res, deletedPost);
  } catch (e) {
    return ResponseBuilder.BadRequest(res, e);
  }
}
