import {Request, Response, Router} from "express";
import {logout} from "@routes/user/logout";
import {isAuth} from "@root/middlewares/isAuth";

const user = Router();

user.use(isAuth)
user.post('/:id', logout)
user.post('/logout', logout)

export default user;
module.exports = user;