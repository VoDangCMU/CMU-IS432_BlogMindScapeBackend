import { z } from "zod";

const NumberSchema = z.string().regex(/^\d+$/).transform(Number);

const CommonSchema = {
  NumberSchema
}
export default CommonSchema;
module.exports = CommonSchema;