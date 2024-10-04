import jwt from "jsonwebtoken";

import env from "../env";

const tokenOptions: jwt.SignOptions = {
  algorithm: "HS256",
  expiresIn: "7d",
};

export function signToken(userID: string): string {
  const token = jwt.sign({ userID }, env.TOKEN_SECRET, tokenOptions);

  return token;
}

export function decodeToken(token: string): string | null {
  const data: any = jwt.decode(token);

  if (data && data["userID"]) return data["userID"];
  return null;
}
