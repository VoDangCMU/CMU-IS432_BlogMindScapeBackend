import { Router } from "express";

import ResponseBuilder from "../../../services/responseBuilder";
import { Models, AppDataSource } from '../../../database'
import { PostSchema, CommonSchema } from "../../../schemas";

const User = Models.User;
const Post = Models.Post;
const postRepository = AppDataSource.getRepository(Post)
const userRepository = AppDataSource.getRepository(User)

const post = Router();

post.get("/:id", async (req, res) => {
  try {
    const id = CommonSchema.NumberSchema.parse(req.params.id);
    const existedPost = await postRepository.findOne({ 
      where: { id: id }, 
      relations: { user: true } 
    })

    if (existedPost)
      return ResponseBuilder
        .Ok(res, PostSchema.CreatePostResponseValidator.parse(existedPost));
    return ResponseBuilder.NotFound(res);
  } catch (e) {
    ResponseBuilder.BadRequest(res, e)
  }
})

post.post("/", async (req, res) => {
  try {
    const reqBody = PostSchema.CreatePostDataValidator.parse(req.body);
    const userID = parseInt(req.headers['userID'] as string, 10);
    const user = await userRepository.findOne({ where: { id: userID } });
    let createdPost = new Post();

    createdPost.title = reqBody.title;
    createdPost.body = reqBody.body;
    createdPost.user = user!;

    await postRepository.save(createdPost);

    return ResponseBuilder.Ok(res, PostSchema.CreatePostResponseValidator.parse(createdPost))
  } catch (e) {
    return ResponseBuilder.BadRequest(res, e);
  }
})

post.delete("/:id", async (req, res) => {
  try {
    const postID = CommonSchema.NumberSchema.parse(req.params.id)
    const userID = parseInt(req.headers['userID'] as string, 10);

    const deletedPost = await postRepository.findOne({ where: {id: postID }, relations: {user: true}})

    if (!deletedPost) return ResponseBuilder.NotFound(res);

    // If requested user not the post owner
    if (deletedPost.user.id != userID) return ResponseBuilder.Forbidden(res);

    postRepository.delete(postID);

    return ResponseBuilder.Ok(res, deletedPost);
  } catch (e) {
    return ResponseBuilder.BadRequest(res, e);
  }
})

post.put("/", async (req, res) => {
  try {
    const reqBody = PostSchema.UpdatePostParamsValidator.parse(req.body);

    const existedPost = postRepository.findOne({
      where: { id: reqBody.id }
    });

    if (!existedPost) ResponseBuilder.NotFound(res)

    await postRepository.save(reqBody)

    const updatedPost = await postRepository.findOne({
      where: { id: reqBody.id },
      relations: { user: true }
    })

    return ResponseBuilder.Ok(res, PostSchema.CreatePostResponseValidator.parse(updatedPost!));
  } catch (e) {
    return ResponseBuilder.BadRequest(res, e);
  }
})

export default post;
module.exports = post;