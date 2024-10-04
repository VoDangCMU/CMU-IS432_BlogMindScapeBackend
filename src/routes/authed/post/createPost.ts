import { Request, Response } from "express";
import { AppDataSource } from "@database/DataSource";
import ResponseBuilder from "@services/responseBuilder";
import PostSchema from "@schemas/PostSchema";
import log from "@services/logger";
import Post from "@database/models/Post";
import User from "@database/models/User";

const postRepository = AppDataSource.getRepository(Post);
const userRepository = AppDataSource.getRepository(User);

export default async function createPost(req: Request, res: Response) {
  let reqBody, userID;

  try {
    reqBody = PostSchema.CreateSchema.parse(req.body);
    userID = parseInt(req.headers["userID"] as string, 10);
  } catch (e) {
    log('warn', e);
    return ResponseBuilder.BadRequest(res, e);
  }
  try {
    const user = await userRepository.findOne({ where: { id: userID } });
    let createdPost = new Post();

    createdPost.title = reqBody.title;
    createdPost.body = reqBody.body;
    createdPost.user = user!;

    await postRepository.save(createdPost);

    log("info", createdPost);

    return ResponseBuilder.Ok(
      res,
      PostSchema.ResponseSchema.parse(createdPost)
    );
  } catch (e) {
    log('warn', e);
    return ResponseBuilder.InternalServerError(res);
  }
}
