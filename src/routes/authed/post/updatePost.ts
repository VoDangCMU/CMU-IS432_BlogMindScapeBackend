import { Request, Response } from "express";
import { PostSchema } from "../../../schemas";
import ResponseBuilder from "../../../services/responseBuilder";
import { AppDataSource, Models } from "../../../database";

const Post = Models.Post;
const postRepository = AppDataSource.getRepository(Post);

export default async function updatePost(req: Request, res: Response) {
  try {
    const reqBody = PostSchema.UpdatePostParamsValidator.parse(req.body);
    const userID = parseInt(req.headers["userID"] as string, 10);

    const existedPost = await postRepository.findOne({
      where: { id: reqBody.id },
    });

    if (!existedPost) ResponseBuilder.NotFound(res, "POST_NOT_FOUND");
    if (existedPost?.user.id != userID) ResponseBuilder.Forbidden(res, "NOT_OWN_POST");

    await postRepository.save(reqBody);

    const updatedPost = await postRepository.findOne({
      where: { id: reqBody.id },
      relations: { user: true },
    });

    return ResponseBuilder.Ok(
      res,
      PostSchema.PasswordlessPost.parse(updatedPost!)
    );
  } catch (e) {
    return ResponseBuilder.BadRequest(res, e);
  }
}
