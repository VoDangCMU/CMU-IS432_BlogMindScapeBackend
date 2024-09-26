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
    const _post = await postRepository.findOne({ 
      where: { id: id }, 
      relations: { user: true } 
    })

    if (_post)
      return ResponseBuilder
        .Ok(res, PostSchema.CreatePostResponseValidator.parse(_post));
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
    let _post = new Post();

    _post.title = reqBody.title;
    _post.body = reqBody.body;
    _post.user = user!;

    await postRepository.save(_post);

    return ResponseBuilder.Ok(res, PostSchema.CreatePostResponseValidator.parse(_post))
  } catch (e) {
    return ResponseBuilder.BadRequest(res, e);
  }
})

post.delete("/:id", async (req, res) => {
  try {
    const postID = CommonSchema.NumberSchema.parse(req.params.id)
    const userID = parseInt(req.headers['userID'] as string, 10);

    const _post = await postRepository.findOne({ where: {id: postID }, relations: {user: true}})

    if (!_post) return ResponseBuilder.NotFound(res);

    // If requested user not the post owner
    if (_post.user.id != userID) return ResponseBuilder.Forbidden(res);

    postRepository.delete(postID);

    return ResponseBuilder.Ok(res, _post);
  } catch (e) {
    return ResponseBuilder.BadRequest(res, e);
  }
})

export default post;
module.exports = post;