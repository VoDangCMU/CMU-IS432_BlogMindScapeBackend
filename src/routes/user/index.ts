import {Router} from "express";
import {logout} from "@routes/user/logout";
import {isAuth} from "@root/middlewares/isAuth";
import getUserByID from "@routes/user/getUserByID";
import me from "@routes/user/me";

import getUserUpvotes from "@routes/user/userUpvotes";
import getUserDownvotes from "@routes/user/userDownvotes";
import userPosts from "@routes/user/userPosts";
import {isDownvoted} from "@routes/post/postStatus";
import updateAvatar from "@routes/user/updateAvatar";

const user = Router();

user.use(isAuth);
user.post('/:id', isAuth, logout);
user.get('/:id', getUserByID);
user.post('/logout', isAuth, logout);
user.get("/current/userUpvotes", isAuth, getUserUpvotes);
user.get("/current/userDownvotes", isAuth, getUserDownvotes);
user.get('/current/me', isAuth, me)
user.get('/current/posts', isAuth, userPosts);

user.put("/updateAvatar", isAuth, updateAvatar);

module.exports = user;