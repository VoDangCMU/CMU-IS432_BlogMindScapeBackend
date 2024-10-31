import {decodeToken, signToken} from '@services/jwt';

test('Sign and Decode token', () => {
	const payload = '4';

	const jwt = signToken(payload);
	const decoded = decodeToken(jwt);
	expect(decoded).toBe(payload);
})