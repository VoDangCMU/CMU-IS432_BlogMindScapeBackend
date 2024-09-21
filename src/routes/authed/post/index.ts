import { Router } from "express";
import { z } from "zod";
import Post from "../../../database/models/Post";
import { AppDataSource } from "../../../database/DataSource";

const post = Router();

const postRepository = AppDataSource.getRepository(Post)

post.get("/:id", async (req, res) => {
  try {
    const id = z.string().regex(/^\d+$/).transform(Number).parse(req.params.id);
    const post = await postRepository.findOne({where: { id: id }})
  
    if (post)
      return res.status(200).json(post);
    res.status(404).json({
      message: "Not Found"
    });
  } catch(e) {
    res.status(400).json({
      message: "Bad Request"
    })
  }
})

export default post;
module.exports = post;