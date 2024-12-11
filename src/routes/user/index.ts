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
user.post('/:id', logout);
user.get('/:id', getUserByID);
user.post('/logout', logout);
user.get("/current/userUpvotes", getUserUpvotes);
user.get("/current/userDownvotes", getUserDownvotes);
user.get('/current/me', me)
user.get('/current/posts', userPosts);

user.put("/updateAvatar", updateAvatar);

module.exports = user;