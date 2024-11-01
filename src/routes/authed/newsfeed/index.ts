import {Router} from "express";
import getTop30Post from "@routes/authed/newsfeed/getTop30Post";
import getAllPosts from "@routes/authed/newsfeed/allPosts";

const newsfeed = Router();

newsfeed.get("/top30", getTop30Post);
newsfeed.get("/allPosts", getAllPosts);

export default newsfeed;
module.exports = newsfeed;


