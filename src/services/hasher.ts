import { hashSync, compareSync, genSaltSync } from "bcrypt";

import env from "../env";

export function hash(x: string): string {
  return hashSync(x, env.SALT_ROUND);
}

export function compare(text: string, digest: string): boolean {
  return compareSync(text, digest);
}
