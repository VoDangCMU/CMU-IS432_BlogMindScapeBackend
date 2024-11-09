import {Request, Response, Router} from "express";
import {logout} from "@routes/authed/user/logout";

const user = Router();

user.post('/logout', logout)

export default user;
module.exports = user;