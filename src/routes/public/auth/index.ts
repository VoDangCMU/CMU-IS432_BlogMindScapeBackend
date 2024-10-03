import { CookieOptions, Router } from "express";
import User from "../../../database/models/User";
import { AppDataSource } from "../../../database/DataSource";
import UserSchema from "../../../schemas/UserSchema";
import { signToken } from "../../../services/jwt";
import { compare, hash } from "../../../services/hasher";
import ResponseBuilder from "../../../services/responseBuilder";

const auth = Router();

const userRepository = AppDataSource.getRepository(User)

auth.post("/register", async (req, res) => {
  try {
    const reqBody = UserSchema.FULL.parse(req.body);
    let user = new User();

    user.dateOfBirth = new Date(reqBody.dateOfBirth);
    user.fullname = reqBody.fullname;
    user.mail = reqBody.mail;
    user.username = reqBody.username;
    user.password = hash(reqBody.password);

    await userRepository.save(user);
    return ResponseBuilder.Ok(res, UserSchema.PASSLESS.parse(user));
  } catch (e) { return ResponseBuilder.BadRequest(res, e); }
})

auth.post("/login", async (req, res) => {
  try {
    const reqBody = UserSchema.LOGIN_PARAMS.parse(req.body);
    const user = await userRepository.findOne({ where: { username: reqBody.username } });

    if (user) {
      if (compare(reqBody.password, user.password)) {
        const token = signToken(user.id.toString());

        let expiresDate = new Date();
        expiresDate.setDate(expiresDate.getDate() + 7);

        const cookieOps: CookieOptions = {
          expires: (reqBody.keepLogin ? expiresDate : undefined),
          sameSite: "lax"
        }

        return res
          .cookie('jwt', token, cookieOps)
          .status(200)
          .json({ token })
      }
    }
    return ResponseBuilder.NotFound(res, "Could not find user or wrong password")
  } catch (e) { return ResponseBuilder.BadRequest(res, e); }
})

export default auth;
module.exports = auth;