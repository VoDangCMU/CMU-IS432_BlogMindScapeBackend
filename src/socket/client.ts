import socketio from 'socket.io-client';
import env from "@root/env";
import PREFIXS from "@root/socket/PREFIXS";
import User from "@models/User";
import NotificationRepository from "@database/repo/NotificationRepository";
import log from "@services/logger";

export function emitNotification(target: User) {
	const io = socketio(`http://127.0.0.1:${env.APPLICATION_PORT}`, {
		auth: {
			token: env.TOKEN_SECRET,
			isServer: true
		}
	});

	io.on("connect_error", (err) => {
		log.warn(err.message); // not authorized
	});

	NotificationRepository.find({
		where: {target: {id: target.id}},
		relations: {target: true, interactor: true}
	})
		.then((notifications) => {io.emit(PREFIXS.SERVER_DELIVERY, notifications);})
		.catch(() => log.error("Error on emitting notification"));
}