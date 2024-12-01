import {z} from "zod";

export const DATE = z.union([z.string().transform(Date), z.date()]);

export default DATE;