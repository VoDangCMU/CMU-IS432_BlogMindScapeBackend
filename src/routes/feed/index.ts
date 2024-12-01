import {Router} from "express";
import getTop30Post from "@routes/feed/getTop30Post";
import {isAuth} from "@root/middlewares/isAuth";
import getAllPostsByPage from "@routes/feed/allPostsByPage";
import getAllPosts from "@routes/feed/allPosts";

const newsfeed = Router();

newsfeed.use(isAuth)
newsfeed.get("/top30", getTop30Post);
newsfeed.get("/allPosts/:page", getAllPostsByPage);
newsfeed.get("/allPosts", getAllPosts);

export default newsfeed;
module.exports = newsfeed;
