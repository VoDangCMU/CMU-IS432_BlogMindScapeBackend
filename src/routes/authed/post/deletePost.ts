import { Request, Response } from "express";
import ResponseBuilder from "@services/responseBuilder";
import { AppDataSource, Models } from "@database/index";
import C from "@schemas/Schemas";

const Post = Models.Post;
const postRepository = AppDataSource.getRepository(Post);

export default async function deletePost(req: Request, res: Response) {
  try {
    const postID = C.NUMBER.parse(req.params.id);
    const userID = C.NUMBER.parse(req.headers["userID"]);

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
