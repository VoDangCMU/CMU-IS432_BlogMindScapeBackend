import { decodeToken, ITokenPayload, signToken } from '@services/jwt';

test('Sign and Decode token', () => {
	const payload: ITokenPayload = {
		sessionID: 'test',
		userID: 'test',
	};

	const jwt = signToken(payload);
	const decoded = decodeToken(jwt);
	expect(decoded).toBe(payload);
});
