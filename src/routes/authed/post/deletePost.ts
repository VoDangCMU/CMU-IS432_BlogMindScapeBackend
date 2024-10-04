import { Request, Response } from "express";
import ResponseBuilder from "@services/responseBuilder";
import { AppDataSource } from "@database/DataSource";
import C from "@schemas/Schemas";
import Post from "@database/models/Post";
import log from "@services/logger";

const postRepository = AppDataSource.getRepository(Post);

export default async function deletePost(req: Request, res: Response) {
  let postID, userID;

  try {
    postID = C.NUMBER.parse(req.params.id);
    userID = C.NUMBER.parse(req.headers["userID"]);
  } catch (e) {
    log("warn", e);
    return ResponseBuilder.BadRequest(res, e);
  }

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
    log("error", e);
    return ResponseBuilder.InternalServerError(res, e);
  }
}
