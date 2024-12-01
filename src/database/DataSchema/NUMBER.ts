import {z} from "zod";

export const NUMBER = z.union([
	z.string().regex(/^\d+$/).transform(Number),
	z.number(),
]);

export default NUMBER;