import { Request, Response } from "express";
import { AppDataSource, Models } from "@database/index";
import ResponseBuilder from "@services/responseBuilder";
import PostSchema from "@schemas/PostSchema";
import log from "@services/logger";

const User = Models.User;
const Post = Models.Post;
const postRepository = AppDataSource.getRepository(Post);
const userRepository = AppDataSource.getRepository(User);

export default async function createPost(req: Request, res: Response) {
  try {
    const reqBody = PostSchema.CreateSchema.parse(req.body);
    const userID = parseInt(req.headers["userID"] as string, 10);
    const user = await userRepository.findOne({ where: { id: userID } });
    let createdPost = new Post();

    createdPost.title = reqBody.title;
    createdPost.body = reqBody.body;
    createdPost.user = user!;

    await postRepository.save(createdPost);

    log("info", "POST CREATED", createdPost);

    return ResponseBuilder.Ok(
      res,
      PostSchema.ResponseSchema.parse(createdPost)
    );
  } catch (e) {
    log('warn', e);
    return ResponseBuilder.BadRequest(res, e);
  }
}
