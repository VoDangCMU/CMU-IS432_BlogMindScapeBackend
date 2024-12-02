import {Router} from "express";
import {logout} from "@routes/user/logout";
import {isAuth} from "@root/middlewares/isAuth";
import getUserByID from "@routes/user/getUserByID";
import me from "@routes/user/me";

const user = Router();

user.use(isAuth)
user.post('/:id', logout)
user.get('/:id', getUserByID)
user.post('/logout', logout)
user.get('/current/me', me)

export default user;
module.exports = user;