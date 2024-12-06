import { Server, Socket } from "socket.io";
import PREFIXS from "@root/socket/PREFIXS";
import isAuth from "@root/socket/middlewares/isAuth";
import log from "@services/logger";
import {decodeToken} from "@services/jwt";

export function loadSocket(http: any) {
	const io = new Server(http, {
		cors: {
			origin: "*",
		}
	});

	// io.engine.use(isAuth);

	io.use(isAuth);
	io.on("connection", (socket) => {
		const token = socket.handshake.auth.token;
		const payload = decodeToken(token)!;
		socket.on(PREFIXS.MESSAGE, (data) => {
			log.socket(data);
		})

		socket.on(PREFIXS.NOTIFICATION, (data) => {
			log.socket(data);
		})

		socket.emit(PREFIXS.NOTIFICATION, "test")
	});

	return http;
}