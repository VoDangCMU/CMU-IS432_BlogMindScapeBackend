import {Router} from "express";
import {logout} from "@routes/user/logout";
import {isAuth} from "@root/middlewares/isAuth";
import getUserByID from "@routes/user/getUserByID";

const user = Router();

user.use(isAuth)
user.post('/:id', logout)
user.get('/:id', getUserByID)
user.post('/logout', logout)

export default user;
module.exports = user;