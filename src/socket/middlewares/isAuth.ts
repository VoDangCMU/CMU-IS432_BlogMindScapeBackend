import {Socket} from "socket.io";
import log from "@services/logger";
import {decodeToken} from "@services/jwt";

export default function isAuth(socket: any, next: any) {
	const token = socket.handshake.auth.token;

	if (!token) {
		log.socket("No token provided");
		const err = new Error("No token provided");
		return next(err);
	}
	log.socket(token);

	log.socket("Token Detected");
	log.socket("Begin decoding");
	const payload = decodeToken(token);

	if (!payload) {
		log.socket("Invalid token");
		return next(new Error("Invalid token"));
	}

	socket.join(payload.userID);
	next();
}