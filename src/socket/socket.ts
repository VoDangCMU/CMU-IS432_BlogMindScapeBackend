import {Server} from "socket.io";
import isAuth from "@root/socket/middlewares/isAuth";
import log from "@services/logger";
import {decodeToken, ITokenPayload} from "@services/jwt";
import ServerDeliveryChannel from "@root/socket/channels/ServerDeliveryChannel";
import PacketCatcherChannel from "@root/socket/channels/PacketCatcherChannel";
import NotificationChannel from "@root/socket/channels/NotificationChannel";

export function loadSocket(http: any) {
	const io = new Server(http, {
		cors: {origin: "*",}
	});

	io.use(isAuth);
	io.on("connection", (socket) => {
		const isServer = socket.handshake.auth.isServer;
		const token = socket.handshake.auth.token;
		let payload: ITokenPayload = {
			userID: socket.handshake.auth.serverRoom,
			sessionID: 'not bound'
		}
		if (!socket.handshake.auth.isServer) {
			log.socket("External connection successfully initialize")
			payload = decodeToken(token)!;
		}
		log.socket(`Room ${payload.userID} has successfully created`);
		if (!isServer)
			NotificationChannel(socket)
		ServerDeliveryChannel(socket);
		PacketCatcherChannel(socket);
	});

	return http;
}