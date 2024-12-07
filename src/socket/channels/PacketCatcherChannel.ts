import {Socket} from "socket.io";
import log from "@services/logger";

export default function PacketCatcherChannel(socket: Socket) {
	socket.onAny((eventName, data) => {
		log.socket(eventName, " - ", data);
	});
}