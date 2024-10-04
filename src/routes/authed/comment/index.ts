import { Router } from "express";
import createComment from "./createComment";
import updateComment from "./updateComment";

const comment = Router();

export default comment;

comment.post('/', createComment);
comment.put('/', updateComment);

module.exports = comment;
