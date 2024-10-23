import { Request, Response } from "express";
import ResponseBuilder from "@services/responseBuilder";
import C from "@database/repo/CommonSchemas";
import log from "@services/logger";
import { deletePost, findOnePost } from "@database/repo/PostRepository";

export default async function _deletePost(req: Request, res: Response) {
  let postID, userID;

  try {
    postID = C.NUMBER.parse(req.params.id);
    userID = C.NUMBER.parse(req.headers["userID"]);
  } catch (e) {
    log.warn(e);
    return ResponseBuilder.BadRequest(res, e);
  }

  try {
    const postID = C.NUMBER.parse(req.params.id);
    const userID = C.NUMBER.parse(req.headers["userID"]);

    const deletedPost = await findOnePost({
      where: { id: postID },
      relations: { user: true },
    });

    if (!deletedPost) return ResponseBuilder.NotFound(res);

    if (deletedPost.user.id != userID)
      return ResponseBuilder.Forbidden(res, "NOT_OWN_POST");

    await deletePost(postID);

    return ResponseBuilder.Ok(res, deletedPost);
  } catch (e) {
    log.error(e);
    return ResponseBuilder.InternalServerError(res, e);
  }
}
