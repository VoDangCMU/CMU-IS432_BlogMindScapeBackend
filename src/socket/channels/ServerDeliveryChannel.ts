import Notification from '@models/Notification';
import log from '@services/logger';
import PREFIXS from '@root/socket/PREFIXS';
import { Socket } from 'socket.io';

export default function ServerDeliveryChannel(socket: Socket) {
	socket.on(PREFIXS.SERVER_DELIVERY, (data: Array<Notification>) => {
		if (data.length > 0) {
			const roomID = data[0].target.id.toString();
			log.socket('Forwarding notification to client ' + roomID);
			socket.to(roomID).emit(PREFIXS.NOTIFICATION, data);
		}
	});
}
