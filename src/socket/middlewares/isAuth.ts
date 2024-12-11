import { Socket } from 'socket.io';
import log from '@services/logger';
import { decodeToken } from '@services/jwt';
import env from '@root/env';

export default function isAuth(socket: any, next: any) {
	const token = socket.handshake.auth.token;
	const isServer = socket.handshake.auth.isServer;

	if (!token) {
		log.socket('No token provided');
		const err = new Error('No token provided');
		return next(err);
	}

	if (isServer) {
		log.socket('Internal server connection detected');
		if (!token) {
			const err = new Error('Token Pass Phrase not found');
			return next(err);
		}
		if (token != env.TOKEN_SECRET) {
			const err = new Error('Pass Phrase Differ from server');
			return next(err);
		}
		return next();
	} else {
		log.socket('Outside connection detected');
		log.socket('TOKEN', token);
		log.socket('Token Detected');
		log.socket('Begin decoding');
		const payload = decodeToken(token);

		if (!payload) {
			log.socket('Invalid token');
			return next(new Error('Invalid token'));
		}

		socket.join(payload.userID);
		next();
	}
}
