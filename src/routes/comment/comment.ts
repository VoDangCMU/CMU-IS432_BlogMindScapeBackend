import {Router} from "express";
import createComment from "./createComment";
import updateComment from "./updateComment";
import deleteComment from "./deleteComment";
import {isAuth} from "@root/middlewares/isAuth";

const comment = Router();

comment.use(isAuth);
comment.post("/", createComment);
comment.put("/", updateComment);
comment.delete("/:id", deleteComment);

module.exports = comment;