import { z } from 'zod';

export const URL = z.string().url();

export default URL;
