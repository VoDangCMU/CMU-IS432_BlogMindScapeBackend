import { Router } from "express";

import getPostByID from "./getPostByID";
import createPost from "./createPost";
import deletePost from "./deletePost";
import updatePost from "./updatePost";
import upvotePost from "./upvotePost";
import downvotePost from "./downvotePost";
import unUpvotePost from "./unUpvotePost";
import unDownvotePost from "./unDownvotePost";

const post = Router();

post.get("/:id", getPostByID);
post.post("/", createPost);
post.delete("/:id", deletePost);
post.put("/", updatePost);
post.put("/upvote/:id", upvotePost);
post.put("/downvote/:id", downvotePost);
post.delete("/upvote/:id", unUpvotePost);
post.delete("/downvote/:id", unDownvotePost);

export default post;
module.exports = post;
