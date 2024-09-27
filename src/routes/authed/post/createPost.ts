import { Request, Response } from "express";
import { PostSchema } from "../../../schemas";
import { AppDataSource, Models } from "../../../database";
import ResponseBuilder from "../../../services/responseBuilder";

const User = Models.User;
const Post = Models.Post;
const postRepository = AppDataSource.getRepository(Post);
const userRepository = AppDataSource.getRepository(User);

export default async function createPost(req: Request, res: Response) {
  try {
    const reqBody = PostSchema.CreatePostDataValidator.parse(req.body);
    const userID = parseInt(req.headers["userID"] as string, 10);
    const user = await userRepository.findOne({ where: { id: userID } });
    let createdPost = new Post();

    createdPost.title = reqBody.title;
    createdPost.body = reqBody.body;
    createdPost.user = user!;

    await postRepository.save(createdPost);

    return ResponseBuilder.Ok(
      res,
      PostSchema.PasswordlessPost.parse(createdPost)
    );
  } catch (e) {
    return ResponseBuilder.BadRequest(res, e);
  }
}
