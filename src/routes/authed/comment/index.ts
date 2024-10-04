import { Router } from "express";
import createComment from "./createComment";
import updateComment from "./updateComment";
import deleteComment from "./deleteComment";

const comment = Router();

export default comment;

comment.post("/", createComment);
comment.put("/", updateComment);
comment.delete("/:id", deleteComment);

module.exports = comment;
