import {z} from "zod";

export const MAIL = z.string().email();

export default MAIL;