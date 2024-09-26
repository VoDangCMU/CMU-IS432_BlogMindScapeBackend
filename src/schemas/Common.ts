import { z } from "zod";

const NumberSchema = z.union([
  z.string().regex(/^\d+$/).transform(Number),
  z.number()
]) 

const DateSchema = z.union([
  z.string().transform(Date),
  z.date()
]) 

const CommonSchema = {
  NumberSchema,
  DateSchema
}
export default CommonSchema;
module.exports = CommonSchema;