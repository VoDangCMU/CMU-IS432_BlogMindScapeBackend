import {Router} from "express";
import {logout} from "@routes/user/logout";
import {isAuth} from "@root/middlewares/isAuth";
import getUserByID from "@routes/user/getUserByID";
import getUserUpvotes from "@routes/user/userUpvotes";
import getUserDownvotes from "@routes/user/userDownvotes";

const user = Router();

user.use(isAuth);
user.post('/:id', logout);
user.get('/:id', getUserByID);
user.post('/logout', logout);
user.get("/current/userUpvotes", getUserUpvotes);
user.get("/current/userDownvotes", getUserDownvotes);

export default user;
module.exports = user;