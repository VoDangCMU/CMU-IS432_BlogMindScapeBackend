import { z } from "zod";

export const NUMBER = z.union([
  z.string().regex(/^\d+$/).transform(Number),
  z.number(),
]);
export const DATE = z.union([z.string().transform(Date), z.date()]);
export const STRING = z.string();
export const BOOLEAN = z
  .enum(["true", "false"])
  .transform((value) => value === "true");
export const URL = z.string().url();
export const MAIL = z.string().email();

const C = {
  NUMBER,
  DATE,
  STRING,
  BOOLEAN,
  URL,
  MAIL,
};

export default C;
module.exports = C;
