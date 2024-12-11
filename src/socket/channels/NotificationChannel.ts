import { Socket } from 'socket.io';
import log from '@services/logger';
import PREFIXS from '@root/socket/PREFIXS';
import { decodeToken, ITokenPayload } from '@services/jwt';
import { AppDataSource } from '@database/DataSource';
import Notification from '@models/Notification';

const NotificationRepository = AppDataSource.getRepository(Notification);

export default function NotificationChannel(socket: Socket) {
	let payload: ITokenPayload = {
		userID: socket.handshake.auth.serverRoom,
		sessionID: 'not bound',
	};

	if (!socket.handshake.auth.isServer) {
		log.socket('External connection successfully initialize');
		const token = socket.handshake.auth.token;
		payload = decodeToken(token)!;
	}

	NotificationRepository.find({
		where: { target: { id: parseInt(payload.userID, 10) } },
		relations: { target: true, interactor: true },
	}).then((voteNotifications) => {
		log.socket('Sending notification to client');
		socket.emit(PREFIXS.NOTIFICATION, voteNotifications);
	});
}
