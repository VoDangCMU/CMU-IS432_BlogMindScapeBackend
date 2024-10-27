import {Router} from "express";
import register from "@routes/public/auth/register";
import login from "@routes/public/auth/login";

const auth = Router();

auth.post("/register", register);
auth.post("/login", login);

export default auth;
module.exports = auth;
