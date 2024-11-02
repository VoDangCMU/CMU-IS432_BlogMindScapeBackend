import {Router} from "express";
import getTop30Post from "@routes/authed/feed/getTop30Post";
import getAllPosts from "@routes/authed/feed/allPosts";

const newsfeed = Router();

newsfeed.get("/top30", getTop30Post);
newsfeed.get("/allPosts/:page", getAllPosts);

export default newsfeed;
module.exports = newsfeed;


