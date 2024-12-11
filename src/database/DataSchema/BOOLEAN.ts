import { z } from 'zod';

export const BOOLEAN = z
	.enum(['true', 'false'])
	.transform((value) => value === 'true');

export default BOOLEAN;
