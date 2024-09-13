import jwt from 'jsonwebtoken';

import env from '../env';

export function signToken(userID: string): string {
  const token = jwt.sign({userID}, env.TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: "7d"
  })

  return token;
}