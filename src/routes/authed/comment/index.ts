import { Router } from "express";
import createComment from "./createComment";

const comment = Router();

export default comment;

comment.post('/', createComment);

module.exports = comment;
