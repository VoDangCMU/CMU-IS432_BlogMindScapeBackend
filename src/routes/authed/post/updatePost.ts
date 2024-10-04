import { Request, Response } from "express";
import ResponseBuilder from "@services/responseBuilder";
import { AppDataSource } from "@database/DataSource";
import PostSchema from "@schemas/PostSchema";
import Post from "@database/models/Post";
import C from "@schemas/Schemas";
import log from "@services/logger";

const postRepository = AppDataSource.getRepository(Post);

export default async function updatePost(req: Request, res: Response) {
  let reqBody, userID;

  try {
    reqBody = PostSchema.UpdateSchema.parse(req.body);
    userID = C.NUMBER.parse(req.headers["userID"]);
  } catch (e) {
    log("warn", e);
    return ResponseBuilder.BadRequest(res, e);
  }

  try {
    const existedPost = await postRepository.findOne({
      where: { id: reqBody.id },
    });

    if (!existedPost) ResponseBuilder.NotFound(res, "POST_NOT_FOUND");
    if (existedPost?.user.id != userID)
      ResponseBuilder.Forbidden(res, "NOT_OWN_POST");

    await postRepository.save(reqBody);

    const updatedPost = await postRepository.findOne({
      where: { id: reqBody.id },
      relations: { user: true },
    });

    return ResponseBuilder.Ok(
      res,
      PostSchema.ResponseSchema.parse(updatedPost!)
    );
  } catch (e) {
    log("error", e);
    return ResponseBuilder.InternalServerError(res, e);
  }
}
