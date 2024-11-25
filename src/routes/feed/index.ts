import {Router} from "express";
import getTop30Post from "@routes/feed/getTop30Post";
import getAllPosts from "@routes/feed/allPosts";
import {isAuth} from "@root/middlewares/isAuth";

const newsfeed = Router();

newsfeed.use(isAuth)
newsfeed.get("/top30", getTop30Post);
newsfeed.get("/allPosts/:page", getAllPosts);

export default newsfeed;
module.exports = newsfeed;


