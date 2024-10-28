import {Router} from "express";

import getPostByID from "./get/getPostByID";
import createPost from "./create/createPost";
import deletePost from "./delete/deletePost";
import updatePost from "./update/updatePost";
import upvotePost from "./update/upvotePost";
import downvotePost from "./update/downvotePost";
import unUpvotePost from "./delete/unUpvotePost";
import unDownvotePost from "./delete/unDownvotePost";
import getPostComments from "@routes/authed/post/get/getPostComments";
import getPostUpvotes from "@routes/authed/post/get/getPostUpvotes";
import getPostDownvotes from "@routes/authed/post/get/getPostDownvotes";

const post = Router();

post.get("/:id", getPostByID);
post.post("/", createPost);
post.delete("/:id", deletePost);
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
