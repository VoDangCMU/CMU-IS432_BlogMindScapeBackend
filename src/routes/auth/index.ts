import {Router} from "express";
import register from "@routes/auth/register";
import login from "@routes/auth/login";
import me from "@routes/user/me";
import {isAuth} from "@root/middlewares/isAuth";

const auth = Router();

auth.post("/register", register);
auth.post("/login", login);

export default auth;
module.exports = auth;
