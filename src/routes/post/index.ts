import {Router} from "express";

import createPost from "./createPost";
import {isAuth} from "@root/middlewares/isAuth";
import {getPostByID, getPostComments, getPostDownvotes, getPostUpvotes} from "@routes/post/getPost";
import {downvotePost, updatePost, upvotePost} from "@routes/post/updatePost";
import {_deletePost, unDownvotePost, unUpvotePost} from "@routes/post/deletePost";

const post = Router();

post.use(isAuth)

post.get("/:id", getPostByID);
post.post("/", createPost);
post.delete("/:id", _deletePost);
post.put("/", updatePost);
post.put("/upvote/:id", upvotePost);
post.put("/downvote/:id", downvotePost);
post.delete("/upvote/:id", unUpvotePost);
post.delete("/downvote/:id", unDownvotePost);

post.get("/comments/:postId", getPostComments);
post.get("/upvotes/:postId", getPostUpvotes);
post.get("/downvotes/:postId", getPostDownvotes);

export default post;
module.exports = post;
