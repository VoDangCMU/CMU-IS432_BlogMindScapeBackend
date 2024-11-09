import jwt from "jsonwebtoken";

import env from "../env";

export interface ITokenPayload {
	userID: string;
	sessionID: string;
}

const tokenOptions: jwt.SignOptions = {
	algorithm: "HS256",
	expiresIn: "7d",
};

export function signToken(data: ITokenPayload): string {
	const token = jwt.sign(data, env.TOKEN_SECRET, tokenOptions);

	return token;
}

export function decodeToken(token: string): ITokenPayload | null {
	const data: any = jwt.decode(token);

	if (data) return data as ITokenPayload;
	return null;
}
