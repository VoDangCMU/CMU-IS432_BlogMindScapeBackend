import {Router} from "express";

import createPost from "./createPost";
import {isAuth} from "@root/middlewares/isAuth";
import {getPostByID, getPostComments, getPostDownvotes, getPostUpvotes, getUserPosts} from "@routes/post/getPost";
import {downvotePost, updatePost, upvotePost} from "@routes/post/updatePost";
import {_deletePost, unDownvotePost, unUpvotePost} from "@routes/post/deletePost";
import {getVoteStatus, isDownvoted, isUpvoted} from "@routes/post/postStatus";

const post = Router();


post.get("/:id", getPostByID);
post.post("/", isAuth, createPost);
post.delete("/:id", isAuth, _deletePost);
post.put("/", isAuth, updatePost);
post.put("/upvote/:id", isAuth, upvotePost);
post.put("/downvote/:id", isAuth, downvotePost);
post.delete("/upvote/:id", isAuth, unUpvotePost);
post.delete("/downvote/:id", isAuth, unDownvotePost);

post.get("/comments/:postId", isAuth, getPostComments);
post.get("/upvotes/:postId", getPostUpvotes);
post.get("/downvotes/:postId", getPostDownvotes);

post.get("/status/upvote/:id", isAuth, isUpvoted);
post.get("/status/downvote/:id", isAuth, isDownvoted);
post.get("/status/vote/:id", isAuth, getVoteStatus);

post.get("/user/:id", getUserPosts);

module.exports = post;
