import { CookieOptions, Router } from "express";
import { signToken } from "@services/jwt";
import { compare } from "@services/hasher";
import ResponseBuilder from "@services/responseBuilder";
import log from "@services/logger";
import userRepository, {
  createUser,
  USER_CREATE_SCHEMA,
  USER_LOGIN_PARAMS_SCHEMA,
  USER_RESPONSE_SCHEMA,
} from "@database/repo/UserRepository";

const auth = Router();

auth.post("/register", async (req, res) => {
  const parsed = USER_CREATE_SCHEMA.safeParse(req.body);

  if (parsed.error) {
    log.warn(parsed.error);
    return ResponseBuilder.BadRequest(res, parsed.error);
  }

  const reqBody = parsed.data

  try {
    const createdUser = await createUser(reqBody);
    return ResponseBuilder.Ok(
      res,
      USER_RESPONSE_SCHEMA.parse(createdUser)
    );
  } catch (e) {
    log.error(e);
    return ResponseBuilder.InternalServerError(res);
  }
});

auth.post("/login", async (req, res) => {
  let parsed = USER_LOGIN_PARAMS_SCHEMA.safeParse(req.body);;

  if (parsed.error) {
    log.warn(parsed.error);
    return ResponseBuilder.BadRequest(res, parsed.error);
  }

  const reqBody = parsed.data;
  const user = await userRepository.findOne({ where: { username: reqBody.username } });

  if (user) {
    if (compare(reqBody.password, user.password)) {
      const token = signToken(user.id.toString());

      let expiresDate = new Date();
      expiresDate.setDate(expiresDate.getDate() + 7);

      const cookieOps: CookieOptions = {
        expires: reqBody.keepLogin ? expiresDate : undefined,
        sameSite: "lax",
      };

      return res.cookie("jwt", token, cookieOps).status(200).json({ token });
    }
  }
  return ResponseBuilder.NotFound(res, "Could not find user or wrong password");
});

export default auth;
module.exports = auth;
