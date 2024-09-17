import { Router } from "express";

const post = Router();

post.get("/", (req, res) => {
  let user = {
    id: 1,
    name: "Khoa"
  }

  res.status(200).json(user);
})

export default post;
module.exports = post;